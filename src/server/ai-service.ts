import { Category, Condition, Listing, RankedListing, rankListings, USER_LOCATION } from "@/lib/listings";
import { listAll } from "./listing-repository";
import { AiListingDraftInput, AiMatchInput, AiRecommendationInput } from "./listing-schema";

export interface ListingDraft {
  title: string;
  category: Category;
  condition: Condition;
  description: string;
  source: "rules";
}

const CATEGORY_TERMS: ReadonlyArray<readonly [Category, readonly string[]]> = [
  ["Transportation", ["bike", "bicycle", "scooter", "helmet"]],
  ["Textbooks", ["textbook", "edition", "book"]],
  ["School Supplies", ["notebook", "binder", "lab coat", "calculator", "pencil"]],
  ["Electronics", ["calculator", "keyboard", "laptop", "monitor", "phone", "charger", "headphones"]],
  ["Furniture", ["chair", "desk", "shelf", "table", "dresser"]],
  ["Dorm", ["fridge", "lamp", "fan", "storage", "mattress", "dorm"]],
  ["Clothing", ["shirt", "jacket", "dress", "shoes", "jeans", "coat"]],
];

function categoryFrom(description: string): Category {
  const normalized = description.toLowerCase();
  return CATEGORY_TERMS.find(([, terms]) => terms.some((term) => normalized.includes(term)))?.[0] ?? "School Supplies";
}

function conditionFrom(description: string): Condition {
  const normalized = description.toLowerCase();
  if (/\b(new|unopened|sealed|unused)\b/.test(normalized)) return "New";
  if (/\b(like new|barely used|excellent)\b/.test(normalized)) return "Like new";
  if (/\b(fair|worn|scratched|old)\b/.test(normalized)) return "Fair";
  return "Good";
}

function titleFrom(description: string): string {
  const sentence = description.split(/[.!?]/, 1)[0].trim();
  const words = sentence.split(/\s+/).filter(Boolean).slice(0, 8);
  const title = words.join(" ").replace(/^./, (first) => first.toUpperCase());
  return title.length > 80 ? `${title.slice(0, 77).trim()}…` : title;
}

function scopedListings(ids: readonly string[] | undefined): Listing[] {
  const listings = listAll();
  if (!ids) return listings;
  const allowed = new Set(ids);
  return listings.filter((listing) => allowed.has(listing.id));
}

export function matchListings(input: AiMatchInput): RankedListing[] {
  const origin = input.lat !== undefined && input.lng !== undefined
    ? { ...USER_LOCATION, name: "Provided location", shortName: "Current location", lat: input.lat, lng: input.lng }
    : USER_LOCATION;
  return rankListings(scopedListings(input.listingIds), input.query, origin);
}

export function draftListing(input: AiListingDraftInput): ListingDraft {
  return {
    title: titleFrom(input.description),
    category: categoryFrom(input.description),
    condition: conditionFrom(input.description),
    description: input.description,
    source: "rules",
  };
}

export function recommendListings(input: AiRecommendationInput): RankedListing[] {
  return rankListings(listAll(), input.context, USER_LOCATION).slice(0, input.limit);
}
