import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from '../models/page.model';

// Table de correspondance Page -> route Angular réelle.
// En React, `navigate(page)` changeait un state ; ici on navigue une vraie URL.
const PAGE_ROUTES: Record<Page, string> = {
  'student-dashboard': '/student/dashboard',
  'my-team': '/student/my-team',
  'connect-repo': '/student/connect-repo',
  'ai-code-review': '/student/ai-code-review',
  'analysis-history': '/student/analysis-history',
  notifications: '/student/notifications',
  'teacher-dashboard': '/teacher/dashboard',
  'class-management': '/teacher/classes',
  'class-detail': '/teacher/classes/detail',
  'project-details': '/teacher/projects',
  'teams-management': '/teacher/teams',
  'create-team': '/teacher/teams/create',
  students: '/teacher/students',
  analytics: '/teacher/analytics',
  'teacher-notifications': '/teacher/notifications',
  settings: '/teacher/settings',
  auth: '/auth',
};

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router) {}

  navigate(page: Page): void {
    this.router.navigateByUrl(PAGE_ROUTES[page]);
  }

  isActive(page: Page): boolean {
    return this.router.url.startsWith(PAGE_ROUTES[page]);
  }
}