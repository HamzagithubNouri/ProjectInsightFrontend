import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Correspond exactement a RepositoryOut (backend)
export interface TeamRepository {
  id: number;
  team_id: number;
  github_url: string;
  branch: string;
  github_username: string | null;
  status: string; // "connected"
  connected_at: string;
}

interface ConnectRepositoryPayload {
  github_url: string;
  branch: string;
  github_username: string | null;
}

@Injectable({ providedIn: 'root' })
export class RepositoryService {
  private base = `${environment.apiUrl}/student/teams`;

  constructor(private http: HttpClient) {}

  // Renvoie 404 si l'equipe n'a pas encore de repo connecte (normal, a intercepter)
  getTeamRepository(teamId: number): Observable<TeamRepository> {
    return this.http.get<TeamRepository>(`${this.base}/${teamId}/repository`);
  }

  connectTeamRepository(teamId: number, payload: ConnectRepositoryPayload): Observable<TeamRepository> {
    return this.http.post<TeamRepository>(`${this.base}/${teamId}/repository`, payload);
  }
}