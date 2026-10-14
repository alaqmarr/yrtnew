export default function JsonLdSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "Organization"],
    "@id": "https://yellowribbontravels.com/#organization",
    "name": "Yellow Ribbon Travels",
    "alternateName": "Yellow Ribbon Travels & Tours",
    "url": "https://yellowribbontravels.com",
    "logo": "https://yellowribbontravels.com/logo.png",
    "image": "https://yellowribbontravels.com/opengraph-image",
    "description":
      "Accredited Indian travel agency and international tour operator specializing in domestic and international holiday packages, flight bookings, visa assistance, and corporate travel.",
    "telephone": "+91-9100228152",
    "email": "yellowribbontravels@gmail.com",
    "priceRange": "₹₹₹",
    "currenciesAccepted": "INR, USD, EUR, AED, GBP",
    "paymentAccepted": "Credit Card, Debit Card, Net Banking, UPI, Razorpay",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:30",
        "closes": "19:30",
      },
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2-2-51, Shop No. 2, Mittal Chambers, Opp. Raj Classic Inn, M.G. Road",
      "addressLocality": "Secunderabad",
      "addressRegion": "Telangana",
      "postalCode": "500003",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.4399,
      "longitude": 78.4983,
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "480",
      "bestRating": "5",
      "worstRating": "1",
    },
    "sameAs": [
      "https://www.facebook.com/yellowribbontravels",
      "https://www.instagram.com/yellowribbontravels",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://yellowribbontravels.com/#website",
    "name": "Yellow Ribbon Travels",
    "url": "https://yellowribbontravels.com",
    "description": "Tailored Holidays, International Tours & Flight Bookings",
    "publisher": {
      "@id": "https://yellowribbontravels.com/#organization",
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://yellowribbontravels.com/tours?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
