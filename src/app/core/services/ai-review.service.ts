import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiReviewResult } from '../models/ai-review.model';

@Injectable({ providedIn: 'root' })
export class AiReviewService {
  private base = `${environment.apiUrl}/ai-review`;

  constructor(private http: HttpClient) {}

  analyzeCode(code: string, filename: string): Observable<AiReviewResult> {
    return this.http.post<AiReviewResult>(`${this.base}/analyze`, { code, filename });
  }

  analyzeFile(file: File): Observable<AiReviewResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<AiReviewResult>(`${this.base}/analyze-file`, formData);
  }
}