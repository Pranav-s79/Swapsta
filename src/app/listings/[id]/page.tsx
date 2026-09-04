import { ListingDetail } from "@/components/ListingDetail";
import { SiteHeader } from "@/components/SiteHeader";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <><SiteHeader /><ListingDetail id={id} /></>;
}
