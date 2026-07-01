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
    default: "Levend Graf — Een heel leven, om te bezoeken",
    template: "%s · Levend Graf",
  },
  description:
    "Bouw tijdens je leven een digitale nalatenschap van herinneringen, stemmen en verhalen. Na je overlijden blijft het bestaan als een waardige, eerlijke herinnering — nooit alsof je er nog bent.",
  applicationName: "Levend Graf",
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
    title: "Levend Graf — Een heel leven, om te bezoeken",
    description:
      "Een waardige digitale nalatenschap: herinneringen, stemmen en verhalen, verteld door een herinnering — niet door een verkoper.",
    siteName: "Levend Graf",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="nl"
      className={`dark ${fraunces.variable} ${newsreader.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <GrainOverlay />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
