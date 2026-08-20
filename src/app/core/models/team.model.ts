export interface Team {
  id: number;
  name: string;
  class_id: number;
  class_name?: string;
  leader_name?: string;
  member_count?: number;
  ai_score?: number;
  balance?: number;
  repo_connected?: boolean;
  status?: 'excellent' | 'good' | 'average' | 'at-risk';
}

// Body exact attendu par POST /teacher/teams
export interface CreateTeamPayload {
  name: string;
  class_id: number;
  member_ids?: number[];
  leader_id?: number;
}