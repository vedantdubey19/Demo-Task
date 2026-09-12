import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "UniPulse — Decision Intelligence for Indian Higher Education",
  description:
    "Verified institutional data, audited placement records, fee benchmarks, and side-by-side college decision matrix.",
  keywords: [
    "college discovery",
    "engineering colleges",
    "IITs",
    "NITs",
    "BITS Pilani",
    "college comparison",
    "NIRF rankings",
    "placement records",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="font-sans antialiased bg-[#0A0A0D] text-[#ECECEE] min-h-screen flex flex-col selection:bg-[#D4AF6A]/20 selection:text-[#D4AF6A]">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
