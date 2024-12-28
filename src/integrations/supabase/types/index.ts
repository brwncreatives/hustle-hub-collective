import { GroupRow, GroupInsert, GroupUpdate, GroupJoinRequestRow, GroupJoinRequestInsert, GroupJoinRequestUpdate } from './groups';
import { GoalRow, GoalInsert, GoalUpdate } from './goals';
import { TaskRow, TaskInsert, TaskUpdate } from './tasks';
import { NotificationRow, NotificationInsert, NotificationUpdate } from './notifications';
import { ProfileRow, ProfileInsert, ProfileUpdate } from './profiles';

export interface Database {
  public: {
    Tables: {
      goals: {
        Row: GoalRow;
        Insert: GoalInsert;
        Update: GoalUpdate;
        Relationships: [];
      };
      tasks: {
        Row: TaskRow;
        Insert: TaskInsert;
        Update: TaskUpdate;
        Relationships: [
          {
            foreignKeyName: "tasks_goal_id_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goals";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: NotificationRow;
        Insert: NotificationInsert;
        Update: NotificationUpdate;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      groups: {
        Row: GroupRow;
        Insert: GroupInsert;
        Update: GroupUpdate;
        Relationships: [
          {
            foreignKeyName: "groups_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      group_join_requests: {
        Row: GroupJoinRequestRow;
        Insert: GroupJoinRequestInsert;
        Update: GroupJoinRequestUpdate;
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
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];