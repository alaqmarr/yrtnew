import type { Metadata } from "next";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { ShieldCheck, Lock, Eye, FileText, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Yellow Ribbon Travels",
  description:
    "Learn how Yellow Ribbon Travels collects, protects, and handles personal data, payment information, and holiday bookings in compliance with data privacy regulations.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-[#FCFDFE] py-10 sm:py-16">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last updated: October 2026 • Effective Date: January 1, 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">1</span>
              <span>Introduction & Scope</span>
            </h2>
            <p>
              Yellow Ribbon Travels (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), headquartered at 2-2-51, Shop No. 2, Mittal Chambers, M.G. Road, Secunderabad, Telangana 500003, is committed to safeguarding the privacy and security of your personal data. This Privacy Policy governs your use of <strong>yellowribbontravels.com</strong>, including all booking forms, payment gateways, quotation inquiries, and customer concierge interactions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">2</span>
              <span>Information We Collect</span>
            </h2>
            <p>To deliver holiday packages, book airline tickets, and issue official travel documents, we collect:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Personal Identifiers:</strong> Full legal names (as in passport), date of birth, gender, nationality.</li>
              <li><strong>Contact Information:</strong> Phone/WhatsApp number, residential address, email address.</li>
              <li><strong>Travel Documents:</strong> Passport copies, visa copies, Frequent Flyer numbers, emergency contacts.</li>
              <li><strong>Payment Records:</strong> Transaction IDs, billing addresses, and invoice reference codes. (Note: Credit/debit card numbers are processed directly by PCI-DSS certified gateway Razorpay and never stored on our servers).</li>
              <li><strong>Technical & Session Data:</strong> IP address, browser type, cookies, and referral URLs for analytics and fraud detection.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">3</span>
              <span>How We Use Your Information</span>
            </h2>
            <p>We utilize collected information solely for legitimate travel operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Executing airline ticketing, hotel reservations, visa applications, and ground transfers.</li>
              <li>Routing inquiries to the appropriate domestic or international branch manager.</li>
              <li>Sending booking receipts, payment confirmations, and dynamic itinerary PDFs.</li>
              <li>Providing real-time flight updates, schedule changes, and travel advisory notices.</li>
              <li>Complying with statutory tax mandates, RBI regulations, and civil aviation security guidelines.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">4</span>
              <span>Sharing With Third-Party Travel Partners</span>
            </h2>
            <p>
              We only share pertinent travel details with accredited suppliers necessary to fulfill your booked itinerary:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Commercial airlines (IATA certified carriers) for flight passenger manifests.</li>
              <li>Hotels, resorts, and DMC partners (Destination Management Companies) for room vouchers.</li>
              <li>Visa processing centers, consulates, and embassies when visa filing services are requested.</li>
              <li>Razorpay Software Private Limited for secure online payments.</li>
            </ul>
            <p className="font-semibold text-slate-800">
              We never sell, rent, or trade your personal information to third-party advertisers or telemarketers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">5</span>
              <span>Data Retention & Security</span>
            </h2>
            <p>
              We employ industry-standard 256-bit SSL/TLS encryption for all data in transit. Sensitive operational databases are protected behind firewalls, strict role-based access control, and encrypted backups. Personal data is retained only as long as necessary to service your trips and fulfill statutory tax and audit obligations under Indian law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">6</span>
              <span>Your Rights & Data Inquiries</span>
            </h2>
            <p>
              You have the right to request access to, correction of, or deletion of your personal records, subject to regulatory retention limits. For privacy requests, please contact our Data Protection Desk:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-1">
              <p><strong>Compliance Officer:</strong> Privacy & Grievance Cell</p>
              <p><strong>Email:</strong> yellowribbontravels@gmail.com</p>
              <p><strong>Phone:</strong> +91 91002 28152</p>
              <p><strong>Office:</strong> Mittal Chambers, M.G. Road, Secunderabad, Telangana 500003</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
