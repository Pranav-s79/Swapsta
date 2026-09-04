"use client";
/* eslint-disable @next/next/no-img-element -- listing images include session-local uploads. */

import { Heart, MapPin, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { distanceMiles, formatPrice, Listing, USER_LOCATION } from "@/lib/listings";
import { readAllListings, readSavedListingIds, writeSavedListingIds } from "./marketplace-storage";

export function SavedListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readSavedListingIds();
      setListings(readAllListings().filter((listing) => saved.has(listing.id)));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function remove(id: string): void {
    const saved = readSavedListingIds();
    saved.delete(id);
    writeSavedListingIds(saved);
    setListings((current) => current.filter((listing) => listing.id !== id));
  }

  return (
    <main className="route-page"><div className="route-shell"><div className="route-heading"><div><p className="section-kicker"><Heart size={15} /> Saved</p><h1>Saved listings</h1><p>Items saved in this browser.</p></div></div>
      {listings.length === 0 ? <section className="empty-state"><Heart size={28} /><h2>No saved listings</h2><p>Use the heart button on a listing to save it here.</p><Link href="/">Browse listings</Link></section> : <div className="saved-list"><div className="saved-list-head"><span>{listings.length} {listings.length === 1 ? "listing" : "listings"}</span></div>{listings.map((listing) => <article key={listing.id}><Link href={`/listings/${listing.id}`}><img src={listing.image} alt={listing.imageAlt} /><span><small>{listing.category} · {listing.condition}</small><strong>{listing.title}</strong><span><MapPin size={14} /> {distanceMiles(USER_LOCATION, listing.location).toFixed(1)} mi · {listing.location.shortName}</span></span><b>{formatPrice(listing)}</b></Link><button type="button" onClick={() => remove(listing.id)} aria-label={`Remove ${listing.title} from saved listings`}><Trash2 size={18} /></button></article>)}</div>}
    </div></main>
  );
}
