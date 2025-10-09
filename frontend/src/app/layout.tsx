import type { Metadata } from "next";

import "./globals.css";

// Metadata for BharatSearch
export const metadata: Metadata = {
  title: "BharatSearch — India-Scale AI Search Engine",
  description: "BharatSearch: Fast, intelligent, multilingual AI-powered search for India.",
  openGraph: {
    title: "BharatSearch",
    description: "Fast, intelligent, multilingual AI-powered search for India.",
    url: "https://bharatsearch.ai", // replace with actual URL
    siteName: "BharatSearch",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BharatSearch Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BharatSearch",
    description: "AI-powered search engine optimized for India.",
    creator: "@YourTwitterHandle",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Global Providers like ThemeProvider, AuthProvider, or Redux can go here */}
        <main>{children}</main>
      </body>
    </html>
  );
}
