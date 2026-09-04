"use client";
/* eslint-disable @next/next/no-img-element -- listing images include session-local uploads. */

import { ArrowLeft, BadgeCheck, Check, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { distanceMiles, formatPrice, Listing, USER_LOCATION } from "@/lib/listings";
import { readAllListings } from "./marketplace-storage";

export function ListingDetail({ id }: { id: string }) {
  const [listing, setListing] = useState<Listing | null | undefined>(undefined);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setListing(readAllListings().find((item) => item.id === id) ?? null), 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  if (listing === undefined) return <div className="route-status">Loading listing…</div>;
  if (listing === null) return <div className="route-status"><h1>Listing not found</h1><p>It may have been removed or created in another browser session.</p><Link href="/">Return to listings</Link></div>;

  const distance = distanceMiles(USER_LOCATION, listing.location);
  const action = listing.listingType === "Trade" ? "Propose trade" : listing.listingType === "Free" ? "Claim item" : "Contact seller";

  return (
    <main className="route-page">
      <div className="route-shell">
        <Link className="back-link" href="/"><ArrowLeft size={17} /> All listings</Link>
        <section className="listing-page-panel">
          <div className="listing-page-image"><img src={listing.image} alt={listing.imageAlt} /><span className={`type-chip type-${listing.listingType.toLowerCase()}`}>{listing.listingType}</span></div>
          <div className="listing-page-content">
            <p className="detail-eyebrow">{listing.category} · {listing.condition}</p>
            <div className="detail-title-row"><h1>{listing.title}</h1><strong>{formatPrice(listing)}</strong></div>
            <p className="detail-description">{listing.description}</p>
            <div className="pickup-panel"><span className="map-icon"><MapPin size={20} /></span><div><strong>{listing.location.name}</strong><span>{distance < 0.1 ? "At your location" : `${distance.toFixed(1)} mi from ${USER_LOCATION.shortName}`}</span></div><Link href={`/map?listing=${listing.id}`}>View map</Link></div>
            <div className="seller-panel"><span className="avatar">{listing.seller.initials}</span><div><strong>{listing.seller.name}</strong><span>{listing.seller.verified ? "Verified campus seller" : "Campus seller"}</span></div>{listing.seller.verified && <BadgeCheck size={19} />}</div>
            {notice && <div className="success-notice"><Check size={17} />{notice}</div>}
            <button className="primary-button wide" type="button" onClick={() => setNotice(`Request recorded for ${listing.seller.name}. No payment was processed.`)}><MessageCircle size={18} /> {action}</button>
          </div>
        </section>
      </div>
    </main>
  );
}
