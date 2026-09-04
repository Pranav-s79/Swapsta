import { NextResponse } from "next/server";
import { notFound } from "@/server/api-response";
import { findById } from "@/server/listing-repository";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = findById(id);
  if (!listing) return notFound("Listing");
  return NextResponse.json({ listing }, { headers: { "Cache-Control": "no-store" } });
}
