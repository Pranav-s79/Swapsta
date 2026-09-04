import { INITIAL_LISTINGS, Listing } from "@/lib/listings";

const CREATED_LISTINGS_KEY = "swappa.created-listings.v1";
const SAVED_LISTINGS_KEY = "swappa.saved-listings.v1";

function isListing(value: unknown): value is Listing {
  if (typeof value !== "object" || value === null) return false;
  const listing = value as Partial<Listing>;
  return (
    typeof listing.id === "string" &&
    typeof listing.title === "string" &&
    typeof listing.description === "string" &&
    typeof listing.category === "string" &&
    typeof listing.condition === "string" &&
    typeof listing.listingType === "string" &&
    typeof listing.image === "string" &&
    typeof listing.createdAt === "string" &&
    typeof listing.seller?.name === "string" &&
    typeof listing.location?.lat === "number" &&
    typeof listing.location?.lng === "number" &&
    Array.isArray(listing.tags)
  );
}

export function readCreatedListings(): Listing[] {
  if (typeof window === "undefined") return [];
  const stored = window.sessionStorage.getItem(CREATED_LISTINGS_KEY);
  if (!stored) return [];

  try {
    const value: unknown = JSON.parse(stored);
    return Array.isArray(value) ? value.filter(isListing) : [];
  } catch {
    return [];
  }
}

export function readAllListings(): Listing[] {
  return [...readCreatedListings(), ...INITIAL_LISTINGS];
}

export function saveCreatedListing(listing: Listing): void {
  const listings = [listing, ...readCreatedListings()];
  window.sessionStorage.setItem(CREATED_LISTINGS_KEY, JSON.stringify(listings));
}

export function readSavedListingIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const stored = window.localStorage.getItem(SAVED_LISTINGS_KEY);
  if (!stored) return new Set();

  try {
    const value: unknown = JSON.parse(stored);
    if (!Array.isArray(value)) return new Set();
    return new Set(value.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

export function writeSavedListingIds(ids: ReadonlySet<string>): void {
  window.localStorage.setItem(SAVED_LISTINGS_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new CustomEvent("swappa:saved-changed"));
}
