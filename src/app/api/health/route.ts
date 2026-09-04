import { NextResponse } from "next/server";
import { listAll } from "@/server/listing-repository";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", listingCount: listAll().length, storage: "process-memory" }, {
    headers: { "Cache-Control": "no-store" },
  });
}
