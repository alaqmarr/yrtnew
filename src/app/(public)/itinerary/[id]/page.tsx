import { notFound, redirect } from "next/navigation";
import { itineraryService } from "@/modules/itineraries/service/itinerary.service";
import ItineraryActionButtons from "@/modules/itineraries/components/ItineraryActionButtons";
import OfficialQuoteDocument from "@/modules/itineraries/components/OfficialQuoteDocument";
import { decodeItineraryData } from "@/modules/itineraries/utils/itinerary-codec";
import { Itinerary } from "@/modules/itineraries/domain/itinerary.entity";

type RouteProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ data?: string; q?: string }>;
};

export async function generateMetadata({ params, searchParams }: RouteProps) {
  const { id } = await params;
  if (id === "custom") {
    return { title: "Custom Quotation Studio | Yellow Ribbon Travels" };
  }

  let itn: Itinerary | Partial<Itinerary> | null = await itineraryService.getItineraryById(id);

  if (!itn && searchParams) {
    const sParams = await searchParams;
    const rawData = sParams?.data || sParams?.q || id;
    itn = decodeItineraryData(rawData);
  }

  if (!itn) return { title: "Quotation Not Found | Yellow Ribbon Travels" };
  return {
    title: `${itn.title || "Custom Itinerary"} - ${itn.client_name || "Client"} | Official Quote - Yellow Ribbon Travels`,
    description: `Official travel quotation for ${itn.client_name || "Client"}. Destination: ${itn.destination || "Holiday Destination"}, Duration: ${itn.duration_nights || 1} Nights / ${itn.duration_days || 1} Days.`,
  };
}

export default async function ClientItineraryPage({ params, searchParams }: RouteProps) {
  const { id } = await params;

  if (id === "custom") {
    redirect("/admin/itineraries");
  }

  // 1. Try finding in database
  let itn: Itinerary | null = await itineraryService.getItineraryById(id);

  // 2. If not found in database, check if decoded from query or id parameter
  if (!itn) {
    let rawEncoded = id;
    if (searchParams) {
      const sParams = await searchParams;
      if (sParams?.data || sParams?.q) {
        rawEncoded = sParams.data || sParams.q || id;
      }
    }

    const decoded = decodeItineraryData(rawEncoded);
    if (decoded) {
      itn = {
        id: decoded.id || "custom_shared",
        reference_no: decoded.reference_no || "YRT-CUSTOM-QUOTE",
        client_name: decoded.client_name || "Valued Traveler",
        client_email: decoded.client_email || null,
        client_phone: decoded.client_phone || "+91 91002 28152",
        destination: decoded.destination || "Holiday Tour",
        title: decoded.title || "Custom Holiday Itinerary",
        start_date: decoded.start_date || "UPON CONFIRMATION",
        duration_days: Number(decoded.duration_days) || 1,
        duration_nights: Number(decoded.duration_nights) || 1,
        travelers_count: Number(decoded.travelers_count) || 2,
        hotel_details: decoded.hotel_details || null,
        flights_json: decoded.flights_json || "[]",
        days_json: decoded.days_json || "[]",
        inclusions_json: decoded.inclusions_json || "[]",
        exclusions_json: decoded.exclusions_json || "[]",
        total_price: Number(decoded.total_price) || 0,
        currency: decoded.currency || "INR",
        status: "Active",
        notes: decoded.notes || null,
        vehicle: decoded.vehicle || "Toyota Etios",
        pax_label: decoded.pax_label || "2 Adults",
        price_per_person: decoded.price_per_person ? Number(decoded.price_per_person) : null,
        accommodations_json: decoded.accommodations_json || "[]",
        package_highlights_json: decoded.package_highlights_json || "[]",
        important_notes_json: decoded.important_notes_json || "[]",
        created_at: decoded.created_at || new Date().toISOString(),
        updated_at: decoded.updated_at || new Date().toISOString(),
      };
    }
  }

  if (!itn) {
    notFound();
  }

  const cleanPhone = itn.client_phone.replace(/[^0-9]/g, "");

  return (
    <div className="w-full bg-slate-100/70 py-6 sm:py-10 print:py-0 print:bg-white min-h-screen">
      {/* Print Specific CSS to ensure pristine A4 page output matching Yellow Ribbon format */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 10mm 10mm 10mm 10mm;
              }
              html, body {
                background: #ffffff !important;
                color: #000000 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              header, footer, nav, .print\\:hidden, [data-floating-action] {
                display: none !important;
              }
              .quote-sheet-wrapper {
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              .quote-a4-page {
                box-shadow: none !important;
                border: none !important;
                margin: 0 0 0 0 !important;
                padding: 15mm 12mm 15mm 12mm !important;
                min-height: 275mm !important;
                width: 100% !important;
                max-width: 100% !important;
                page-break-after: always !important;
                break-after: page !important;
              }
              .page-break-after {
                page-break-after: always !important;
                break-after: page !important;
              }
            }
          `,
        }}
      />

      {/* Top Floating Client Action Bar (Hidden on print) */}
      <div className="w-full max-w-[800px] mx-auto px-4 mb-6 print:hidden" data-floating-action>
        <ItineraryActionButtons
          itineraryId={itn.id}
          referenceNo={itn.reference_no}
          clientName={itn.client_name}
          clientPhone={cleanPhone}
          destination={itn.destination}
          amount={itn.total_price}
        />
      </div>

      {/* Main Multi-Page Official Yellow Ribbon Quotation Document */}
      <OfficialQuoteDocument itinerary={itn} />
    </div>
  );
}
