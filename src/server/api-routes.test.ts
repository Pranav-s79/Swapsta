import { beforeEach, describe, expect, it } from "vitest";
import { GET as getHealth } from "@/app/api/health/route";
import { GET as getListing } from "@/app/api/listings/[id]/route";
import { GET as getListings, POST as postListing } from "@/app/api/listings/route";
import { POST as postDraft } from "@/app/api/ai/listing/route";
import { POST as postMatch } from "@/app/api/ai/match/route";
import { POST as postRecommend } from "@/app/api/ai/recommend/route";
import { INITIAL_LISTINGS } from "@/lib/listings";
import { resetListingRepositoryForTests } from "./listing-repository";

const jsonRequest = (url: string, body: unknown) => new Request(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const validBody = {
  title: "USB-C Laptop Charger",
  description: "Working 65 watt charger with a two meter cable.",
  category: "Electronics",
  condition: "Good",
  listingType: "Sell",
  price: 18,
  image: "https://example.com/charger.jpg",
  seller: { id: "student-1", name: "Taylor Kim" },
  pickupLocation: "MSC",
};

beforeEach(() => resetListingRepositoryForTests());

describe("listing API", () => {
  it("returns filtered ranked listings", async () => {
    const response = await getListings(new Request("http://localhost/api/listings?q=calculator%20engineering&category=Electronics&limit=2"));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(2);
    expect(body.items[0].listing.id).toBe("ti-84-ce");
  });

  it("rejects unknown query parameters", async () => {
    const response = await getListings(new Request("http://localhost/api/listings?unsupported=true"));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: "VALIDATION_ERROR" } });
  });

  it("creates and retrieves a listing", async () => {
    const createdResponse = await postListing(jsonRequest("http://localhost/api/listings", validBody));
    const created = await createdResponse.json();
    expect(createdResponse.status).toBe(201);
    expect(createdResponse.headers.get("Location")).toBe(`/api/listings/${created.listing.id}`);

    const getResponse = await getListing(new Request(`http://localhost/api/listings/${created.listing.id}`), {
      params: Promise.resolve({ id: created.listing.id }),
    });
    expect(getResponse.status).toBe(200);
    expect((await getResponse.json()).listing.title).toBe(validBody.title);
  });

  it("returns structured errors for malformed JSON and invalid data", async () => {
    const malformed = await postListing(new Request("http://localhost/api/listings", { method: "POST", body: "{" }));
    expect(malformed.status).toBe(400);
    expect(await malformed.json()).toMatchObject({ error: { code: "INVALID_JSON" } });

    const invalid = await postListing(jsonRequest("http://localhost/api/listings", { ...validBody, price: -1 }));
    expect(invalid.status).toBe(400);
    expect(await invalid.json()).toMatchObject({ error: { code: "VALIDATION_ERROR", fields: { price: expect.any(Array) } } });
  });

  it("returns 404 for a missing listing", async () => {
    const response = await getListing(new Request("http://localhost/api/listings/missing"), { params: Promise.resolve({ id: "missing" }) });
    expect(response.status).toBe(404);
  });
});

describe("AI abstraction API", () => {
  it("matches, drafts, and recommends through rules-based providers", async () => {
    const matchResponse = await postMatch(jsonRequest("http://localhost/api/ai/match", { query: "calculator for engineering class" }));
    const matchBody = await matchResponse.json();
    expect(matchResponse.status).toBe(200);
    expect(matchBody.provider).toBe("rules");
    expect(matchBody.results[0].listing.id).toBe("ti-84-ce");

    const draftResponse = await postDraft(jsonRequest("http://localhost/api/ai/listing", { description: "Barely used mini fridge in good condition." }));
    expect(await draftResponse.json()).toMatchObject({ provider: "rules", draft: { category: "Dorm", condition: "Like new" } });

    const recommendResponse = await postRecommend(jsonRequest("http://localhost/api/ai/recommend", { context: "moving into my dorm", limit: 2 }));
    const recommendBody = await recommendResponse.json();
    expect(recommendBody.provider).toBe("rules");
    expect(recommendBody.results).toHaveLength(2);
  });
});

describe("health API", () => {
  it("reports repository status without claiming durable storage", async () => {
    const response = getHealth();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok", listingCount: INITIAL_LISTINGS.length, storage: "process-memory" });
  });
});
