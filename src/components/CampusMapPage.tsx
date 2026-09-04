"use client";
/* eslint-disable @next/next/no-img-element -- listing images include session-local uploads. */

import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CAMPUS_LOCATIONS, formatPrice, Listing, rankListings, USER_LOCATION } from "@/lib/listings";
import { readAllListings } from "./marketplace-storage";

export function CampusMapPage({ initialListingId }: { initialListingId?: string }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeId, setActiveId] = useState<string | null>(initialListingId ?? null);
  useEffect(() => {
    const timer = window.setTimeout(() => setListings(readAllListings()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const ranked = useMemo(() => rankListings(listings, "", USER_LOCATION), [listings]);
  const active = ranked.find((result) => result.listing.id === activeId) ?? ranked[0];

  return (
    <main className="route-page map-route-page">
      <div className="route-shell">
        <div className="route-heading"><div><p className="section-kicker"><MapPin size={15} /> From {USER_LOCATION.shortName}</p><h1>Campus map</h1><p>Select a marker to compare pickup distance and price.</p></div><Link className="secondary-button" href="/">Grid view</Link></div>
        <div className="map-page-layout">
          <section className="map-results" aria-label="Nearby listings">
            {ranked.map((result) => <button type="button" className={active?.listing.id === result.listing.id ? "active" : ""} key={result.listing.id} onClick={() => setActiveId(result.listing.id)}><img src={result.listing.image} alt="" /><span><strong>{result.listing.title}</strong><small>{result.listing.location.shortName} · {result.distance < .1 ? "Here" : `${result.distance.toFixed(1)} mi`}</small></span><b>{formatPrice(result.listing)}</b></button>)}
          </section>
          <section className="campus-map full-map" aria-label="Campus listing map">
            <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
            {CAMPUS_LOCATIONS.slice(0, 4).map((location, index) => <span className={`building building-${["one", "two", "three", "four"][index]}`} key={location.name}>{location.shortName.toUpperCase()}</span>)}
            <span className="you-marker" style={{ left: `${USER_LOCATION.mapX}%`, top: `${USER_LOCATION.mapY}%` }}><i /> You</span>
            {ranked.map(({ listing }) => <button key={listing.id} type="button" className={`map-marker ${active?.listing.id === listing.id ? "active" : ""}`} style={{ left: `${listing.location.mapX}%`, top: `${listing.location.mapY}%` }} onClick={() => setActiveId(listing.id)} aria-label={`Show ${listing.title}`}><span>{formatPrice(listing)}</span><MapPin size={28} fill="currentColor" /></button>)}
            {active && <Link className="map-preview" href={`/listings/${active.listing.id}`}><img src={active.listing.image} alt="" /><span><small>{active.listing.location.shortName} · {active.distance.toFixed(1)} mi</small><strong>{active.listing.title}</strong><b>{formatPrice(active.listing)} <ArrowRight size={15} /></b></span></Link>}
          </section>
        </div>
      </div>
    </main>
  );
}
