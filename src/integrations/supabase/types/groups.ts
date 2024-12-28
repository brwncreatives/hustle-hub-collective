export interface GroupsDefinition {
  Row: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    owner_id: string;
  };
  Insert: {
    id?: string;
    name: string;
    created_at?: string;
    updated_at?: string;
    owner_id: string;
  };
  Update: {
    id?: string;
    name?: string;
    created_at?: string;
    updated_at?: string;
    owner_id?: string;
  };
  Relationships: [
    {
      foreignKeyName: "groups_owner_id_fkey";
      columns: ["owner_id"];
      isOneToOne: false;
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
}

export type GroupRow = GroupsDefinition['Row'];
export type GroupInsert = GroupsDefinition['Insert'];
export type GroupUpdate = GroupsDefinition['Update'];

export interface GroupJoinRequestsDefinition {
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
}

export type GroupJoinRequestRow = GroupJoinRequestsDefinition['Row'];
export type GroupJoinRequestInsert = GroupJoinRequestsDefinition['Insert'];
export type GroupJoinRequestUpdate = GroupJoinRequestsDefinition['Update'];