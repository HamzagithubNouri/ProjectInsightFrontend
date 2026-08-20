import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SchoolClass, CreateClassPayload } from '../models/class.model';

@Injectable({ providedIn: 'root' })
export class ClassService {
  private base = `${environment.apiUrl}/teacher/classes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SchoolClass[]> {
    return this.http.get<SchoolClass[]>(this.base);
  }

  create(payload: CreateClassPayload): Observable<SchoolClass> {
    return this.http.post<SchoolClass>(this.base, payload);
  }
}