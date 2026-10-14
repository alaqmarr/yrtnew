import { siteSettingService } from "@/modules/site-settings/service/site-setting.service";
import { paymentService } from "@/modules/payments/service/payment.service";
import { itineraryService } from "@/modules/itineraries/service/itinerary.service";
import { invoiceService } from "@/modules/invoices/service/invoice.service";
import BetaLabView from "@/modules/beta/components/BetaLabView";

export const revalidate = 0;

export const metadata = {
  title: "Beta & QA Testing Suite | Yellow Ribbon Travels Official Lab",
  description:
    "Comprehensive testing suite for Yellow Ribbon Travels. Run test Razorpay transactions, verify itinerary and invoice PDF exports, inspect API diagnostics, and test SMTP email notifications.",
};

export default async function BetaPage() {
  const settings = await siteSettingService.getSettingsMap();
  const razorpayMode = settings.razorpay_mode || "test";
  const testKeyId = settings.razorpay_key_id_test || "rzp_test_YellowRibbonTravels";
  const liveKeyId = settings.razorpay_key_id_live || "";

  // Fetch sample items for easy testing
  const itineraries = await itineraryService.getAllItineraries();
  const sampleItineraryId = itineraries[0]?.id || "itin_demo_1";

  const invoices = await invoiceService.getAllInvoices();
  const sampleInvoiceId = invoices[0]?.id || "inv_demo_1";

  const paymentLinks = await paymentService.getAllPaymentLinks();
  const samplePaymentCode = paymentLinks[0]?.link_code || "PAY-KASHMIR-9421";

  return (
    <BetaLabView
      razorpayMode={razorpayMode}
      testKeyId={testKeyId}
      liveKeyId={liveKeyId}
      sampleItineraryId={sampleItineraryId}
      sampleInvoiceId={sampleInvoiceId}
      samplePaymentCode={samplePaymentCode}
    />
  );
}
