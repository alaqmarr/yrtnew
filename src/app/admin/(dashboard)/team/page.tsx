import { teamService } from "@/modules/team/service/team.service";
import AdminTeamManager from "@/modules/team/components/AdminTeamManager";

export const revalidate = 0;

export default async function AdminTeamPage() {
  const team = await teamService.getAllTeam();
  return <AdminTeamManager initialTeam={team} />;
}
