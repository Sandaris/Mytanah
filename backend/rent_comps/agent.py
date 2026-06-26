import json
import os
import re
from datetime import datetime, timezone

import anthropic
from mcp import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters

from .schema import RentEstimate

MODEL = "claude-sonnet-4-6"
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
            return _fallback(mukim, f"No JSON block found in agent output")
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
    try:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        base_url = os.environ.get("ANTHROPIC_BASE_URL")

        client_kwargs = {"api_key": api_key}
        if base_url:
            client_kwargs["base_url"] = base_url

        anthropic_client = anthropic.AsyncAnthropic(**client_kwargs)

        server_params = StdioServerParameters(
            command="npx",
            args=["-y", "@playwright/mcp@latest"],
            env=None,
        )

        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()

                tools_response = await session.list_tools()
                mcp_tools = [
                    {
                        "name": t.name,
                        "description": t.description or "",
                        "input_schema": t.inputSchema,
                    }
                    for t in tools_response.tools
                    if t.name in ALLOWED_TOOLS
                ]

                messages = [
                    {"role": "user", "content": TASK_TEMPLATE.format(mukim=mukim)}
                ]

                total_cost = 0.0

                for _turn in range(MAX_TURNS):
                    response = await anthropic_client.messages.create(
                        model=MODEL,
                        max_tokens=4096,
                        system=SYSTEM_PROMPT,
                        tools=mcp_tools,
                        messages=messages,
                    )

                    input_tokens = response.usage.input_tokens
                    output_tokens = response.usage.output_tokens
                    turn_cost = (input_tokens * 3 + output_tokens * 15) / 1_000_000
                    total_cost += turn_cost

                    if total_cost > MAX_COST_USD:
                        return _fallback(mukim, f"Cost limit exceeded (${total_cost:.3f})")

                    messages.append({"role": "assistant", "content": response.content})

                    if response.stop_reason == "end_turn":
                        final_text = ""
                        for block in response.content:
                            if hasattr(block, "text"):
                                final_text += block.text
                        return _parse_result(mukim, final_text)

                    tool_results = []
                    for block in response.content:
                        if block.type == "tool_use":
                            try:
                                tool_result = await session.call_tool(block.name, block.input)
                                result_content = []
                                for item in tool_result.content:
                                    if hasattr(item, "text"):
                                        result_content.append({"type": "text", "text": item.text})
                                    elif hasattr(item, "data"):
                                        result_content.append({
                                            "type": "image",
                                            "source": {
                                                "type": "base64",
                                                "media_type": getattr(item, "mimeType", "image/png"),
                                                "data": item.data,
                                            },
                                        })
                                    else:
                                        result_content.append({"type": "text", "text": str(item)})
                                tool_results.append({
                                    "type": "tool_result",
                                    "tool_use_id": block.id,
                                    "content": result_content,
                                })
                            except Exception as e:
                                tool_results.append({
                                    "type": "tool_result",
                                    "tool_use_id": block.id,
                                    "content": [{"type": "text", "text": f"Tool error: {e}"}],
                                    "is_error": True,
                                })

                    if tool_results:
                        messages.append({"role": "user", "content": tool_results})
                    else:
                        break

                return _fallback(mukim, "Max turns reached without final answer")

    except Exception as e:
        return _fallback(mukim, f"Agent error: {e}")
