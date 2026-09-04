import { NextResponse } from "next/server";
import { CATEGORIES, INITIAL_LISTINGS } from "@/lib/listings";

export const dynamic = "force-dynamic";

const XAI_ENDPOINT = "https://api.x.ai/v1/chat/completions";
const XAI_MODEL = "grok-4.6";
const REQUEST_TIMEOUT_MS = 6000;
const MAX_TERMS = 6;

// A small, grounded vocabulary pulled from the actual seed catalog so Grok
// expands queries into terms that could plausibly exist as tags, instead of
// inventing brand names or categories that don't exist in this marketplace.
const KNOWN_TAGS = Array.from(new Set(INITIAL_LISTINGS.flatMap((listing) => listing.tags))).sort();

interface AiSearchResponse {
  enabled: boolean;
  terms: string[];
  expandedQuery: string;
  error?: string;
}

function disabledResponse(query: string): AiSearchResponse {
  return { enabled: false, terms: [], expandedQuery: query };
}

function sanitizeTerms(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const cleaned: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const term = item.trim().toLowerCase().slice(0, 30);
    if (!term || seen.has(term)) continue;
    seen.add(term);
    cleaned.push(term);
    if (cleaned.length >= MAX_TERMS) break;
  }
  return cleaned;
}

export async function POST(request: Request) {
  let query = "";
  try {
    const body = await request.json();
    query = typeof body?.query === "string" ? body.query.trim() : "";
  } catch {
    return NextResponse.json({ enabled: true, terms: [], expandedQuery: "", error: "invalid_body" }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json(disabledResponse(query));
  }

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(disabledResponse(query));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(XAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: XAI_MODEL,
        temperature: 0.2,
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content:
              "You expand vague campus-marketplace search phrases into concrete search keywords. " +
              'Reply with ONLY a JSON object like {"terms": ["lamp", "desk"]}. ' +
              "Return at most 6 short, lowercase, single-or-two-word terms naming physical items or " +
              "categories a student might list for sale, trade, or free. Ground terms in plausible " +
              "campus marketplace items. Do not invent brand names. No prose, no markdown, JSON only.",
          },
          {
            role: "user",
            content:
              `Student's search: "${query}"\n\n` +
              `Marketplace categories: ${CATEGORIES.filter((c) => c !== "All").join(", ")}\n` +
              `Example tags already in use: ${KNOWN_TAGS.slice(0, 60).join(", ")}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ enabled: true, terms: [], expandedQuery: query, error: `xai_${response.status}` });
    }

    const payload = await response.json();
    const content: string | undefined = payload?.choices?.[0]?.message?.content;
    let terms: string[] = [];

    if (content) {
      try {
        const jsonStart = content.indexOf("{");
        const jsonEnd = content.lastIndexOf("}");
        const parsed = JSON.parse(jsonStart >= 0 ? content.slice(jsonStart, jsonEnd + 1) : content);
        terms = sanitizeTerms(parsed?.terms);
      } catch {
        terms = [];
      }
    }

    const expandedQuery = terms.length > 0 ? `${query} ${terms.join(" ")}` : query;
    return NextResponse.json({ enabled: true, terms, expandedQuery } satisfies AiSearchResponse);
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return NextResponse.json({
      enabled: true,
      terms: [],
      expandedQuery: query,
      error: aborted ? "timeout" : "request_failed",
    });
  } finally {
    clearTimeout(timeout);
  }
}
