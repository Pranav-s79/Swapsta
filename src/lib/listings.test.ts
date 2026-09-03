import { describe, expect, it } from "vitest";
import { distanceMiles, formatPrice, INITIAL_LISTINGS, matchScore, USER_LOCATION } from "./listings";

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
