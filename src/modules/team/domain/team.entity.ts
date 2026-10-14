export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  bio: string;
  image_url: string;
  phone: string | null;
  email: string | null;
  linkedin: string | null;
  order_index: number;
  created_at: string;
}

export interface CreateTeamMemberDto {
  name: string;
  designation: string;
  department: string;
  bio: string;
  image_url: string;
  phone?: string | null;
  email?: string | null;
  linkedin?: string | null;
  order_index?: number;
}

export interface UpdateTeamMemberDto extends Partial<CreateTeamMemberDto> {
  id: string;
}
