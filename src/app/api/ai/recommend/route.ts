import { NextResponse } from "next/server";
import { invalidJson, validationError } from "@/server/api-response";
import { recommendListings } from "@/server/ai-service";
import { aiRecommendationSchema } from "@/server/listing-schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return invalidJson(); }
  const parsed = aiRecommendationSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  return NextResponse.json({ provider: "rules", results: recommendListings(parsed.data) }, { headers: { "Cache-Control": "no-store" } });
}
