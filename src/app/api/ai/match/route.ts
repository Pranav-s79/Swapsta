import { NextResponse } from "next/server";
import { invalidJson, validationError } from "@/server/api-response";
import { matchListings } from "@/server/ai-service";
import { aiMatchSchema } from "@/server/listing-schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return invalidJson(); }
  const parsed = aiMatchSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const results = matchListings(parsed.data);
  return NextResponse.json({ provider: "rules", results }, { headers: { "Cache-Control": "no-store" } });
}
