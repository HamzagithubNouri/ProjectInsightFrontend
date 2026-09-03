export interface ClassSummary {
  id: number;
  name: string;
  student_count: number;
  team_count: number;
}

export interface TeamSummary {
  id: number;
  name: string;
  member_count: number;
  repository_connected: boolean;
}

export interface ClassDetail {
  id: number;
  name: string;
  student_count: number;
  team_count: number;
  teams: TeamSummary[];
}

// Body exact attendu par POST /teacher/classes
export interface CreateClassPayload {
  name: string;
  course_code?: string;
  year: string;
  max_students?: number;
}