import { teamRepository } from "../repository/team.repository";
import { TeamMember, CreateTeamMemberDto, UpdateTeamMemberDto } from "../domain/team.entity";

export class TeamService {
  async getAllTeam(): Promise<TeamMember[]> {
    return teamRepository.findAll();
  }

  async getTeamMemberById(id: string): Promise<TeamMember | null> {
    return teamRepository.findById(id);
  }

  async createTeamMember(data: CreateTeamMemberDto): Promise<TeamMember> {
    return teamRepository.create(data);
  }

  async updateTeamMember(data: UpdateTeamMemberDto): Promise<TeamMember> {
    return teamRepository.update(data);
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    return teamRepository.delete(id);
  }
}

export const teamService = new TeamService();
