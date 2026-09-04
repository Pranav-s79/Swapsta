import { Marketplace } from "@/components/Marketplace";

export default async function Home({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const initialType = type === "Trade" || type === "Free" || type === "Sell" ? type : "All";
  return <Marketplace initialType={initialType} />;
}
