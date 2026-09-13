import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Teacher, CreateTeacherPayload } from '../models/teacher.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = `${environment.apiUrl}/admin/teachers`;

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.base);
  }

  createTeacher(payload: CreateTeacherPayload): Observable<Teacher> {
    return this.http.post<Teacher>(this.base, payload);
  }

  deleteTeacher(teacherId: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${teacherId}`);
  }
}