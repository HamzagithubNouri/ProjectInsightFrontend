import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivityDay, RecentFinding } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private base = `${environment.apiUrl}/student/dashboard`;

  constructor(private http: HttpClient) {}

  getWeeklyActivity(): Observable<ActivityDay[]> {
    return this.http.get<ActivityDay[]>(`${this.base}/activity`);
  }

  getRecentFindings(limit = 5): Observable<RecentFinding[]> {
    return this.http.get<RecentFinding[]>(`${this.base}/recent-findings?limit=${limit}`);
  }
}