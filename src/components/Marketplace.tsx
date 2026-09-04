"use client";
/* eslint-disable @next/next/no-img-element -- listing sources can be remote URLs or browser-local upload data. */

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bike,
  BookOpen,
  Box,
  Check,
  ChevronDown,
  Clock3,
  Grid2X2,
  Heart,
  Laptop,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  PackagePlus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CAMPUS_LOCATIONS,
  CATEGORIES,
  Category,
  Condition,
  distanceMiles,
  formatPrice,
  INITIAL_LISTINGS,
  Listing,
  ListingType,
  rankListings,
  USER_LOCATION,
} from "@/lib/listings";
import { readAllListings, readSavedListingIds, writeSavedListingIds } from "./marketplace-storage";

type ViewMode = "grid" | "map";
type SortMode = "best" | "closest" | "lowest" | "newest";

const categoryIcons = {
  All: Grid2X2,
  Electronics: Laptop,
  Textbooks: BookOpen,
  "School Supplies": Sparkles,
  Dorm: Box,
  Furniture: Box,
  Transportation: Bike,
  Clothing: Tag,
} as const;

const quickSearches = ["calculator for engineering", "moving into my dorm", "cheap way to get around"];

function distanceLabel(listing: Listing): string {
  const distance = distanceMiles(USER_LOCATION, listing.location);
  return distance < 0.1 ? "Here" : `${distance.toFixed(1)} mi`;
}

function ListingCard({ listing, saved, onSave, onOpen }: {
  listing: Listing;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="listing-card" onClick={onOpen} tabIndex={0} role="button" onKeyDown={(event) => event.key === "Enter" && onOpen()}>
      <div className="card-image-wrap">
        {/* External seed photography keeps the mock catalog lightweight. */}
        <img className="card-image" src={listing.image} alt={listing.imageAlt} />
        <span className={`type-chip type-${listing.listingType.toLowerCase()}`}>{listing.listingType}</span>
        <button
          className={`save-button ${saved ? "is-saved" : ""}`}
          type="button"
          aria-label={saved ? `Remove ${listing.title} from saved items` : `Save ${listing.title}`}
          onClick={(event) => { event.stopPropagation(); onSave(); }}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-body">
        <div className="card-price-row">
          <strong>{formatPrice(listing)}</strong>
          <span><MapPin size={14} /> {distanceLabel(listing)}</span>
        </div>
        <h3>{listing.title}</h3>
        <p>{listing.condition} · {listing.location.shortName}</p>
        <div className="seller-row">
          <span className="avatar mini">{listing.seller.initials}</span>
          <span>{listing.seller.name}</span>
          {listing.seller.verified && <BadgeCheck size={15} aria-label="Campus verified" />}
          <span className="posted"><Clock3 size={13} /> {new Date(listing.createdAt).getDate() === 3 ? "Today" : "Recently"}</span>
        </div>
      </div>
    </article>
  );
}

function DetailModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const [notice, setNotice] = useState<string | null>(null);
  const action = listing.listingType === "Trade" ? "Propose a trade" : listing.listingType === "Free" ? "Claim item" : "I’m interested";

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="listing-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close listing"><X size={20} /></button>
        <div className="detail-image-wrap">
          <img src={listing.image} alt={listing.imageAlt} />
          <span className={`type-chip type-${listing.listingType.toLowerCase()}`}>{listing.listingType}</span>
        </div>
        <div className="detail-content">
          <div className="detail-eyebrow">{listing.category} · {listing.condition}</div>
          <div className="detail-title-row">
            <h2 id="listing-title">{listing.title}</h2>
            <strong>{formatPrice(listing)}</strong>
          </div>
          <p className="detail-description">{listing.description}</p>
          <div className="pickup-panel">
            <span className="map-icon"><MapPin size={20} /></span>
            <div><strong>Pickup near {listing.location.shortName}</strong><span>{listing.location.name} · {distanceLabel(listing)} away</span></div>
          </div>
          <div className="seller-panel">
            <span className="avatar">{listing.seller.initials}</span>
            <div><strong>{listing.seller.name}</strong><span>Campus seller {listing.seller.verified ? "· Verified student" : ""}</span></div>
            <button type="button" onClick={() => setNotice(`Message started with ${listing.seller.name}`)}><MessageCircle size={17} /> Message</button>
          </div>
          {notice && <div className="success-notice"><Check size={17} /> {notice}</div>}
          <button className="primary-button wide" type="button" onClick={() => setNotice(`${action} request sent to ${listing.seller.name}`)}>{action}<ArrowRight size={18} /></button>
        </div>
      </section>
    </div>
  );
}

function CreateListingModal({ onClose, onCreate }: { onClose: () => void; onCreate: (listing: Listing) => void }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Electronics");
  const [condition, setCondition] = useState<Condition>("Good");
  const [listingType, setListingType] = useState<ListingType>("Sell");
  const [price, setPrice] = useState("");
  const [locationIndex, setLocationIndex] = useState(0);
  const [image, setImage] = useState<string>("/campus-marketplace-hero.png");

  function handleImage(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) { setStep(2); return; }
    onCreate({
      id: `local-${crypto.randomUUID()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      listingType,
      price: listingType === "Sell" ? Number(price) : undefined,
      image,
      imageAlt: title.trim(),
      seller: { id: "you", name: "You", initials: "YO", verified: true },
      location: CAMPUS_LOCATIONS[locationIndex],
      createdAt: new Date().toISOString(),
      tags: `${title} ${description}`.toLowerCase().split(/\s+/).filter(Boolean),
    });
  }

  const canContinue = title.trim().length >= 3 && description.trim().length >= 10;
  const canPublish = listingType !== "Sell" || Number(price) > 0;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close form"><X size={20} /></button>
        <div className="form-kicker"><PackagePlus size={18} /> New listing</div>
        <h2 id="create-title">{step === 1 ? "What are you passing on?" : "Set the pickup details"}</h2>
        <div className="progress-track"><span style={{ width: `${step * 50}%` }} /></div>
        <form onSubmit={submit}>
          {step === 1 ? (
            <>
              <label>Item name<input autoFocus required minLength={3} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. TI-84 Plus calculator" /></label>
              <label>Description<textarea required minLength={10} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Share the condition, what’s included, and anything useful to know." /></label>
              <div className="form-grid">
                <label>Category<select value={category} onChange={(event) => setCategory(event.target.value as Category)}>{CATEGORIES.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Condition<select value={condition} onChange={(event) => setCondition(event.target.value as Condition)}>{["New", "Like new", "Good", "Fair"].map((item) => <option key={item}>{item}</option>)}</select></label>
              </div>
            </>
          ) : (
            <>
              <fieldset><legend>Listing type</legend><div className="choice-row">{(["Sell", "Trade", "Free"] as ListingType[]).map((item) => <button className={listingType === item ? "selected" : ""} type="button" key={item} onClick={() => setListingType(item)}>{item}</button>)}</div></fieldset>
              {listingType === "Sell" && <label>Price<div className="price-input"><span>$</span><input required type="number" min="1" max="10000" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0" /></div></label>}
              <label>Pickup location<select value={locationIndex} onChange={(event) => setLocationIndex(Number(event.target.value))}>{CAMPUS_LOCATIONS.map((location, index) => <option value={index} key={location.name}>{location.name}</option>)}</select></label>
              <label>Photo<input className="file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleImage(event.target.files?.[0])} /></label>
            </>
          )}
          <div className="form-actions">
            {step === 2 && <button className="secondary-button" type="button" onClick={() => setStep(1)}><ArrowLeft size={17} /> Back</button>}
            <button className="primary-button" type="submit" disabled={step === 1 ? !canContinue : !canPublish}>{step === 1 ? "Continue" : "Publish listing"}<ArrowRight size={17} /></button>
          </div>
        </form>
      </section>
    </div>
  );
}

function CampusMap({ listings, onOpen }: { listings: Listing[]; onOpen: (listing: Listing) => void }) {
  const [activeId, setActiveId] = useState<string | null>(listings[0]?.id ?? null);
  const active = listings.find((listing) => listing.id === activeId);

  return (
    <div className="campus-map">
      <div className="map-label"><MapPin size={16} /> Near {USER_LOCATION.shortName}</div>
      <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
      {CAMPUS_LOCATIONS.slice(0, 4).map((location, index) => <span className={`building building-${["one", "two", "three", "four"][index]}`} key={location.name}>{location.shortName.toUpperCase()}</span>)}
      <span className="you-marker" style={{ left: `${USER_LOCATION.mapX}%`, top: `${USER_LOCATION.mapY}%` }}><i /> You</span>
      {listings.map((listing) => (
        <button
          key={listing.id}
          type="button"
          className={`map-marker ${activeId === listing.id ? "active" : ""}`}
          style={{ left: `${listing.location.mapX}%`, top: `${listing.location.mapY}%` }}
          onClick={() => setActiveId(listing.id)}
          aria-label={`Show ${listing.title}`}
        >
          <span>{formatPrice(listing)}</span><MapPin size={28} fill="currentColor" />
        </button>
      ))}
      {active && (
        <button className="map-preview" type="button" onClick={() => onOpen(active)}>
          <img src={active.image} alt="" />
          <span><small>{active.location.shortName} · {distanceLabel(active)}</small><strong>{active.title}</strong><b>{formatPrice(active)} <ArrowRight size={15} /></b></span>
        </button>
      )}
    </div>
  );
}

export function Marketplace({ initialType = "All" }: { initialType?: ListingType | "All" }) {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [typeFilter, setTypeFilter] = useState<ListingType | "All">(initialType);
  const [sort, setSort] = useState<SortMode>("best");
  const [view, setView] = useState<ViewMode>("grid");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Listing | null>(null);
  const [creating, setCreating] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "enhanced" | "empty" | "unavailable" | "error">("idle");
  const [aiTerms, setAiTerms] = useState<string[]>([]);
  const [baseQuery, setBaseQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setListings(readAllListings());
      setSaved(readSavedListingIds());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const rankedListings = useMemo(() => {
    const filtered = listings.filter((listing) => {
      const categoryMatches = category === "All" || listing.category === category;
      const typeMatches = typeFilter === "All" || listing.listingType === typeFilter;
      return categoryMatches && typeMatches;
    });
    const ranked = rankListings(filtered, query, USER_LOCATION);

    return ranked.sort((a, b) => {
      if (sort === "closest") return a.distance - b.distance;
      if (sort === "lowest") return (a.listing.price ?? 0) - (b.listing.price ?? 0);
      if (sort === "newest" || (sort === "best" && query.trim() === "")) return new Date(b.listing.createdAt).getTime() - new Date(a.listing.createdAt).getTime();
      return b.score - a.score;
    });
  }, [category, listings, query, sort, typeFilter]);
  const visibleListings = rankedListings.map((result) => result.listing);
  const bestMatch = query.trim() && sort === "best" ? rankedListings[0] : undefined;

  function toggleSaved(id: string) {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeSavedListingIds(next);
      return next;
    });
  }

  async function tryAiSearch() {
    const current = query.trim();
    if (!current) return;
    setBaseQuery(current);
    setAiStatus("loading");
    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: current }),
      });
      const data = await response.json();
      if (!data.enabled) {
        setAiStatus("unavailable");
        return;
      }
      if (Array.isArray(data.terms) && data.terms.length > 0) {
        setAiTerms(data.terms);
        setQuery(data.expandedQuery);
        setAiStatus("enhanced");
      } else {
        setAiStatus("empty");
      }
    } catch {
      setAiStatus("error");
    }
  }

  function clearAiSearch() {
    setQuery(baseQuery);
    setAiTerms([]);
    setAiStatus("idle");
  }

  function createListing(listing: Listing) {
    setListings((current) => [listing, ...current]);
    setCreating(false);
    setCategory("All"); setTypeFilter("All"); setSort("newest"); setView("grid");
    setToast("Listing posted.");
    window.setTimeout(() => setToast(null), 3500);
  }

  return (
    <main>
      <header className="site-header">
        <div className="nav-shell">
          <button className="brand" type="button" onClick={() => { setQuery(""); setCategory("All"); }} aria-label="Swappa home"><span className="brand-mark"><Zap size={18} fill="currentColor" /></span>swappa</button>
          <nav className={mobileNav ? "open" : ""} aria-label="Primary navigation">
            <button type="button" className="active">Browse</button>
            <button type="button" onClick={() => { setTypeFilter("Trade"); setMobileNav(false); }}>Trade</button>
            <button type="button" onClick={() => { setTypeFilter("Free"); setMobileNav(false); }}>Free stuff</button>
          </nav>
          <div className="nav-actions">
            <button className="saved-nav" type="button" onClick={() => router.push("/saved")} aria-label={`${saved.size} saved items`}><Heart size={19} /> <span>Saved</span>{saved.size > 0 && <b>{saved.size}</b>}</button>
            <button className="sell-button" type="button" onClick={() => router.push("/sell")}><PackagePlus size={18} /> List an item</button>
            <button className="mobile-menu" type="button" onClick={() => setMobileNav((open) => !open)} aria-label="Toggle menu"><Menu size={22} /></button>
          </div>
        </div>
      </header>

      <section className="search-shell">
        <div className="search-inner">
          <div className="search-bar">
            <Search size={19} />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setAiStatus("idle"); setAiTerms([]); }} placeholder="Search listings, or describe what you need" aria-label="Search listings" />
          </div>
          <div className="search-suggest"><span>Try:</span>{quickSearches.map((item) => <button type="button" key={item} onClick={() => setQuery(item)}>{item}</button>)}</div>
        </div>
      </section>

      <section className="category-shell" aria-label="Listing categories">
        <div className="category-scroll">
          {CATEGORIES.map((item) => { const Icon = categoryIcons[item]; return <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}><Icon size={18} />{item}</button>; })}
        </div>
      </section>

      <section className="marketplace-shell" id="marketplace">
        <div className="marketplace-heading">
          <div><h2>{query ? "Search results" : "Recent listings"}</h2><p>{visibleListings.length} listings · within walking distance of {USER_LOCATION.shortName}</p></div>
          <div className="view-switcher"><button type="button" className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}><Grid2X2 size={17} /> Grid</button><button type="button" onClick={() => router.push("/map")}><Map size={17} /> Map</button></div>
        </div>

        <div className="toolbar">
          <div className="filter-group"><SlidersHorizontal size={17} /><span>Filter</span>{(["All", "Sell", "Trade", "Free"] as const).map((item) => <button type="button" key={item} className={typeFilter === item ? "active" : ""} onClick={() => setTypeFilter(item)}>{item}</button>)}</div>
          <label className="sort-control">Sort by<select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}><option value="best">Best match</option><option value="closest">Closest first</option><option value="lowest">Lowest price</option><option value="newest">Newest first</option></select><ChevronDown size={15} /></label>
        </div>

        {aiStatus === "enhanced" && (
          <div className="ai-enhanced-note">
            <Sparkles size={14} /> Grok added: {aiTerms.join(", ")}
            <button type="button" onClick={clearAiSearch}>Reset</button>
          </div>
        )}
        {bestMatch && <aside className="best-match-callout"><div><span>Best match</span><strong>{bestMatch.listing.title}</strong><p>{bestMatch.reason}</p></div><button type="button" onClick={() => router.push(`/listings/${bestMatch.listing.id}`)}>View listing <ArrowRight size={16} /></button></aside>}

        {visibleListings.length === 0 ? (
          <div className="empty-state">
            <Search size={28} />
            <h3>No listings match</h3>
            <p>Try fewer words, or clear the filters.</p>
            {query.trim() && aiStatus !== "unavailable" && (
              <button type="button" className="ai-search-button" onClick={tryAiSearch} disabled={aiStatus === "loading"}>
                <Sparkles size={16} />
                {aiStatus === "loading" ? "Asking Grok\u2026" : aiStatus === "error" ? "Grok search failed \u2014 try again" : aiStatus === "empty" ? "Grok found nothing new" : "Ask Grok to expand this search"}
              </button>
            )}
            <button type="button" onClick={() => { setQuery(""); setCategory("All"); setTypeFilter("All"); setAiStatus("idle"); setAiTerms([]); }}>Clear filters</button>
          </div>
        ) : view === "grid" ? (
          <div className="listing-grid">{visibleListings.map((listing) => <ListingCard key={listing.id} listing={listing} saved={saved.has(listing.id)} onSave={() => toggleSaved(listing.id)} onOpen={() => router.push(`/listings/${listing.id}`)} />)}</div>
        ) : <CampusMap listings={visibleListings} onOpen={setSelected} />}
      </section>

      <footer><span className="brand footer-brand"><span className="brand-mark"><Zap size={16} fill="currentColor" /></span>swappa</span><span>© 2026 Swappa</span></footer>

      {selected && <DetailModal listing={selected} onClose={() => setSelected(null)} />}
      {creating && <CreateListingModal onClose={() => setCreating(false)} onCreate={createListing} />}
      {toast && <div className="toast"><Check size={18} />{toast}</div>}
    </main>
  );
}
