import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const raw = route.data['role'] as UserRole | UserRole[] | undefined;
    const allowedRoles = Array.isArray(raw) ? raw : raw ? [raw] : [];

    if (allowedRoles.length === 0) {
      return true; // pas de contrainte de rôle sur cette route
    }

    if (allowedRoles.some((r) => this.auth.hasRole(r))) {
      return true;
    }

    // Connecté mais mauvais rôle -> renvoie vers son propre espace au lieu du login
    const fallback = this.auth.currentUser?.role === 'student' ? '/student' : '/teacher';
    return this.router.parseUrl(fallback);
  }
}