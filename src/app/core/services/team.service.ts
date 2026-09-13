import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTeamPayload, AvailableStudent } from '../models/team.model';
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

  create(payload: CreateTeamPayload): Observable<unknown> {
    return this.http.post(this.base, payload);
  }

  // GET /teacher/teams/{team_id}/details -> repo + membres + stats GitHub
  // Reutilise ici uniquement pour recuperer .members (liste "Remove Member")
  getProjectDetails(teamId: number): Observable<TeamProjectDetails> {
    return this.http.get<TeamProjectDetails>(`${this.base}/${teamId}/details`);
  }

  // GET /teacher/teams/{team_id}/available-students -> etudiants de la classe
  // pas encore membres de l'equipe, alimente le modal "Add Member"
  getAvailableStudents(teamId: number): Observable<AvailableStudent[]> {
    return this.http.get<AvailableStudent[]>(`${this.base}/${teamId}/available-students`);
  }

  // POST /teacher/teams/{team_id}/members
  addMember(teamId: number, studentId: number): Observable<unknown> {
    return this.http.post(`${this.base}/${teamId}/members`, { student_id: studentId });
  }

  // DELETE /teacher/teams/{team_id}/members/{student_id}
  removeMember(teamId: number, studentId: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${teamId}/members/${studentId}`);
  }
}