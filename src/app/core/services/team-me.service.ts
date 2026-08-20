import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type TeamRole = 'LEADER' | 'MEMBER';

// Correspond exactement a TeamMemberInfo (backend)
export interface TeamMemberInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_leader: boolean;
  github_username: string | null;
  github_linked: boolean;
}

// Correspond exactement a RepositoryOut (backend)
export interface TeamRepositoryInfo {
  id: number;
  team_id: number;
  github_url: string;
  branch: string;
  github_username: string | null;
  status: string; // "connected"
  connected_at: string;
}

// Correspond exactement a MyTeamOut (backend) - PAS de stats/annee/activite ici
export interface MyTeam {
  team_id: number;
  team_name: string;
  class_name: string;
  leader: TeamMemberInfo | null;
  members: TeamMemberInfo[];
  repository: TeamRepositoryInfo | null;
  my_team_role: TeamRole;
}

@Injectable({ providedIn: 'root' })
export class TeamMeService {
  private cached$?: Observable<MyTeam>;
  private lastValue: MyTeam | null = null;

  constructor(private http: HttpClient) {}

  getMyTeam(): Observable<MyTeam> {
    if (!this.cached$) {
      this.cached$ = this.http.get<MyTeam>(`${environment.apiUrl}/student/team`).pipe(
        tap((team) => (this.lastValue = team)),
        shareReplay(1),
      );
    }
    return this.cached$;
  }

  refresh(): Observable<MyTeam> {
    this.clearCache();
    return this.getMyTeam();
  }

  get isLeader(): boolean {
    return this.lastValue?.my_team_role === 'LEADER';
  }

  // IMPORTANT: a appeler au logout ET au login pour eviter qu'un compte
  // recupere en cache les donnees d'equipe du compte precedent.
  clearCache(): void {
    this.cached$ = undefined;
    this.lastValue = null;
  }
}