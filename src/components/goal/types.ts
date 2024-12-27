export interface GoalFormValues {
  title: string;
  description?: string;
  status: string;
  quarter?: string;
  categories?: string[];
}

export interface GoalFormProps {
  initialValues?: GoalFormValues;
  onSubmit: (values: GoalFormValues) => void;
  title: string;
}