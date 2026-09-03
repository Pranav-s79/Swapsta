import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swappa — Campus finds, close by",
  description: "Buy, trade, and give away useful things around campus.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
