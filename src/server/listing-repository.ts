import { CAMPUS_LOCATIONS, INITIAL_LISTINGS, Listing } from "@/lib/listings";
import { CreateListingInput } from "./listing-schema";

interface ListingStoreGlobal {
  __swappaListingStore?: Map<string, Listing>;
}

const processGlobal = globalThis as typeof globalThis & ListingStoreGlobal;

function store(): Map<string, Listing> {
  if (!processGlobal.__swappaListingStore) {
    processGlobal.__swappaListingStore = new Map(INITIAL_LISTINGS.map((listing) => [listing.id, listing]));
  }
  return processGlobal.__swappaListingStore;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function tagsFor(input: CreateListingInput): string[] {
  return Array.from(new Set(
    `${input.title} ${input.description} ${input.category}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2),
  ));
}

export function listAll(): Listing[] {
  return Array.from(store().values());
}

export function findById(id: string): Listing | undefined {
  return store().get(id);
}

export function createListing(input: CreateListingInput): Listing {
  const location = CAMPUS_LOCATIONS.find(
    (candidate) => candidate.name === input.pickupLocation || candidate.shortName === input.pickupLocation,
  );
  if (!location) throw new Error(`Validated campus location is unavailable: ${input.pickupLocation}`);

  const listing: Listing = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    category: input.category,
    condition: input.condition,
    listingType: input.listingType,
    price: input.price,
    image: input.image,
    imageAlt: input.title,
    seller: {
      id: input.seller.id,
      name: input.seller.name,
      initials: initials(input.seller.name),
      verified: false,
    },
    location,
    createdAt: new Date().toISOString(),
    tags: tagsFor(input),
  };

  store().set(listing.id, listing);
  return listing;
}

export function resetListingRepositoryForTests(): void {
  processGlobal.__swappaListingStore = new Map(INITIAL_LISTINGS.map((listing) => [listing.id, listing]));
}
