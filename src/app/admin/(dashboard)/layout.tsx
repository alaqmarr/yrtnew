import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import AdminSidebar from "@/shared/components/AdminSidebar";

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
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Yellow Ribbon Admin Portal
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-amber-600">
              Live Production
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <span>Welcome, <strong>{session.user?.name || "Admin"}</strong></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Online" />
          </div>
        </header>

        {/* Content Body - only this scrolls */}
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto min-h-0">{children}</main>
      </div>
    </div>
  );
}
