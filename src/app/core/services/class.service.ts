import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClassSummary, ClassDetail, CreateClassPayload } from '../models/class.model';

@Injectable({ providedIn: 'root' })
export class ClassService {
  private base = `${environment.apiUrl}/teacher/classes`;

  constructor(private http: HttpClient) {}

  // GET /teacher/classes -> ClassSummaryOut[]
  getAll(): Observable<ClassSummary[]> {
    return this.http.get<ClassSummary[]>(this.base);
  }

  // GET /teacher/classes/{class_id} -> ClassDetailOut
  getDetail(classId: number): Observable<ClassDetail> {
    return this.http.get<ClassDetail>(`${this.base}/${classId}`);
  }

  // POST /teacher/classes renvoie ClassOut (forme différente de ClassSummary),
  // on ne l'exploite pas directement : on recharge la liste après création.
  create(payload: CreateClassPayload): Observable<unknown> {
    return this.http.post(this.base, payload);
  }
}