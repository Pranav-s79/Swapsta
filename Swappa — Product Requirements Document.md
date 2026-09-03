# Swappa — Product Requirements Document

## 1. Product Summary

Swappa is a campus-focused marketplace that helps students buy, sell, trade, and give away items locally.

The main differentiator is that Swappa is designed around the realities of a college campus: students often need items quickly, do not have cars, live close to one another, and frequently own things that are only useful for a semester or two.

Swappa combines a simple marketplace with campus-aware location and item matching so students can find useful items nearby instead of buying new products or traveling across town.

---

## 2. Problem

Students regularly need temporary or low-cost items such as:

- Calculators
- Textbooks
- Dorm furniture
- Mini fridges
- Fans
- Clothing
- Lab equipment
- School supplies
- Electronics
- Bikes and scooters

Existing platforms such as Facebook Marketplace and Craigslist are built around cities rather than campuses.

This creates several problems:

- Listings may be far away.
- Students without cars cannot easily pick items up.
- Campus-specific items are difficult to discover.
- Search requires knowing exactly what the item is called.
- Students frequently throw away usable items during move-in and move-out periods.

Swappa creates a marketplace where proximity and campus context are first-class parts of the experience.

---

# 3. Target Users

Primary users are college students living on or near campus.

Example users:

**Buyer**
Needs a calculator before an exam tomorrow and wants one within walking distance.

**Seller**
Finished a class and wants to sell a textbook rather than letting it sit unused.

**Trader**
Has an extra mini fridge but needs a desk lamp and would rather trade than purchase something.

**Move-Out Student**
Needs to quickly get rid of several dorm items before leaving campus.

---

# 4. Core Product Goals

Swappa should allow students to:

1. Quickly list an item.
2. Discover useful items around campus.
3. Search and filter listings.
4. Compare listings based on distance.
5. View listings geographically.
6. Buy, trade, or claim items.
7. Use natural-language search to find items when they do not know exactly what to search for.

The product should feel lightweight and fast rather than like a full e-commerce platform.

---

# 5. MVP Scope

The MVP consists of five main systems.

## Marketplace

Students can browse available items through a card-based marketplace.

Each listing should contain:

- Item name
- Image
- Price
- Listing type
- Category
- Condition
- Seller
- Campus location
- Distance
- Short description

Listing types:

- Sell
- Trade
- Free

Example:

> TI-84 Plus CE  
> $55  
> Good condition  
> Zachry Engineering Building  
> 0.3 miles away

---

## Create Listing

Students can create a listing using a short form.

Required fields:

- Item name
- Description
- Category
- Condition
- Price or trade preference
- Listing type
- Pickup location
- Image

Possible categories:

- Electronics
- Textbooks
- School Supplies
- Clothing
- Dorm
- Furniture
- Transportation
- Lab / Engineering
- Miscellaneous

For the hackathon/demo version, listings can be stored locally or in mock data if a backend would consume too much development time.

---

## Search and Filtering

Students can search listings using normal keywords.

Example searches:

- calculator
- bike
- desk
- textbook

Filters should include:

- Category
- Price
- Condition
- Distance
- Sell / Trade / Free

Sorting options:

- Closest
- Lowest price
- Newest
- Best match

Search should function normally without Grok.

---

# 6. Campus Distance System

Every listing should contain latitude and longitude coordinates.

Example:

```ts
{
  location: "Zachry Engineering Education Complex",
  lat: 30.6213,
  lng: -96.3404
}
```

The application calculates the distance between the user and each listing.

Distance should be displayed directly on listing cards.

Example:

> 0.2 mi away

Users should be able to sort listings by distance.

This allows two similar listings to be compared based on convenience.

Example:

```text
TI-84 Calculator — $50 — 0.2 mi away

TI-84 Calculator — $45 — 1.8 mi away
```

Swappa can therefore help the user choose between saving money and saving travel time.

---

# 7. Campus Map

Swappa should provide a map view showing nearby listings.

Listings appear as markers around campus.

Selecting a marker should show:

- Item image
- Item name
- Price
- Distance
- Link to listing

Users should be able to switch between:

**Marketplace View**

and

**Campus Map View**

For the initial demo, a small set of known campus locations can be predefined.

Example locations:

- Zachry
- MSC
- Evans Library
- Hullabaloo Hall
- Commons
- Student Recreation Center
- Engineering Quad

Exact real-time location tracking is not required for the MVP.

---

# 8. Matching System

The first version should use simple rule-based matching.

The goal is to rank items based on relevance.

Potential signals:

- Search keyword
- Category
- Price
- Distance
- Condition

Example scoring model:

```text
Title match        +50
Category match     +25
Description match  +20
Close distance     +15
Preferred condition +10
```

This allows Swappa to work without any AI dependency.

The system should be designed so the matching component can later be replaced or enhanced by Grok.

---

# 9. Grok Integration

Grok should function as an intelligence layer on top of the marketplace rather than being required for the marketplace itself.

The application should expose an AI abstraction layer.

Example endpoints:

```text
/api/ai/search
/api/ai/match
/api/ai/listing
/api/ai/recommend
```

Before Grok integration, these endpoints may return mock responses.

---

## Natural-Language Search

Instead of requiring exact keywords, students can describe what they need.

Example:

> "I need something cheap to carry my engineering tools around campus."

Grok interprets the request and identifies relevant listings such as:

- Tool bag
- Backpack
- Rolling case
- Storage box

The marketplace then ranks those items using price, distance, and availability.

---

## Smart Listing Creation

A seller could provide a short description:

> "Old TI calculator I used for engineering classes, works fine."

Grok can generate:

**Title**

TI-84 Plus Graphing Calculator

**Category**

Electronics / School Supplies

**Description**

Used TI-84 graphing calculator in good working condition. Suitable for engineering and math courses.

This reduces the effort required to post an item.

---

## Item Recommendations

Grok may also understand relationships between items.

Example:

User searches:

> "moving into my dorm"

Swappa may recommend available listings for:

- Mini fridge
- Lamp
- Fan
- Storage bins
- Desk organizer
- Mattress topper

This provides a stronger demonstration of AI than a generic marketplace chatbot.

---

# 10. Suggested User Flow

## Browse Flow

```text
Open Swappa
     ↓
Marketplace Feed
     ↓
Search / Browse
     ↓
Filter or Sort
     ↓
View Listing
     ↓
Buy / Trade / Claim
```

---

## Nearby Flow

```text
Open Swappa
     ↓
Use Current Campus Location
     ↓
Listings Ranked by Distance
     ↓
Campus Map
     ↓
Select Nearby Item
     ↓
View Listing
```

---

## AI Search Flow

```text
User enters natural-language request
                ↓
              Grok
                ↓
Intent + relevant item concepts
                ↓
       Marketplace Search
                ↓
Price + Distance + Availability
                ↓
       Ranked Recommendations
```

---

# 11. Main Screens

## Home / Marketplace

Contains:

- Swappa logo
- Search bar
- Category filters
- Nearby toggle
- Listing feed
- Map button

Primary CTA:

**Sell an Item**

---

## Listing Card

Displays:

- Image
- Title
- Price
- Condition
- Listing type
- Location
- Distance

---

## Item Detail

Contains:

- Large image
- Item title
- Description
- Price
- Seller
- Condition
- Pickup location
- Distance
- Map preview

Actions:

- Message Seller
- Buy
- Propose Trade

For the prototype, these actions may simply display confirmation/modals rather than requiring a complete messaging/payment system.

---

## Create Listing

Simple form optimized for posting quickly.

Possible future Grok feature:

**"Describe your item"**

User enters:

> "blue mini fridge works fine just moving out"

Swappa automatically fills the remaining listing fields.

---

## Campus Map

Displays listings geographically.

Users can select markers and navigate to item pages.

---

# 12. Data Model

Example listing:

```ts
interface Listing {
  id: string;

  title: string;
  description: string;

  category:
    | "electronics"
    | "textbooks"
    | "school"
    | "clothing"
    | "dorm"
    | "furniture"
    | "transportation"
    | "engineering"
    | "misc";

  condition:
    | "new"
    | "like-new"
    | "good"
    | "fair";

  listingType:
    | "sell"
    | "trade"
    | "free";

  price?: number;

  image: string;

  seller: {
    id: string;
    name: string;
  };

  location: {
    name: string;
    lat: number;
    lng: number;
  };

  createdAt: string;
}
```

---

# 13. Recommended Technical Stack

For the hackathon:

**Frontend**

Next.js

**Language**

TypeScript

**Styling**

Tailwind CSS

**Map**

Mapbox, Leaflet, or another lightweight map provider

**Database**

Start with mock data.

If persistent storage becomes necessary:

Supabase or Firebase.

**AI**

Grok API through a dedicated AI service layer.

---

# 14. Architecture

```text
                         SWAPPA

                           User
                            │
                            ▼

                  ┌─────────────────┐
                  │    Next.js UI   │
                  └────────┬────────┘
                           │

          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼

     Marketplace        Campus Map        Search
          │                │                 │
          │                ▼                 │
          │          Location Engine         │
          │                │                 │
          └──────────┬─────┴─────────────────┘
                     ▼
               Matching Engine
                     │
                     │
               optional AI layer
                     │
                     ▼
                  Grok API
```

The core marketplace should continue functioning if the Grok API is unavailable.

---

# 15. Development Priorities

Because the prototype must be built quickly, development should follow this order.

### Priority 1

Build marketplace UI with mock listings.

Must work:

- Marketplace feed
- Listing cards
- Item pages
- Search

### Priority 2

Add location information.

Must work:

- Campus locations
- Distance calculations
- Sort by closest

### Priority 3

Add campus map.

Listings should appear geographically.

### Priority 4

Add listing creation.

Listings may initially only exist during the current application session.

### Priority 5

Add matching/recommendation logic.

### Priority 6

Connect Grok.

Grok should enhance an already functional product rather than delay the core demo.

---

# 16. Out of Scope for MVP

Do not spend significant hackathon development time on:

- Real payment processing
- Full authentication infrastructure
- Complex messaging systems
- Shipping
- Seller verification
- Rating systems
- Marketplace moderation infrastructure
- Advanced recommendation models
- Real-time GPS tracking
- Large-scale database architecture

These can be represented through mocked interactions during the demo.

---

# 17. Demo Scenario

A strong demo should tell one continuous story.

A student realizes they need a graphing calculator.

They open Swappa and search:

> "Need a calculator for my engineering class tomorrow."

Swappa understands the request and finds several relevant calculators.

Results:

```text
TI-84 Plus CE
$55
Zachry
0.2 mi away

TI-84 Plus
$40
Commons
0.8 mi away

Casio FX-CG50
$50
Hullabaloo
1.1 mi away
```

The student opens the map and sees where each calculator is located.

Swappa recommends the nearby TI-84 based on relevance, distance, and price.

The student opens the listing and arranges pickup.

The demo simultaneously demonstrates:

- Marketplace
- Campus awareness
- Distance calculation
- Map integration
- Ranking
- Grok natural-language understanding

without making the entire product dependent on AI.

---

# 18. Success Criteria

The prototype is successful if a user can:

- Browse items.
- Search listings.
- View an item.
- Create a listing.
- See where an item is located.
- See how far away it is.
- Sort items by proximity.
- View items on a campus map.
- Use a natural-language request to discover useful listings.

The core marketplace must remain usable without Grok.

---

# 19. Product Principle

Swappa should not feel like:

> "Facebook Marketplace with an AI chatbot."

It should feel like:

> **A marketplace built specifically around the physical and temporary nature of college life.**

AI should improve discovery and matching while the campus map, proximity system, trading system, and marketplace remain valuable on their own.