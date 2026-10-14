import type { Metadata } from "next";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { RefreshCw, AlertCircle, Clock, CreditCard, ShieldCheck } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Yellow Ribbon Travels",
  description:
    "Review the transparent cancellation, return, and refund policies for tour packages, flight bookings, and online Razorpay transactions at Yellow Ribbon Travels.",
  alternates: {
    canonical: "/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="w-full bg-[#FCFDFE] py-10 sm:py-16">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Refund & Cancellation Policy" }]} />

        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>Fair & Transparent Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last updated: October 2026 • Applicable to all bookings made through Yellow Ribbon Travels & branches
          </p>
        </div>

        {/* Highlight Note */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Important Overview</span>
            <p className="text-amber-800/90 leading-relaxed">
              Every travel supplier (airline, hotel, cruise line, or destination transport provider) enforces specific commercial terms. While Yellow Ribbon Travels advocates vigorously on your behalf for maximum refund flexibility, third-party supplier penalties apply strictly according to their tariffs.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          {/* Section 1: Holiday Package Cancellations */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">1</span>
              <span>Holiday & Tour Package Cancellation Slabs</span>
            </h2>
            <p>
              In the event you need to cancel a confirmed domestic or international holiday package, standard charges are determined by the time of written cancellation notice received at our office:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 mt-4">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 sm:p-4">Cancellation Notice Period</th>
                    <th className="p-3.5 sm:p-4">Cancellation Charges Applicable</th>
                    <th className="p-3.5 sm:p-4">Refund Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-900">30+ Days prior to departure</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">10% of total package cost (Admin & Processing Fee) + non-refundable airline/hotel deposits</td>
                    <td className="p-3.5 sm:p-4 text-emerald-700 font-bold">90% of refundable package cost</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-900">16 to 29 Days prior to departure</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">30% of total tour price + actual airline/hotel charges</td>
                    <td className="p-3.5 sm:p-4 text-emerald-700 font-bold">70% of refundable package cost</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-900">8 to 15 Days prior to departure</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">60% of total tour price + actual airline/hotel charges</td>
                    <td className="p-3.5 sm:p-4 text-amber-700 font-bold">40% of refundable package cost</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-900">0 to 7 Days prior / No Show</td>
                    <td className="p-3.5 sm:p-4 text-rose-700 font-bold">100% of total package cost</td>
                    <td className="p-3.5 sm:p-4 text-rose-700 font-bold">0% (Strictly Non-refundable)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 italic mt-1">
              * Note: Peak season departures (Christmas, New Year, Diwali, Eid, and Summer school vacations) may carry 100% non-refundable hotel clauses as stipulated by destination hoteliers.
            </p>
          </section>

          {/* Section 2: Airline Ticket Cancellations */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold">2</span>
              <span>Flight Booking Cancellations & Airline Tariffs</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Airline Fare Rules:</strong> All airline tickets issued through our IATA flight desk are subject to the respective airline carrier&apos;s fare guidelines. Certain promotional economy tickets are non-refundable.
              </li>
              <li>
                <strong>Convenience & Service Fees:</strong> Yellow Ribbon Travels levies a nominal service processing fee of ₹350 per passenger for domestic flight cancellations and ₹750 per passenger for international flight cancellations.
              </li>
              <li>
                <strong>Involuntary Cancellations by Airline:</strong> If an airline reschedules or cancels a flight due to technical faults or weather disruptions, we initiate a 100% full refund of the airline fare or arrange alternate flight sectors with zero agency fee.
              </li>
            </ul>
          </section>

          {/* Section 3: Razorpay & Refund Timeline */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">3</span>
              <span>Razorpay Online Payment Refunds & Timelines</span>
            </h2>
            <p>
              When a refund is approved by our billing department:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Automated Reversal:</strong> The refund is credited directly to the original payment source (Credit Card, Debit Card, Net Banking account, or UPI VPA) via Razorpay.
              </li>
              <li>
                <strong>Processing Turnaround:</strong> Banks and card networks typically reflect refunded amounts within <strong>5 to 7 business banking days</strong> from the date of release.
              </li>
              <li>
                <strong>Proof of Refund:</strong> You will receive an official Razorpay Refund Reference ARN (Acquirer Reference Number) via email for tracking with your issuing bank.
              </li>
            </ul>
          </section>

          {/* Section 4: Visa & Force Majeure */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-bold">4</span>
              <span>Visa Rejections & Force Majeure</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Visa Rejection:</strong> Consular and embassy visa fees are 100% non-refundable under all circumstances once submitted. If a visa is rejected, applicable tour cancellation fees will be computed based on the date the official rejection letter is furnished to us.
              </li>
              <li>
                <strong>Force Majeure:</strong> In events of natural catastrophe, acts of war, civil unrest, epidemic lockdowns, or government travel bans, we will work with airline and hotel partners to secure credit travel shells or date change waivers rather than forfeitures.
              </li>
            </ul>
          </section>

          {/* Section 5: How to Request a Cancellation */}
          <section className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-amber-400">
              How to Request a Cancellation or Refund
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              To initiate a cancellation, please email our billing and accounts desk with your <strong>Booking ID / Invoice Code</strong> and reason for cancellation:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs sm:text-sm pt-1">
              <a
                href="mailto:yellowribbontravels@gmail.com?subject=Cancellation%20Request"
                className="text-amber-400 hover:underline font-bold"
              >
                ✉ yellowribbontravels@gmail.com
              </a>
              <span className="hidden sm:inline text-slate-600">|</span>
              <a
                href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20need%20assistance%20with%20a%20booking%20cancellation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#25D366] font-bold hover:underline"
              >
                <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                <span>WhatsApp Helpline: +91 91002 28152</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
