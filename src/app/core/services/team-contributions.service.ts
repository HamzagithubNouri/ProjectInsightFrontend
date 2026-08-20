import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Correspond exactement a MemberContribution (backend)
export interface MemberContribution {
  student_id: number;
  first_name: string;
  last_name: string;
  github_username: string | null;
  linked: boolean;
  commits: number;
  pull_requests: number;
  percentage: number;
}

// Correspond exactement a TeamContributionsOut (backend)
export interface TeamContributions {
  total_commits: number;
  total_pull_requests: number;
  contributions: MemberContribution[];
}

@Injectable({ providedIn: 'root' })
export class TeamContributionsService {
  constructor(private http: HttpClient) {}

  getContributions(): Observable<TeamContributions> {
    return this.http.get<TeamContributions>(`${environment.apiUrl}/student/team/contributions`);
  }
}