export interface Branch {
  id: string;
  city: string;
  state: string;
  country: string;
  is_international: boolean;
  branch_type: string;
  address: string;
  phone: string;
  email: string;
  google_maps_url: string | null;
  map_embed_url: string | null;
  manager_name: string | null;
  manager_phone: string | null;
  timing: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateBranchDto {
  city: string;
  state: string;
  country?: string;
  is_international?: boolean;
  branch_type?: string;
  address: string;
  phone: string;
  email: string;
  google_maps_url?: string | null;
  map_embed_url?: string | null;
  manager_name?: string | null;
  manager_phone?: string | null;
  timing?: string | null;
  is_active?: boolean;
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {
  id: string;
}

