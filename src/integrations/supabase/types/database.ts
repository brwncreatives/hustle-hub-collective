import { GroupsDefinition } from './groups';
import { GoalsDefinition } from './goals';
import { TasksDefinition } from './tasks';
import { NotificationsDefinition } from './notifications';
import { ProfilesDefinition } from './profiles';

export type Database = {
  public: {
    Tables: {
      goals: GoalsDefinition;
      tasks: TasksDefinition;
      notifications: NotificationsDefinition;
      profiles: ProfilesDefinition;
      groups: GroupsDefinition;
      group_join_requests: {
        Row: {
          group_id: string;
          user_id: string;
          message: string;
          email: string;
          first_name: string;
          last_name: string;
          status: string;
          created_at: string;
        };
        Insert: {
          group_id: string;
          user_id: string;
          message?: string;
          email: string;
          first_name: string;
          last_name: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          group_id?: string;
          user_id?: string;
          message?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "group_join_requests_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "group_join_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];