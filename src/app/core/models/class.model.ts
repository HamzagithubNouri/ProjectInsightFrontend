export interface SchoolClass {
  id: number;
  name: string;
  course_code?: string;
  year: string;
  max_students?: number;
  student_count?: number;
  team_count?: number;
  progress?: number;
  status?: 'active' | 'archived';
}

// Body exact attendu par POST /teacher/classes
export interface CreateClassPayload {
  name: string;
  course_code?: string;
  year: string;
  max_students?: number;
}