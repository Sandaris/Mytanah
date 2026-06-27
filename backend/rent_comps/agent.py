import json
import os
import re
from datetime import datetime, timezone

import litellm
from mcp import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters

from .schema import RentEstimate

MODEL = "gemini/gemini-2.5-flash"   # fast + cheap; swap to gemini-2.5-pro for better results
MAX_TURNS = 40
MAX_COST_USD = 2.0

ALLOWED_TOOLS = {
    "browser_navigate", "browser_evaluate", "browser_snapshot",
    "browser_click", "browser_type", "browser_press_key",
    "browser_wait_for", "browser_close",
}

SYSTEM_PROMPT = r"""You are a data-collection agent that fetches Malaysian residential rental prices for a given mukim using Playwright MCP browser tools.

SCOPE: mukim-wide aggregate rent only. No bedroom filtering, no specific building search.

## STEP-BY-STEP PROCEDURE

### Step 1 — Search Mudah.my first (most reliable)
Navigate to this URL (replace MUKIM with the actual mukim name, URL-encoded):
  https://www.mudah.my/malaysia/real-estate-for-rent?q=MUKIM

Wait 2 seconds, then call browser_evaluate with this EXACT JavaScript:
```
() => {
  const seen = new Set(); const prices = [];
  // Try multiple price selectors
  const selectors = ['[class*="price"]','[class*="Price"]','span[class*="amount"]','div[class*="listing"] [class*="price"]'];
  for (const sel of selectors) {
    document.querySelectorAll(sel).forEach(el => {
      const t = el.innerText || el.textContent || '';
      const m = t.match(/RM[\\s]*([\d,]+)/);
      if (m) { const v = parseFloat(m[1].replace(/,/g,'')); if (v>=200 && v<=30000 && !seen.has(v)) { seen.add(v); prices.push(v); } }
    });
    if (prices.length >= 5) break;
  }
  prices.sort((a,b)=>a-b);
  const n=prices.length;
  const avg=n?Math.round(prices.reduce((s,v)=>s+v,0)/n):null;
  const median=n===0?null:n%2===0?(prices[n/2-1]+prices[n/2])/2:prices[Math.floor(n/2)];
  return {n, min:prices[0]||null, max:prices[n-1]||null, avg, median, sample:prices.slice(0,5)};
}
```

If n < 5, also try the ALL TEXT approach — scan all text nodes for price patterns:
```
() => {
  const seen = new Set(); const prices = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const t = node.textContent;
    const matches = [...t.matchAll(/RM\s*([\d,]+)/g)];
    for (const m of matches) {
      const v = parseFloat(m[1].replace(/,/g,''));
      if (v>=200 && v<=30000 && !seen.has(v)) { seen.add(v); prices.push(v); }
    }
    if (prices.length >= 30) break;
  }
  prices.sort((a,b)=>a-b);
  const n=prices.length;
  const avg=n?Math.round(prices.reduce((s,v)=>s+v,0)/n):null;
  const median=n===0?null:n%2===0?(prices[n/2-1]+prices[n/2])/2:prices[Math.floor(n/2)];
  return {n, min:prices[0]||null, max:prices[n-1]||null, avg, median};
}
```

### Step 2 — Try PropertyGuru (supplement)
Navigate to:
  https://www.propertyguru.com.my/property-for-rent?freetext=MUKIM&listing_type=rent

Wait 3 seconds (Cloudflare delay), then run the same browser_evaluate JS above.

### Step 3 — Aggregate and report
Combine unique prices from both sites. Do NOT click into any listing detail pages.

## CRITICAL RULES
- NEVER use ref= attributes from browser_snapshot as CSS selectors — they are internal Playwright refs, NOT DOM selectors and will always fail.
- Use browser_snapshot ONLY to diagnose why browser_evaluate returned zero results (e.g. to see if the page loaded).
- NEVER fabricate prices. If you truly cannot extract any prices, report listing_count=0.
- Only count prices that look like monthly rent: RM 200 – RM 30,000 range.

CONFIDENCE: "high" if listing_count >= 15 AND both sites used; "medium" if listing_count >= 8; "low" if 1–7; "none" if 0.

OUTPUT: your FINAL message must contain ONLY this fenced JSON block and absolutely nothing after the closing fence:
```json
{
  "mukim": "<mukim as given>",
  "avg_rent_myr": <number or null>,
  "min_rent_myr": <number or null>,
  "max_rent_myr": <number or null>,
  "median_rent_myr": <number or null>,
  "listing_count": <integer>,
  "sources_used": ["mudah.my"],
  "confidence": "high|medium|low|none",
  "notes": "<caveats or null>",
  "sample_listings": []
}
```"""

TASK_TEMPLATE = "Find market rent estimates for residential rentals in the mukim '{mukim}', Malaysia. Follow your instructions for target sites, sampling size, and the required JSON output format."


def _fallback(mukim: str, notes: str) -> RentEstimate:
    return RentEstimate(
        mukim=mukim,
        avg_rent_myr=None,
        min_rent_myr=None,
        max_rent_myr=None,
        median_rent_myr=None,
        listing_count=0,
        sources_used=[],
        confidence="none",
        fetched_at=datetime.now(timezone.utc).isoformat(),
        notes=notes,
        sample_listings=[],
    )


def _parse_result(mukim: str, raw: str) -> RentEstimate:
    try:
        # Try fenced block (strict then loose — model sometimes adds text after closing fence)
        match = re.search(r'```json\s*(\{.*?\})\s*```', raw, re.DOTALL)
        if not match:
            match = re.search(r'```json\s*(\{.*?\})', raw, re.DOTALL)
        if not match:
            # Last resort: any JSON object containing "mukim"
            match = re.search(r'(\{[^{}]*"mukim".*?\})', raw, re.DOTALL)
        if not match:
            return _fallback(mukim, f"No JSON block found in agent output: {repr(raw)[:300]}")
        data = json.loads(match.group(1))
        return RentEstimate(
            mukim=data.get("mukim", mukim),
            avg_rent_myr=data.get("avg_rent_myr"),
            min_rent_myr=data.get("min_rent_myr"),
            max_rent_myr=data.get("max_rent_myr"),
            median_rent_myr=data.get("median_rent_myr"),
            listing_count=data.get("listing_count", 0),
            sources_used=data.get("sources_used", []),
            confidence=data.get("confidence", "none"),
            fetched_at=datetime.now(timezone.utc).isoformat(),
            notes=data.get("notes"),
            sample_listings=data.get("sample_listings", []),
        )
    except Exception as e:
        return _fallback(mukim, f"Failed to parse agent output: {e}")


async def _run_agent(mukim: str) -> RentEstimate:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return _fallback(mukim, "GEMINI_API_KEY not set in environment")

    os.environ["GEMINI_API_KEY"] = api_key  # litellm reads this automatically

    server_params = StdioServerParameters(
        command="npx",
        args=["-y", "@playwright/mcp@latest"],
        env=None,
    )

    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()

                tools_response = await session.list_tools()
                # litellm uses OpenAI tool format
                tools = [
                    {
                        "type": "function",
                        "function": {
                            "name": t.name,
                            "description": t.description or "",
                            "parameters": t.inputSchema,
                        },
                    }
                    for t in tools_response.tools
                    if t.name in ALLOWED_TOOLS
                ]

                messages = [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": TASK_TEMPLATE.format(mukim=mukim)},
                ]

                total_cost = 0.0

                for _turn in range(MAX_TURNS):
                    response = await litellm.acompletion(
                        model=MODEL,
                        messages=messages,
                        tools=tools,
                        tool_choice="auto",
                        max_tokens=4096,
                    )

                    usage = response.usage
                    if usage:
                        turn_cost = (
                            getattr(usage, "prompt_tokens", 0) * 0.075
                            + getattr(usage, "completion_tokens", 0) * 0.30
                        ) / 1_000_000
                        total_cost += turn_cost

                    if total_cost > MAX_COST_USD:
                        return _fallback(mukim, f"Cost limit exceeded (${total_cost:.4f})")

                    choice = response.choices[0]
                    msg = choice.message
                    finish = choice.finish_reason

                    messages.append(msg.model_dump(exclude_none=True))

                    if finish == "stop" or (finish == "end_turn"):
                        final_text = msg.content or ""
                        return _parse_result(mukim, final_text)

                    tool_calls = getattr(msg, "tool_calls", None) or []
                    if not tool_calls:
                        # no tool calls and not "stop" — treat as done
                        final_text = msg.content or ""
                        return _parse_result(mukim, final_text)

                    tool_results = []
                    for tc in tool_calls:
                        fn = tc.function
                        try:
                            args = json.loads(fn.arguments) if isinstance(fn.arguments, str) else fn.arguments
                            result = await session.call_tool(fn.name, args)
                            content_parts = []
                            for item in result.content:
                                if hasattr(item, "text"):
                                    content_parts.append(item.text)
                                else:
                                    content_parts.append(str(item))
                            tool_results.append({
                                "role": "tool",
                                "tool_call_id": tc.id,
                                "content": "\n".join(content_parts),
                            })
                        except Exception as e:
                            tool_results.append({
                                "role": "tool",
                                "tool_call_id": tc.id,
                                "content": f"Tool error: {e}",
                            })

                    messages.extend(tool_results)

                return _fallback(mukim, "Max turns reached without final answer")

    except Exception as e:
        # unwrap Python 3.11+ ExceptionGroup from asyncio TaskGroup inside mcp's stdio_client
        if hasattr(e, "exceptions"):
            inner = "; ".join(str(ex) for ex in e.exceptions)
            return _fallback(mukim, f"Agent error: {inner}")
        return _fallback(mukim, f"Agent error: {e}")
