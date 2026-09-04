"use client";
/* eslint-disable @next/next/no-img-element -- preview uses a browser-local data URL. */

import { ArrowLeft, ArrowRight, ImagePlus, PackagePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CAMPUS_LOCATIONS, CATEGORIES, Category, Condition, Listing, ListingType } from "@/lib/listings";
import { saveCreatedListing } from "./marketplace-storage";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Electronics");
  const [condition, setCondition] = useState<Condition>("Good");
  const [listingType, setListingType] = useState<ListingType>("Sell");
  const [price, setPrice] = useState("");
  const [locationIndex, setLocationIndex] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  function handleImage(file: File | undefined): void {
    setImageError(null);
    if (!file) { setImage(null); return; }
    if (file.size > MAX_IMAGE_BYTES) { setImage(null); setImageError("Choose an image smaller than 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result);
      else setImageError("The selected image could not be read.");
    };
    reader.onerror = () => setImageError("The selected image could not be read.");
    reader.readAsDataURL(file);
  }

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (step === 1) { setStep(2); return; }
    if (!image) { setImageError("Add a photo before publishing."); return; }

    const listing: Listing = {
      id: `local-${crypto.randomUUID()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      listingType,
      price: listingType === "Sell" ? Number(price) : undefined,
      image,
      imageAlt: title.trim(),
      seller: { id: "current-user", name: "You", initials: "YO", verified: true },
      location: CAMPUS_LOCATIONS[locationIndex],
      createdAt: new Date().toISOString(),
      tags: `${title} ${description}`.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean),
    };

    try {
      saveCreatedListing(listing);
      router.push(`/listings/${listing.id}?created=1`);
    } catch (error) {
      setStorageError(error instanceof DOMException && error.name === "QuotaExceededError" ? "The browser could not store this image. Choose a smaller file." : "The listing could not be saved in this session.");
    }
  }

  const canContinue = title.trim().length >= 3 && description.trim().length >= 10;
  const canPublish = image !== null && (listingType !== "Sell" || Number(price) > 0);

  return (
    <main className="route-page">
      <div className="form-page-shell">
        <Link className="back-link" href="/"><ArrowLeft size={17} /> Cancel</Link>
        <section className="listing-form-panel">
          <div className="form-kicker"><PackagePlus size={18} /> New listing</div>
          <h1>{step === 1 ? "Describe the item" : "Set price and pickup"}</h1>
          <p className="form-intro">Listings are stored in this browser session for the MVP.</p>
          <div className="progress-track" aria-label={`Step ${step} of 2`}><span style={{ width: `${step * 50}%` }} /></div>
          <form onSubmit={submit}>
            {step === 1 ? <>
              <label>Item name<input autoFocus required minLength={3} maxLength={80} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="TI-84 Plus calculator" /></label>
              <label>Description<textarea required minLength={10} maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Condition, included accessories, and any visible wear" /></label>
              <div className="form-grid">
                <label>Category<select value={category} onChange={(event) => setCategory(event.target.value as Category)}>{CATEGORIES.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Condition<select value={condition} onChange={(event) => setCondition(event.target.value as Condition)}>{(["New", "Like new", "Good", "Fair"] as Condition[]).map((item) => <option key={item}>{item}</option>)}</select></label>
              </div>
            </> : <>
              <fieldset><legend>Listing type</legend><div className="choice-row">{(["Sell", "Trade", "Free"] as ListingType[]).map((item) => <button className={listingType === item ? "selected" : ""} type="button" key={item} onClick={() => setListingType(item)}>{item}</button>)}</div></fieldset>
              {listingType === "Sell" && <label>Price<div className="price-input"><span>$</span><input required type="number" min="1" max="10000" step="1" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0" /></div></label>}
              <label>Pickup location<select value={locationIndex} onChange={(event) => setLocationIndex(Number(event.target.value))}>{CAMPUS_LOCATIONS.map((location, index) => <option value={index} key={location.name}>{location.name}</option>)}</select></label>
              <label>Photo<div className="image-upload"><input required type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleImage(event.target.files?.[0])} />{image ? <img src={image} alt="Selected listing preview" /> : <span><ImagePlus size={24} /> JPEG, PNG, or WebP · 2 MB maximum</span>}</div></label>
              {imageError && <p className="field-error">{imageError}</p>}
            </>}
            {storageError && <p className="field-error">{storageError}</p>}
            <div className="form-actions">{step === 2 && <button className="secondary-button" type="button" onClick={() => setStep(1)}><ArrowLeft size={17} /> Back</button>}<button className="primary-button" type="submit" disabled={step === 1 ? !canContinue : !canPublish}>{step === 1 ? "Continue" : "Publish listing"}<ArrowRight size={17} /></button></div>
          </form>
        </section>
      </div>
    </main>
  );
}
