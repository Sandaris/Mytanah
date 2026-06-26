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

SYSTEM_PROMPT = """You are a data-collection agent that fetches Malaysian residential rental prices for a given mukim using Playwright MCP browser tools.

SCOPE: mukim-wide aggregate rent, no bedroom or building filtering.

SITES (in priority order):
1. PropertyGuru.com.my — Cloudflare passes automatically after a brief wait; navigate then wait 2s.
2. Mudah.my — area-wide browsing only; do NOT attempt freetext building searches.

EXTRACTION: After navigating to search results, use a single browser_evaluate call to extract prices from the DOM. Do NOT use browser_snapshot for price extraction (use it only to diagnose zero-result pages). Do NOT click into individual listing detail pages.

PropertyGuru extraction JS:
() => {
  const seen = new Set(); const prices = [];
  document.querySelectorAll('[class*="price"]').forEach(el => {
    const m = el.innerText.match(/^RM ([\\d,]+) \\/mo/);
    if (m && !seen.has(m[1])) { seen.add(m[1]); prices.push(parseFloat(m[1].replace(/,/g,''))); }
  });
  prices.sort((a,b)=>a-b);
  const n=prices.length, avg=n?prices.reduce((s,v)=>s+v,0)/n:0;
  const median=n%2===0?(n>0?(prices[n/2-1]+prices[n/2])/2:null):prices[Math.floor(n/2)];
  return {prices,n,min:prices[0]||null,max:prices[n-1]||null,avg:Math.round(avg),median};
}

For Mudah.my adapt the querySelectorAll selector as needed.

STOPPING RULE: aim for 15-20 distinct rent figures combined; 1-2 result pages per site is enough.

FALLBACK: if one site is blocked or returns zero results, use the other alone and note it. If both return zero, report listing_count=0 and confidence="none". NEVER fabricate numbers.

CONFIDENCE: "high" if listing_count >= 15 AND both sites used; "medium" if listing_count >= 8; "low" if listing_count < 8 but > 0; "none" if 0.

OUTPUT: your final message must contain ONLY a fenced JSON block and nothing after the closing fence:
```json
{
  "mukim": "<the mukim string as given>",
  "avg_rent_myr": <float or null>,
  "min_rent_myr": <float or null>,
  "max_rent_myr": <float or null>,
  "median_rent_myr": <float or null>,
  "listing_count": <int>,
  "sources_used": ["propertyguru.com.my"],
  "confidence": "high|medium|low|none",
  "notes": "<any caveats or null>",
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
        match = re.search(r'```json\s*(\{.*?\})\s*```', raw, re.DOTALL)
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
