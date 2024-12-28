export interface TasksDefinition {
  Row: {
    completed: boolean;
    created_at: string;
    goal_id: string;
    id: string;
    is_recurring: boolean;
    title: string;
    updated_at: string;
    week: number | null;
  };
  Insert: {
    completed?: boolean;
    created_at?: string;
    goal_id: string;
    id?: string;
    is_recurring?: boolean;
    title: string;
    updated_at?: string;
    week?: number | null;
  };
  Update: {
    completed?: boolean;
    created_at?: string;
    goal_id?: string;
    id?: string;
    is_recurring?: boolean;
    title?: string;
    updated_at?: string;
    week?: number | null;
  };
  Relationships: [
    {
      foreignKeyName: "tasks_goal_id_fkey";
      columns: ["goal_id"];
      isOneToOne: false;
      referencedRelation: "goals";
      referencedColumns: ["id"];
    }
  ];
}