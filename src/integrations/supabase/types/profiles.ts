export interface ProfilesDefinition {
  Row: {
    created_at: string;
    first_name: string | null;
    id: string;
    last_name: string | null;
    onboarding_completed: boolean | null;
    updated_at: string;
  };
  Insert: {
    created_at?: string;
    first_name?: string | null;
    id: string;
    last_name?: string | null;
    onboarding_completed?: boolean | null;
    updated_at?: string;
  };
  Update: {
    created_at?: string;
    first_name?: string | null;
    id?: string;
    last_name?: string | null;
    onboarding_completed?: boolean | null;
    updated_at?: string;
  };
  Relationships: [];
}