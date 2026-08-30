import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivityEvent } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class TeamActivityService {
  constructor(private http: HttpClient) {}

  getActivity(limit = 10): Observable<ActivityEvent[]> {
    return this.http.get<ActivityEvent[]>(`${environment.apiUrl}/student/team/activity?limit=${limit}`);
  }
}