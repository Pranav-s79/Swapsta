export const CATEGORIES = [
  "All",
  "Electronics",
  "Textbooks",
  "School Supplies",
  "Dorm",
  "Furniture",
  "Transportation",
  "Clothing",
] as const;

export type Category = Exclude<(typeof CATEGORIES)[number], "All">;
export type Condition = "New" | "Like new" | "Good" | "Fair";
export type ListingType = "Sell" | "Trade" | "Free";

export interface CampusLocation {
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  mapX: number;
  mapY: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: Category;
  condition: Condition;
  listingType: ListingType;
  price?: number;
  image: string;
  imageAlt: string;
  seller: { id: string; name: string; initials: string; verified: boolean };
  location: CampusLocation;
  createdAt: string;
  tags: string[];
}

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  { name: "Memorial Student Center", shortName: "MSC", lat: 30.6122, lng: -96.3414, mapX: 47, mapY: 58 },
  { name: "Zachry Engineering Complex", shortName: "Zachry", lat: 30.6213, lng: -96.3404, mapX: 63, mapY: 24 },
  { name: "Evans Library", shortName: "Evans", lat: 30.6169, lng: -96.3398, mapX: 61, mapY: 43 },
  { name: "Hullabaloo Hall", shortName: "Hullabaloo", lat: 30.6196, lng: -96.3464, mapX: 29, mapY: 30 },
  { name: "The Commons", shortName: "Commons", lat: 30.6154, lng: -96.3347, mapX: 82, mapY: 52 },
  { name: "Student Recreation Center", shortName: "Rec Center", lat: 30.6072, lng: -96.3424, mapX: 43, mapY: 78 },
];

export const USER_LOCATION = CAMPUS_LOCATIONS[0];

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: "ti-84-ce",
    title: "TI-84 Plus CE Calculator",
    description: "Barely used graphing calculator in great shape. Includes charging cable and a protective slide case. Perfect for engineering and calculus classes.",
    category: "Electronics",
    condition: "Like new",
    listingType: "Sell",
    price: 55,
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Graphing calculator on a desk",
    seller: { id: "maya", name: "Maya R.", initials: "MR", verified: true },
    location: CAMPUS_LOCATIONS[1],
    createdAt: "2026-09-03T16:30:00.000Z",
    tags: ["calculator", "math", "engineering", "graphing", "exam", "ti84"],
  },
  {
    id: "fuji-bike",
    title: "Fuji Commuter Bike",
    description: "Reliable seven-speed campus bike. Freshly tuned with a new rear tube. Lock and front light included.",
    category: "Transportation",
    condition: "Good",
    listingType: "Sell",
    price: 120,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=85",
    imageAlt: "City commuter bicycle",
    seller: { id: "ethan", name: "Ethan K.", initials: "EK", verified: true },
    location: CAMPUS_LOCATIONS[3],
    createdAt: "2026-09-02T13:15:00.000Z",
    tags: ["bike", "bicycle", "commute", "ride", "transport"],
  },
  {
    id: "desk-lamp",
    title: "Adjustable Desk Lamp",
    description: "Warm LED desk lamp with three brightness settings and a USB charging port. Great for late-night study sessions.",
    category: "Dorm",
    condition: "Good",
    listingType: "Trade",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Modern desk lamp",
    seller: { id: "sophia", name: "Sophia L.", initials: "SL", verified: true },
    location: CAMPUS_LOCATIONS[4],
    createdAt: "2026-09-03T12:05:00.000Z",
    tags: ["lamp", "light", "study", "desk", "dorm", "usb"],
  },
  {
    id: "thermo-textbook",
    title: "Engineering Thermodynamics",
    description: "Ninth edition. A few highlighted chapters, no missing pages. Includes my clean formula reference cards.",
    category: "Textbooks",
    condition: "Good",
    listingType: "Sell",
    price: 32,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Stack of textbooks",
    seller: { id: "noah", name: "Noah T.", initials: "NT", verified: true },
    location: CAMPUS_LOCATIONS[2],
    createdAt: "2026-09-01T18:45:00.000Z",
    tags: ["textbook", "book", "thermodynamics", "engineering", "class"],
  },
  {
    id: "mini-fridge",
    title: "Compact Mini Fridge",
    description: "Clean 3.1 cu ft mini fridge with a small freezer compartment. Quiet and fits neatly under a lofted dorm bed.",
    category: "Dorm",
    condition: "Good",
    listingType: "Sell",
    price: 65,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Compact refrigerator",
    seller: { id: "ava", name: "Ava J.", initials: "AJ", verified: true },
    location: CAMPUS_LOCATIONS[5],
    createdAt: "2026-08-31T10:20:00.000Z",
    tags: ["fridge", "refrigerator", "food", "dorm", "moving", "appliance"],
  },
  {
    id: "storage-bins",
    title: "Set of 3 Storage Bins",
    description: "Three stackable under-bed bins. Moving out this weekend and would love for another student to use them.",
    category: "Dorm",
    condition: "Good",
    listingType: "Free",
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Stackable storage boxes",
    seller: { id: "liam", name: "Liam P.", initials: "LP", verified: false },
    location: CAMPUS_LOCATIONS[3],
    createdAt: "2026-09-03T17:10:00.000Z",
    tags: ["storage", "bins", "organize", "moving", "dorm", "free"],
  },
  {
    id: "mechanical-keyboard",
    title: "Compact Mechanical Keyboard",
    description: "Wireless 75% keyboard with tactile switches. Works with Mac and Windows. USB-C cable included.",
    category: "Electronics",
    condition: "Like new",
    listingType: "Sell",
    price: 48,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Compact mechanical keyboard",
    seller: { id: "diego", name: "Diego M.", initials: "DM", verified: true },
    location: CAMPUS_LOCATIONS[1],
    createdAt: "2026-09-02T20:25:00.000Z",
    tags: ["keyboard", "computer", "wireless", "desk", "study", "gaming"],
  },
  {
    id: "lab-coat",
    title: "Cotton Lab Coat — Medium",
    description: "White knee-length lab coat, size medium. Freshly washed and only used for one chemistry semester.",
    category: "School Supplies",
    condition: "Like new",
    listingType: "Sell",
    price: 12,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Clean white lab coat",
    seller: { id: "zoe", name: "Zoe B.", initials: "ZB", verified: true },
    location: CAMPUS_LOCATIONS[2],
    createdAt: "2026-09-01T15:00:00.000Z",
    tags: ["lab", "coat", "chemistry", "class", "science", "engineering"],
  },
];

export function distanceMiles(from: CampusLocation, to: CampusLocation): number {
  const radiusMiles = 3958.8;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(to.lat - from.lat);
  const longitudeDelta = toRadians(to.lng - from.lng);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * radiusMiles * Math.asin(Math.sqrt(a));
}

const CONCEPTS: ReadonlyArray<readonly [readonly string[], readonly string[]]> = [
  [["engineering", "math", "exam", "calculate"], ["calculator", "textbook", "lab"]],
  [["move", "moving", "dorm", "room"], ["fridge", "lamp", "storage", "desk", "bins"]],
  [["carry", "tools", "around", "campus"], ["backpack", "storage", "bike"]],
  [["commute", "ride", "far", "transport"], ["bike", "bicycle", "scooter"]],
  [["study", "night", "dark"], ["lamp", "light", "desk"]],
];

function normalize(value: string): string[] {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word.length > 1);
}

export function matchScore(listing: Listing, query: string): number {
  const words = normalize(query);
  if (words.length === 0) return 0;

  const title = listing.title.toLowerCase();
  const description = listing.description.toLowerCase();
  const category = listing.category.toLowerCase();
  let score = 0;

  for (const word of words) {
    if (title.includes(word)) score += 50;
    if (category.includes(word)) score += 25;
    if (description.includes(word)) score += 20;
    if (listing.tags.some((tag) => tag.includes(word) || word.includes(tag))) score += 30;
  }

  for (const [triggers, concepts] of CONCEPTS) {
    if (words.some((word) => triggers.includes(word)) && concepts.some((concept) => listing.tags.includes(concept))) {
      score += 35;
    }
  }

  return score;
}

export function formatPrice(listing: Pick<Listing, "listingType" | "price">): string {
  if (listing.listingType === "Free") return "Free";
  if (listing.listingType === "Trade") return "Trade";
  return `$${listing.price?.toFixed(0) ?? "0"}`;
}
