import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TeacherPrSummary, PrReviewResult } from '../models/pull-request.model';

@Injectable({ providedIn: 'root' })
export class TeacherPullRequestService {
  private base = `${environment.apiUrl}/teacher/teams`;

  constructor(private http: HttpClient) {}

  // GET /teacher/teams/{team_id}/prs
  list(teamId: number): Observable<TeacherPrSummary[]> {
    return this.http.get<TeacherPrSummary[]>(`${this.base}/${teamId}/prs`);
  }

  // GET /teacher/teams/{team_id}/prs/{pr_number}/review
  // Lecture seule : ne relance JAMAIS LangChain (contrairement au flux étudiant)
  getReview(teamId: number, prNumber: number): Observable<PrReviewResult> {
    return this.http.get<PrReviewResult>(`${this.base}/${teamId}/prs/${prNumber}/review`);
  }
}