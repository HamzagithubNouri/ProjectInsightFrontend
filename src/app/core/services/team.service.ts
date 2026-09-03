import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Team, CreateTeamPayload } from '../models/team.model';
import { TeamMemberInfo, TeamRepositoryInfo } from './team-me.service';

// Correspond exactement a TeamProjectDetailsOut (backend)
export interface TeamProjectDetails {
  team_id: number;
  team_name: string;
  class_name: string;
  repository: TeamRepositoryInfo | null;
  members: TeamMemberInfo[];
  total_commits: number;
  total_pull_requests: number;
}

@Injectable({ providedIn: 'root' })
export class TeamService {
  private base = `${environment.apiUrl}/teacher/teams`;

  constructor(private http: HttpClient) {}

  // ATTENTION: cette route GET n'existe pas encore côté FastAPI (a ajouter)
  getAll(classId?: number): Observable<Team[]> {
    const url = classId ? `${this.base}?class_id=${classId}` : this.base;
    return this.http.get<Team[]>(url);
  }

  create(payload: CreateTeamPayload): Observable<Team> {
    return this.http.post<Team>(this.base, payload);
  }

  addMember(teamId: number, studentId: number): Observable<any> {
    return this.http.post(`${this.base}/${teamId}/members`, { student_id: studentId });
  }

  // GET /teacher/teams/{team_id}/details -> repo + membres + stats GitHub, en un seul appel
  getProjectDetails(teamId: number): Observable<TeamProjectDetails> {
    return this.http.get<TeamProjectDetails>(`${this.base}/${teamId}/details`);
  }
}