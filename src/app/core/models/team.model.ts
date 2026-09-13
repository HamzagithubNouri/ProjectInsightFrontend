export interface Team {
  id: number;
  name: string;
  class_id: number;
  leader_id?: number | null;
}

// Body exact attendu par POST /teacher/teams
export interface CreateTeamPayload {
  name: string;
  class_id: number;
  member_ids?: number[];
  leader_id?: number;
}

// Vue combinée pour la page Teams : construite à partir de
// GET /teacher/classes + GET /teacher/classes/{id} (déjà implémentés)
export interface TeamListItem {
  id: number;
  name: string;
  member_count: number;
  class_name: string;
}

// Correspond a UserOut (backend) - utilisee pour "Available Students"
export interface AvailableStudent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}