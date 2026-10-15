export type FamilyRelationship =
  | "Spouse"
  | "Child"
  | "Parent"
  | "Sibling"
  | "Grandparent"
  | "In-Law"
  | "Relative"
  | "Companion"
  | "Other";

export type AgeGroup = "Adult" | "Child" | "Infant";

export interface FamilyMember {
  id: string;
  primary_user_id: string;
  member_user_id: string | null;
  name: string;
  relationship: FamilyRelationship;
  gender?: string | null;
  date_of_birth?: string | null;
  age_group: AgeGroup;
  email?: string | null;
  phone?: string | null;
  passport_number?: string | null;
  passport_expiry?: string | null;
  nationality?: string;
  dietary_preference?: string;
  notes?: string | null;
  can_login: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFamilyMemberDto {
  name: string;
  relationship: FamilyRelationship;
  gender?: string | null;
  date_of_birth?: string | null;
  age_group?: AgeGroup;
  email?: string | null;
  phone?: string | null;
  passport_number?: string | null;
  passport_expiry?: string | null;
  nationality?: string;
  dietary_preference?: string;
  notes?: string | null;
  create_account?: boolean;
  password?: string;
}

export interface UpdateFamilyMemberDto {
  name?: string;
  relationship?: FamilyRelationship;
  gender?: string | null;
  date_of_birth?: string | null;
  age_group?: AgeGroup;
  email?: string | null;
  phone?: string | null;
  passport_number?: string | null;
  passport_expiry?: string | null;
  nationality?: string;
  dietary_preference?: string;
  notes?: string | null;
}

export interface FamilyGroupData {
  isFamilyHead: boolean;
  headUser?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
  members: FamilyMember[];
  myMembership?: FamilyMember | null;
}
