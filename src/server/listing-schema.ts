import { z } from "zod";
import { CAMPUS_LOCATIONS, CATEGORIES, Category, Condition, ListingType } from "@/lib/listings";

const categories = CATEGORIES.filter((category): category is Category => category !== "All");
const conditions: readonly Condition[] = ["New", "Like new", "Good", "Fair"];
const listingTypes: readonly ListingType[] = ["Sell", "Trade", "Free"];

const categorySchema = z.string().refine((value): value is Category => categories.includes(value as Category), {
  message: `Category must be one of: ${categories.join(", ")}`,
});

const conditionSchema = z.string().refine((value): value is Condition => conditions.includes(value as Condition), {
  message: `Condition must be one of: ${conditions.join(", ")}`,
});

const listingTypeSchema = z.string().refine((value): value is ListingType => listingTypes.includes(value as ListingType), {
  message: `Listing type must be one of: ${listingTypes.join(", ")}`,
});

const imageSchema = z.string().trim().min(1).max(2_800_000).refine((value) => {
  if (/^data:image\/(jpeg|png|webp);base64,/i.test(value)) return true;
  return URL.canParse(value) && ["http:", "https:"].includes(new URL(value).protocol);
}, "Image must be an HTTP(S) URL or a JPEG, PNG, or WebP data URL");

export const createListingSchema = z.object({
  title: z.string().trim().min(3).max(80),
  description: z.string().trim().min(10).max(500),
  category: categorySchema,
  condition: conditionSchema,
  listingType: listingTypeSchema,
  price: z.number().int().positive().max(10_000).optional(),
  image: imageSchema,
  seller: z.object({
    id: z.string().trim().min(1).max(80),
    name: z.string().trim().min(2).max(80),
  }).strict(),
  pickupLocation: z.string().trim().refine(
    (value) => CAMPUS_LOCATIONS.some((location) => location.name === value || location.shortName === value),
    `Pickup location must match one of: ${CAMPUS_LOCATIONS.map((location) => location.name).join(", ")}`,
  ),
}).strict().superRefine((value, context) => {
  if (value.listingType === "Sell" && value.price === undefined) {
    context.addIssue({ code: "custom", path: ["price"], message: "Price is required for sell listings" });
  }
  if (value.listingType !== "Sell" && value.price !== undefined) {
    context.addIssue({ code: "custom", path: ["price"], message: "Price is only valid for sell listings" });
  }
});

export const listingQuerySchema = z.object({
  q: z.string().trim().max(200).default(""),
  category: categorySchema.optional(),
  type: listingTypeSchema.optional(),
  condition: conditionSchema.optional(),
  sort: z.enum(["best", "closest", "lowest", "newest"]).default("best"),
  maxPrice: z.coerce.number().nonnegative().max(10_000).optional(),
  maxDistance: z.coerce.number().nonnegative().max(25).optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
}).strict().superRefine((value, context) => {
  if ((value.lat === undefined) !== (value.lng === undefined)) {
    context.addIssue({ code: "custom", path: [value.lat === undefined ? "lat" : "lng"], message: "Latitude and longitude must be provided together" });
  }
});

export const aiMatchSchema = z.object({
  query: z.string().trim().min(1).max(200),
  listingIds: z.array(z.string().trim().min(1)).max(100).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
}).strict().superRefine((value, context) => {
  if ((value.lat === undefined) !== (value.lng === undefined)) {
    context.addIssue({ code: "custom", path: [value.lat === undefined ? "lat" : "lng"], message: "Latitude and longitude must be provided together" });
  }
});

export const aiListingDraftSchema = z.object({
  description: z.string().trim().min(5).max(500),
}).strict();

export const aiRecommendationSchema = z.object({
  context: z.string().trim().min(2).max(200),
  limit: z.number().int().positive().max(20).default(6),
}).strict();

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;
export type AiMatchInput = z.infer<typeof aiMatchSchema>;
export type AiListingDraftInput = z.infer<typeof aiListingDraftSchema>;
export type AiRecommendationInput = z.infer<typeof aiRecommendationSchema>;
