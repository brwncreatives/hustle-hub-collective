export interface ProfileRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  onboarding_completed: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  onboarding_completed?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  onboarding_completed?: boolean | null;
  created_at?: string;
  updated_at?: string;
}