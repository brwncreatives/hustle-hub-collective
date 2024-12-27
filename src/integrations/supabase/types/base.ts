export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      goals: {
        Row: {
          categories: string[]
          created_at: string
          description: string | null
          id: string
          quarter: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categories?: string[]
          created_at?: string
          description?: string | null
          id?: string
          quarter: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categories?: string[]
          created_at?: string
          description?: string | null
          id?: string
          quarter?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      group_join_requests: {
        Row: {
          group_id: string
          user_id: string
          message: string
          email: string
          first_name: string
          last_name: string
          status: string
          created_at: string
        }
        Insert: {
          group_id: string
          user_id: string
          message?: string
          email: string
          first_name: string
          last_name: string
          status?: string
          created_at?: string
        }
        Update: {
          group_id?: string
          user_id?: string
          message?: string
          email?: string
          first_name?: string
          last_name?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_join_requests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_join_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}