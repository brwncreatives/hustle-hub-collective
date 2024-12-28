export interface GroupRow {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface GroupInsert {
  id?: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  owner_id: string;
}

export interface GroupUpdate {
  id?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
}

export interface GroupJoinRequestRow {
  group_id: string;
  user_id: string;
  message: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
}

export interface GroupJoinRequestInsert {
  group_id: string;
  user_id: string;
  message?: string;
  email: string;
  first_name: string;
  last_name: string;
  status?: string;
  created_at?: string;
}

export interface GroupJoinRequestUpdate {
  group_id?: string;
  user_id?: string;
  message?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  created_at?: string;
}