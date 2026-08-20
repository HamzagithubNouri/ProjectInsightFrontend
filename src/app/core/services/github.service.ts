import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GithubRepo {
  full_name: string;
  private: boolean;
  default_branch: string;
}

export interface GithubBranch {
  name: string;
}

export interface GithubStatus {
  connected: boolean;
  github_username: string | null;
}

@Injectable({ providedIn: 'root' })
export class GithubService {
  private base = `${environment.apiUrl}/student/github`;

  constructor(private http: HttpClient) {}

  // Redirige le navigateur vers GitHub pour l'autorisation OAuth
  connect(): void {
    this.http.get<{ authorize_url: string }>(`${this.base}/connect`).subscribe((res) => {
      window.location.href = res.authorize_url;
    });
  }

  getStatus(): Observable<GithubStatus> {
    return this.http.get<GithubStatus>(`${this.base}/status`);
  }

  listRepos(): Observable<GithubRepo[]> {
    return this.http.get<GithubRepo[]>(`${this.base}/repos`);
  }

  listBranches(owner: string, repo: string): Observable<GithubBranch[]> {
    return this.http.get<GithubBranch[]>(`${this.base}/repos/${owner}/${repo}/branches`);
  }

  disconnect(): Observable<unknown> {
    return this.http.post(`${this.base}/disconnect`, {});
  }
}