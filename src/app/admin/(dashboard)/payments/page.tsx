import { paymentService } from "@/modules/payments/service/payment.service";
import AdminPaymentsManager from "@/modules/payments/components/AdminPaymentsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Razorpay Payments & Link Generator | Yellow Ribbon Admin",
};

export default async function AdminPaymentsPage() {
  const links = await paymentService.getAllPaymentLinks();

  return <AdminPaymentsManager initialLinks={links} />;
}
