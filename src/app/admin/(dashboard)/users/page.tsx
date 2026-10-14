import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { userService } from "@/modules/users/service/user.service";
import { branchService } from "@/modules/branches/service/branch.service";
import AdminUsersManager from "@/modules/users/components/AdminUsersManager";
import { redirect } from "next/navigation";

export const revalidate = 0;

export const metadata = {
  title: "Staff & Admin Accounts | YR Admin Console",
  description: "Manage administrator and staff accounts, privileges, and branch assignments.",
};

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session || (role !== "admin" && role !== "superadmin" && role !== "staff")) {
    redirect("/admin/login");
  }

  const [users, branches] = await Promise.all([
    userService.getAllUsers(),
    branchService.getActiveBranches(),
  ]);

  return (
    <AdminUsersManager
      initialUsers={users}
      branches={branches}
      currentUserId={session.user.id}
      currentUserRole={session.user.role}
    />
  );
}
