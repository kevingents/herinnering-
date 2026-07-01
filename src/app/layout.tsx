import type { Metadata, Viewport } from "next";
import { Fraunces, Newsreader, Inter } from "next/font/google";
import { GrainOverlay } from "@/components/atmosphere/grain-overlay";
import { QueryProvider } from "@/providers/query-provider";
import { siteUrl } from "@/lib/env";
import "./globals.css";

// Engraved emotional voice — names, dates, section titles only.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});

// The human reading voice — letters, life-stories, transcripts, all prose.
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Tiny functional meta only — timestamps, labels, nav crumbs.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Everloom — Jouw verhaal, voor altijd dichtbij",
    template: "%s · Everloom",
  },
  description:
    "Everloom helpt je om herinneringen, foto's, video's, stemfragmenten en levenslessen vast te leggen, zodat jouw familie je verhaal altijd kan blijven ontdekken.",
  applicationName: "Everloom",
  keywords: [
    "digitale nalatenschap",
    "herinneringen",
    "levensverhaal",
    "gedenken",
    "memoriam",
  ],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    title: "Everloom — Jouw verhaal, voor altijd dichtbij",
    description:
      "Bewaar je verhaal voor de mensen die van je houden. Herinneringen, foto's, stem en levenslessen — voor altijd dichtbij.",
    siteName: "Everloom",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="nl"
      className={`${fraunces.variable} ${newsreader.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <GrainOverlay />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
