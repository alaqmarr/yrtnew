import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import AdminShell from "./AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const role = session.user?.role;
  if (role !== "admin" && role !== "superadmin" && role !== "staff") {
    redirect("/account");
  }

  return (
    <AdminShell userName={session.user?.name || "Admin"}>
      {children}
    </AdminShell>
  );
}
