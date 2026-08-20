import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Student, CreateStudentPayload } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private base = `${environment.apiUrl}/teacher/students`;

  constructor(private http: HttpClient) {}

  // ATTENTION: cette route GET n'existe pas encore côté FastAPI (a ajouter)
  getAll(classId?: number): Observable<Student[]> {
    const url = classId ? `${this.base}?class_id=${classId}` : this.base;
    return this.http.get<Student[]>(url);
  }

  create(payload: CreateStudentPayload): Observable<Student> {
    return this.http.post<Student>(this.base, payload);
  }
}