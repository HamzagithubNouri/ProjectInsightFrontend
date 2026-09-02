import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PullRequestSummary, PrReviewResult } from '../models/pull-request.model';

@Injectable({ providedIn: 'root' })
export class PullRequestService {
  private base = `${environment.apiUrl}/student/teams`;

  constructor(private http: HttpClient) {}

  // GET /student/teams/{team_id}/pulls
  list(teamId: number): Observable<PullRequestSummary[]> {
    return this.http.get<PullRequestSummary[]>(`${this.base}/${teamId}/pulls`);
  }

  // GET /student/teams/{team_id}/pr/{pr_number}/review -> lance une VRAIE analyse LangChain
  review(teamId: number, prNumber: number): Observable<PrReviewResult> {
    return this.http.get<PrReviewResult>(`${this.base}/${teamId}/pr/${prNumber}/review`);
  }

  // GET /student/teams/{team_id}/pr/{pr_number}/review-history -> ne lance rien, lit la review sauvegardée
  getReviewHistory(teamId: number, prNumber: number): Observable<PrReviewResult> {
    return this.http.get<PrReviewResult>(`${this.base}/${teamId}/pr/${prNumber}/review-history`);
  }
}