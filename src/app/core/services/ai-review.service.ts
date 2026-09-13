import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiReviewResult, AutoFixResult } from '../models/ai-review.model';

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

  // POST /ai-review/fix : regenere le fichier ENTIER corrige, avec le
  // garde-fou ast.parse() deja en place cote backend (Python uniquement).
  // C'est la source de verite pour "Apply Fix", jamais suggested_fix.
  generateFix(code: string, filename: string): Observable<AutoFixResult> {
    return this.http.post<AutoFixResult>(`${this.base}/fix`, { code, filename });
  }
}