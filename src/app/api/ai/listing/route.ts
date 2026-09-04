import { NextResponse } from "next/server";
import { invalidJson, validationError } from "@/server/api-response";
import { draftListing } from "@/server/ai-service";
import { aiListingDraftSchema } from "@/server/listing-schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return invalidJson(); }
  const parsed = aiListingDraftSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  return NextResponse.json({ provider: "rules", draft: draftListing(parsed.data) });
}
