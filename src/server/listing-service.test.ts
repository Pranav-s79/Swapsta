import { beforeEach, describe, expect, it } from "vitest";
import { INITIAL_LISTINGS } from "@/lib/listings";
import { draftListing, matchListings, recommendListings } from "./ai-service";
import { createListing, findById, listAll, resetListingRepositoryForTests } from "./listing-repository";
import { createListingSchema, listingQuerySchema } from "./listing-schema";
import { searchListings } from "./listing-service";

const validInput = {
  title: "USB-C Laptop Charger",
  description: "Working 65 watt charger with a two meter cable.",
  category: "Electronics",
  condition: "Good",
  listingType: "Sell",
  price: 18,
  image: "https://example.com/charger.jpg",
  seller: { id: "student-1", name: "Taylor Kim" },
  pickupLocation: "MSC",
} as const;

beforeEach(() => resetListingRepositoryForTests());

describe("listing validation", () => {
  it("accepts a complete sell listing", () => {
    expect(createListingSchema.parse(validInput)).toEqual(validInput);
  });

  it("requires a price only for sell listings", () => {
    expect(createListingSchema.safeParse({ ...validInput, price: undefined }).success).toBe(false);
    expect(createListingSchema.safeParse({ ...validInput, listingType: "Free", price: 18 }).success).toBe(false);
    expect(createListingSchema.safeParse({ ...validInput, listingType: "Free", price: undefined }).success).toBe(true);
  });

  it("rejects unknown pickup locations and extra fields", () => {
    expect(createListingSchema.safeParse({ ...validInput, pickupLocation: "Parking Lot Z" }).success).toBe(false);
    expect(createListingSchema.safeParse({ ...validInput, admin: true }).success).toBe(false);
  });

  it("requires latitude and longitude together", () => {
    expect(listingQuerySchema.safeParse({ lat: "30.6" }).success).toBe(false);
    expect(listingQuerySchema.safeParse({ lat: "30.6", lng: "-96.3" }).success).toBe(true);
  });
});

describe("listing repository", () => {
  it("creates an unverified listing and makes it retrievable", () => {
    const listing = createListing(createListingSchema.parse(validInput));
    expect(listing.id).toBeTruthy();
    expect(listing.seller).toMatchObject({ name: "Taylor Kim", initials: "TK", verified: false });
    expect(listing.location.shortName).toBe("MSC");
    expect(findById(listing.id)).toEqual(listing);
    expect(listAll()).toHaveLength(INITIAL_LISTINGS.length + 1);
  });

  it("resets mutable state between tests", () => {
    expect(listAll()).toHaveLength(INITIAL_LISTINGS.length);
  });
});

describe("listing search", () => {
  it("filters and sorts through validated query parameters", () => {
    const query = listingQuerySchema.parse({ q: "calculator engineering", category: "Electronics", sort: "lowest", maxPrice: "55" });
    const result = searchListings(query, INITIAL_LISTINGS);
    expect(result.total).toBeGreaterThanOrEqual(3);
    expect(result.items.every(({ listing }) => listing.category === "Electronics" && (listing.price ?? 0) <= 55)).toBe(true);
    expect(result.items[0].listing.price).toBe(40);
  });

  it("applies maximum distance from an explicit origin", () => {
    const query = listingQuerySchema.parse({ lat: "30.6122", lng: "-96.3414", maxDistance: "0.05" });
    const result = searchListings(query, INITIAL_LISTINGS);
    expect(result.items.every(({ distance }) => distance <= 0.05)).toBe(true);
  });
});

describe("rules-based AI service", () => {
  it("returns ranked matches with an auditable provider-independent score", () => {
    const results = matchListings({ query: "calculator for engineering class" });
    expect(results[0].listing.id).toBe("ti-84-ce");
    expect(results[0].reason).toContain("calculator");
  });

  it("drafts fields without inventing price or seller data", () => {
    expect(draftListing({ description: "Barely used desk lamp with three brightness settings." })).toEqual({
      title: "Barely used desk lamp with three brightness settings",
      category: "Furniture",
      condition: "Like new",
      description: "Barely used desk lamp with three brightness settings.",
      source: "rules",
    });
  });

  it("recommends seeded dorm items for moving context", () => {
    const results = recommendListings({ context: "moving into my dorm", limit: 3 });
    expect(results).toHaveLength(3);
    expect(results.every(({ score }) => score > 0)).toBe(true);
  });
});
