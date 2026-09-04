import { CampusLocation, distanceMiles, Listing, RankedListing, rankListings, USER_LOCATION } from "@/lib/listings";
import { listAll } from "./listing-repository";
import { ListingQuery } from "./listing-schema";

export interface ListingSearchResult {
  items: RankedListing[];
  total: number;
  query: ListingQuery;
}

function originFor(query: ListingQuery): CampusLocation {
  if (query.lat === undefined || query.lng === undefined) return USER_LOCATION;
  return { ...USER_LOCATION, name: "Provided location", shortName: "Current location", lat: query.lat, lng: query.lng };
}

function compareLowest(left: Listing, right: Listing): number {
  const price = (listing: Listing) => {
    if (listing.listingType === "Free") return 0;
    if (listing.listingType === "Trade") return Number.POSITIVE_INFINITY;
    return listing.price ?? Number.POSITIVE_INFINITY;
  };
  return price(left) - price(right);
}

export function searchListings(query: ListingQuery, listings: readonly Listing[] = listAll()): ListingSearchResult {
  const origin = originFor(query);
  const filtered = listings.filter((listing) => {
    if (query.category && listing.category !== query.category) return false;
    if (query.type && listing.listingType !== query.type) return false;
    if (query.condition && listing.condition !== query.condition) return false;
    if (query.maxPrice !== undefined && listing.listingType === "Sell" && (listing.price ?? Number.POSITIVE_INFINITY) > query.maxPrice) return false;
    if (query.maxDistance !== undefined && distanceMiles(origin, listing.location) > query.maxDistance) return false;
    return true;
  });

  const ranked = rankListings(filtered, query.q, origin);
  const sorted = [...ranked].sort((left, right) => {
    if (query.sort === "closest") return left.distance - right.distance;
    if (query.sort === "lowest") return compareLowest(left.listing, right.listing);
    if (query.sort === "newest") return new Date(right.listing.createdAt).getTime() - new Date(left.listing.createdAt).getTime();
    return right.score - left.score;
  });

  return { items: sorted.slice(0, query.limit), total: sorted.length, query };
}
