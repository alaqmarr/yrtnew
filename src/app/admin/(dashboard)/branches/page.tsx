import { branchService } from "@/modules/branches/service/branch.service";
import AdminBranchesManager from "@/modules/branches/components/AdminBranchesManager";

export const revalidate = 0;

export default async function AdminBranchesPage() {
  const branches = await branchService.getAllBranches();
  return <AdminBranchesManager initialBranches={branches} />;
}
