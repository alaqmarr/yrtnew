import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { accountService } from "@/modules/account/service/account.service";
import AccountDashboard from "@/modules/account/components/AccountDashboard";
import Breadcrumbs from "@/shared/components/Breadcrumbs";

export const metadata = {
  title: "Client Portal & Traveler Account | Yellow Ribbon Travels",
  description:
    "Manage your bookings, flight inquiries, payment links, support tickets, and saved travel wishlist.",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/account/login");
  }

  const userId = (session.user as { id?: string }).id || "";
  const email = session.user.email || "";
  const phone = (session.user as { phone?: string }).phone || "";

  const data = await accountService.getDashboardData(userId, email, phone);

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-8">
      <Breadcrumbs items={[{ label: "Client Portal" }]} />
      <AccountDashboard initialData={data} />
    </div>
  );
}
