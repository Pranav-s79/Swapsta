import { NextResponse } from "next/server";
import { createListing, listAll } from "@/server/listing-repository";
import { createListingSchema, listingQuerySchema } from "@/server/listing-schema";
import { searchListings } from "@/server/listing-service";
import { invalidJson, validationError } from "@/server/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = listingQuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return validationError(parsed.error);

  const result = searchListings(parsed.data, listAll());
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalidJson();
  }

  const parsed = createListingSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const listing = createListing(parsed.data);
  return NextResponse.json({ listing, persistence: "process-memory" }, {
    status: 201,
    headers: { Location: `/api/listings/${listing.id}`, "Cache-Control": "no-store" },
  });
}
