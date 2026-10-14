import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Great_Vibes } from "next/font/google";
import AuthProvider from "@/shared/components/AuthProvider";
import JsonLdSchema from "@/shared/components/JsonLdSchema";
import GoogleAnalytics from "@/shared/components/GoogleAnalytics";
import { siteSettingService } from "@/modules/site-settings/service/site-setting.service";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cursive",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let googleVerification = "";
  try {
    googleVerification = await siteSettingService.getSetting("google_site_verification", "");
  } catch (e) {
    console.error("Failed to load google_site_verification setting", e);
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yellowribbontravels.com"),
    title: {
      default: "Yellow Ribbon Travels | Tailored Holidays, Flight Bookings & Tours",
      template: "%s | Yellow Ribbon Travels",
    },
    description:
      "Official website of Yellow Ribbon Travels. Discover handcrafted tour packages, domestic and international holiday packages, flight bookings, and 24/7 travel concierge support.",
    keywords: [
      "Yellow Ribbon Travels",
      "Yellow Ribbon",
      "tour packages",
      "flight bookings",
      "Kashmir tour",
      "Bali holiday",
      "Dubai package",
      "Kerala backwaters",
      "Secunderabad travel agency",
      "Hyderabad tour operator",
      "international holiday packages",
      "IATA travel agent India",
    ],
    authors: [{ name: "Yellow Ribbon Travels", url: "https://yellowribbontravels.com" }],
    creator: "Yellow Ribbon Travels",
    publisher: "Yellow Ribbon Travels",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "./",
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://yellowribbontravels.com",
      siteName: "Yellow Ribbon Travels",
      title: "Yellow Ribbon Travels | Tailored Holidays, Flight Bookings & Tours",
      description:
        "Official website of Yellow Ribbon Travels. Discover handcrafted tour packages, domestic and international holiday packages, flight bookings, and 24/7 travel concierge support.",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Yellow Ribbon Travels - Tours & Flights",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Yellow Ribbon Travels | Tailored Holidays, Flight Bookings & Tours",
      description:
        "Handcrafted tour packages, flights, and luxury vacations with 24/7 concierge assistance.",
      images: ["/opengraph-image"],
      creator: "@yellowribbon",
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico" },
      ],
      apple: [{ url: "/apple-icon" }],
    },
    verification: {
      google: googleVerification || undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let gaId = process.env.NEXT_PUBLIC_GA_ID || "";
  try {
    const dbGaId = await siteSettingService.getSetting("google_analytics_id", "");
    if (dbGaId) gaId = dbGaId;
  } catch (e) {
    // fallback
  }

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${greatVibes.variable} font-sans scroll-smooth`}
    >
      <head>
        <JsonLdSchema />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#FCFDFE] text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
        <AuthProvider>{children}</AuthProvider>
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}
