import { notFound } from "next/navigation";
import { paymentService } from "@/modules/payments/service/payment.service";
import ReceiptPageClient from "@/modules/payments/components/ReceiptPageClient";
import { ReceiptData } from "@/modules/payments/components/PaymentReceiptModal";

type RouteProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: RouteProps) {
  const { code } = await params;
  const link = await paymentService.getPaymentLinkByCode(code);
  if (!link) return { title: "Receipt Not Found | Yellow Ribbon Travels" };
  return {
    title: `Official Tax Receipt YRT-REC-${link.link_code} | Yellow Ribbon Travels`,
    description: `Official Tax Invoice & Payment Receipt for ${link.customer_name}. Amount: ₹${link.amount.toLocaleString(
      "en-IN"
    )}.`,
  };
}

export default async function OfficialReceiptPage({
  params,
  searchParams,
}: RouteProps) {
  const { code } = await params;
  const sParams = await searchParams;
  const autoprint = sParams.autoprint;

  const link = await paymentService.getPaymentLinkByCode(code);
  if (!link) {
    notFound();
  }

  const receiptData: ReceiptData = {
    linkCode: link.link_code,
    customerName: link.customer_name,
    customerPhone: link.customer_phone,
    customerEmail: link.customer_email || undefined,
    purpose: link.purpose,
    description: link.description,
    amount: link.amount,
    currency: link.currency,
    status: link.status,
    paymentId: link.razorpay_payment_id,
    paidAt: link.paid_at,
    createdAt: link.created_at,
  };

  const shouldAutoPrint =
    autoprint === "true" || autoprint === "1" || autoprint === "";

  return <ReceiptPageClient data={receiptData} autoPrint={shouldAutoPrint} />;
}
