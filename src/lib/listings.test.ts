import { describe, expect, it } from "vitest";
import {
  distanceMiles,
  formatPrice,
  INITIAL_LISTINGS,
  Listing,
  matchScore,
  rankListings,
  USER_LOCATION,
} from "./listings";

describe("distanceMiles", () => {
  it("returns zero for the same location", () => {
    expect(distanceMiles(USER_LOCATION, USER_LOCATION)).toBe(0);
  });

  it("calculates a plausible campus walking distance", () => {
    const distance = distanceMiles(USER_LOCATION, INITIAL_LISTINGS[0].location);
    expect(distance).toBeGreaterThan(0.5);
    expect(distance).toBeLessThan(0.8);
  });
});

describe("matchScore", () => {
  it("ranks a calculator for an engineering exam request", () => {
    const calculator = INITIAL_LISTINGS.find((listing) => listing.id === "ti-84-ce");
    const fridge = INITIAL_LISTINGS.find((listing) => listing.id === "mini-fridge");
    expect(calculator).toBeDefined();
    expect(fridge).toBeDefined();
    expect(matchScore(calculator!, "calculator for my engineering exam")).toBeGreaterThan(
      matchScore(fridge!, "calculator for my engineering exam"),
    );
  });

  it("expands dorm-moving intent without an AI dependency", () => {
    const bins = INITIAL_LISTINGS.find((listing) => listing.id === "storage-bins");
    expect(bins).toBeDefined();
    expect(matchScore(bins!, "moving into my dorm")).toBeGreaterThan(0);
  });
});

describe("formatPrice", () => {
  it("handles every listing type", () => {
    expect(formatPrice({ listingType: "Sell", price: 55 })).toBe("$55");
    expect(formatPrice({ listingType: "Trade" })).toBe("Trade");
    expect(formatPrice({ listingType: "Free" })).toBe("Free");
  });
});

describe("rankListings", () => {
  it("ranks the exact demo request and explains the result", () => {
    const results = rankListings(INITIAL_LISTINGS, "need a calculator for my engineering class tomorrow");

    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results[0].listing.id).toBe("ti-84-ce");
    expect(results[0].breakdown.relevance).toBeGreaterThan(0);
    expect(results[0].breakdown.proximity).toBeGreaterThan(0);
    expect(results[0].breakdown.affordability).toBeGreaterThan(0);
    expect(results[0].reason).toContain("Title matches calculator");
    expect(results[0].reason).toMatch(/mi away/);
    expect(results[0].reason).toContain("$55");
  });

  it("uses distance and price to break equally relevant results", () => {
    const base = INITIAL_LISTINGS[0];
    const variants: Listing[] = [
      { ...base, id: "far-expensive", price: 80, location: INITIAL_LISTINGS[4].location },
      { ...base, id: "near-cheap", price: 25, location: USER_LOCATION },
    ];

    const results = rankListings(variants, "calculator");
    expect(results[0].listing.id).toBe("near-cheap");
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it("handles empty queries deterministically", () => {
    const results = rankListings(INITIAL_LISTINGS, "");
    expect(results).toHaveLength(INITIAL_LISTINGS.length);
    expect(results.every((result) => result.breakdown.relevance === 0)).toBe(true);
  });

  it("scores free and trade listings without inventing a price", () => {
    const results = rankListings(INITIAL_LISTINGS, "dorm");
    const free = results.find((result) => result.listing.listingType === "Free");
    const trade = results.find((result) => result.listing.listingType === "Trade");

    expect(free?.breakdown.affordability).toBe(15);
    expect(free?.reason).toContain("free");
    expect(trade?.breakdown.affordability).toBe(8);
    expect(trade?.reason).toContain("available for trade");
  });

  it("returns no results when nothing is relevant", () => {
    expect(rankListings(INITIAL_LISTINGS, "concert tickets")).toEqual([]);
  });
});
