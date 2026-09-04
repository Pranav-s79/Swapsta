import { CampusMapPage } from "@/components/CampusMapPage";
import { SiteHeader } from "@/components/SiteHeader";

export default async function MapPage({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const { listing } = await searchParams;
  return <><SiteHeader /><CampusMapPage initialListingId={listing} /></>;
}
