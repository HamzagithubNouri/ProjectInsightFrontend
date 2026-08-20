import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TeamMeService } from './team-me.service';

export type UserRole = 'admin' | 'teacher' | 'student';

// Correspond exactement à la réponse de GET /auth/me
export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  school_class_id: number | null;
  created_at: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

const TOKEN_KEY = 'pi_access_token';
const USER_KEY = 'pi_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(
    this.readStoredUser(),
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private teamMe: TeamMeService,
  ) {}

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  // Nom complet + initiales pratiques pour le header (dérivés, pas renvoyés par l'API)
  get fullName(): string {
    const u = this.currentUser;
    return u ? `${u.first_name} ${u.last_name}` : '';
  }

  get initials(): string {
    const u = this.currentUser;
    return u ? `${u.first_name[0]}${u.last_name[0]}`.toUpperCase() : '';
  }

  /**
   * POST /auth/login attend un formulaire OAuth2 standard
   * (application/x-www-form-urlencoded, champ "username" = email).
   * Puis on enchaîne avec GET /auth/me pour récupérer le profil complet.
   */
  login(email: string, password: string): Observable<AuthUser> {
    this.teamMe.clearCache(); // évite de réutiliser les données d'équipe d'un compte précédent
    const body = new HttpParams()
      .set('username', email)
      .set('password', password);

    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/auth/login`, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(
        tap((res) => localStorage.setItem(TOKEN_KEY, res.access_token)),
        switchMap(() => this.fetchCurrentUser()),
      );
  }

  fetchCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${environment.apiUrl}/auth/me`).pipe(
      tap((user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
    this.teamMe.clearCache(); // sinon le prochain compte connecté hérite de cette équipe en cache
    this.router.navigateByUrl('/auth');
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}