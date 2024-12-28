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