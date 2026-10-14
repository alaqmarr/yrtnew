import type { Metadata } from "next";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { FileText, CheckCircle, Scale, ShieldAlert, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Yellow Ribbon Travels",
  description:
    "Terms and Conditions, booking agreements, passenger responsibilities, GST & TCS regulations, and legal terms for travel with Yellow Ribbon Travels.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="w-full bg-[#FCFDFE] py-10 sm:py-16">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Terms & Conditions" }]} />

        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-cyan-600" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last updated: October 2026 • Please read carefully before booking any tour, flight, or holiday package.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold">1</span>
              <span>The Booking Contract</span>
            </h2>
            <p>
              By paying an advance deposit or full package price through Yellow Ribbon Travels (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), you (&quot;Client&quot;, &quot;Passenger&quot;, &quot;You&quot;) confirm that you accept these Terms &amp; Conditions on behalf of yourself and all persons named in the booking. A booking is legally binding only once we have issued a formal Booking Confirmation Voucher or Tax Invoice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold">2</span>
              <span>Pricing, Currency, GST &amp; TCS Compliance</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Currency:</strong> Tour packages are quoted in Indian Rupees (INR) for Indian residents and applicable local currencies (USD, AED, GBP, EUR) for our international branch clients.
              </li>
              <li>
                <strong>Goods &amp; Services Tax (GST):</strong> Applicable GST (5% for tour packages without input tax credit or statutory rates) is levied on all travel bookings in accordance with Government of India regulations.
              </li>
              <li>
                <strong>Tax Collected at Source (TCS):</strong> In compliance with Section 206C(1G) of the Indian Income Tax Act, TCS applies to overseas tour packages purchased by Indian residents under the Liberalised Remittance Scheme (LRS). PAN verification is mandatory.
              </li>
              <li>
                <strong>Price Fluctuations:</strong> Quotes remain subject to exchange rate variations, airline fuel surcharges, or statutory tax changes until full payment has been received and tickets/vouchers have been ticketed.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold">3</span>
              <span>Passports, Visas &amp; Health Regulations</span>
            </h2>
            <p>
              It is the sole responsibility of the passenger to ensure all travel documentation is in valid order:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Passports must carry a minimum of <strong>6 months validity</strong> from the scheduled date of return to India or country of departure.</li>
              <li>Passengers must possess valid entry visas, transit visas, or OK-To-Board endorsements required by the destination nation.</li>
              <li>While our visa assistance desk provides documentation support and filing services, visa grant or refusal is the sole prerogative of the respective sovereign embassy or consulate.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold">4</span>
              <span>Mandatory Overseas Travel Insurance</span>
            </h2>
            <p>
              Yellow Ribbon Travels strongly recommends that all passengers purchase comprehensive overseas travel and medical insurance. Insurance policies should cover trip cancellations, medical emergencies, emergency medical evacuations, baggage loss or delay, and personal liability. We can assist in issuing insurance policies from leading IRDAI-approved insurers upon request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold">5</span>
              <span>Limitation of Liability</span>
            </h2>
            <p>
              Yellow Ribbon Travels acts as an organizer and facilitator between clients and third-party service providers (airlines, hotels, coach operators, safari providers, and cruise lines). The Company shall not be liable for any loss, damage, injury, accident, delay, irregularity, or inconvenience arising from:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Airline delays, overbooking, technical cancellations, or baggage mishandling.</li>
              <li>Acts of God, adverse weather conditions, political strikes, civil disturbances, or epidemic restrictions.</li>
              <li>Personal negligence, health complications, or non-compliance with local laws by travelers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold">6</span>
              <span>Governing Law &amp; Jurisdiction</span>
            </h2>
            <p>
              This agreement and all disputes arising under or related to your booking shall be governed exclusively by the laws of India. Any legal dispute, arbitration, or litigation shall be subject to the exclusive jurisdiction of the competent courts in <strong>Secunderabad / Hyderabad, Telangana</strong>.
            </p>
          </section>

          <section className="p-5 rounded-2xl bg-slate-100 text-xs sm:text-sm text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">Headquarters Address:</p>
            <p>Yellow Ribbon Travels &amp; Tours, 2-2-51, Shop No. 2, Mittal Chambers, M.G. Road, Secunderabad, Telangana 500003, India.</p>
            <p>Contact: +91 91002 28152 | Email: yellowribbontravels@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
