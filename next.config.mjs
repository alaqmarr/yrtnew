import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "yellowribbontravels.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/packages",
        destination: "/tours",
        permanent: true,
      },
      {
        source: "/package/:path*",
        destination: "/tours/:path*",
        permanent: true,
      },
      {
        source: "/flights",
        destination: "/flight-bookings",
        permanent: true,
      },
      {
        source: "/flight",
        destination: "/flight-bookings",
        permanent: true,
      },
      {
        source: "/flight-booking",
        destination: "/flight-bookings",
        permanent: true,
      },
      {
        source: "/payment",
        destination: "/pay",
        permanent: true,
      },
      {
        source: "/payments",
        destination: "/pay",
        permanent: true,
      },
      {
        source: "/reviews",
        destination: "/review",
        permanent: true,
      },
      {
        source: "/branches-list",
        destination: "/branches",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/cancellation-policy",
        destination: "/refund-policy",
        permanent: true,
      },
      {
        source: "/return-policy",
        destination: "/refund-policy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
