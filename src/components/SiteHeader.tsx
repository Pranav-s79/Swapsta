"use client";

import { Heart, Map, Menu, PackagePlus, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readSavedListingIds } from "./marketplace-storage";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateSavedCount = () => setSavedCount(readSavedListingIds().size);
    updateSavedCount();
    window.addEventListener("swappa:saved-changed", updateSavedCount);
    return () => window.removeEventListener("swappa:saved-changed", updateSavedCount);
  }, []);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" href="/" aria-label="Swappa marketplace"><span className="brand-mark"><Zap size={18} fill="currentColor" /></span>swappa</Link>
        <nav className={open ? "open" : ""} aria-label="Primary navigation">
          <Link href="/">Browse</Link>
          <Link href="/?type=Trade">Trade</Link>
          <Link href="/?type=Free">Free items</Link>
          <Link href="/map"><Map size={16} /> Map</Link>
        </nav>
        <div className="nav-actions">
          <Link className="saved-nav" href="/saved" aria-label={`${savedCount} saved items`}><Heart size={19} /> <span>Saved</span>{savedCount > 0 && <b>{savedCount}</b>}</Link>
          <Link className="sell-button" href="/sell"><PackagePlus size={18} /> List an item</Link>
          <button className="mobile-menu" type="button" onClick={() => setOpen((current) => !current)} aria-label="Toggle menu"><Menu size={22} /></button>
        </div>
      </div>
    </header>
  );
}
