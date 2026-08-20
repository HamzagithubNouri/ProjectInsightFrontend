export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  class_id?: number;
  class_name?: string;
  team_name?: string;
  commits?: number;
  ai_score?: number;
  status?: 'active' | 'inactive';
}

// Body exact attendu par POST /teacher/students
export interface CreateStudentPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  class_id: number;
}