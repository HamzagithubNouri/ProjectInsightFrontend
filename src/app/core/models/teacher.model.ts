export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  school_class_id: number | null;
  created_at: string;
}

export interface CreateTeacherPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}