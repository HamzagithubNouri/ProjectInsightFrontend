import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface TeacherNavItem {
  icon: string;
  label: string;
  route: string;
}

// Reduit aux items reellement fonctionnels dans ce workflow
// (AI Reviews / Code Quality / Analytics / Reports retires : pas encore implementes)
const NAV_ITEMS: TeacherNavItem[] = [
  { icon: 'layout-dashboard', label: 'Dashboard', route: '/teacher/dashboard' },
  { icon: 'users', label: 'Teams', route: '/teacher/teams' },
  { icon: 'book-open', label: 'Classes', route: '/teacher/classes' },
  { icon: 'folder-open', label: 'Projects', route: '/teacher/projects' },
  { icon: 'graduation-cap', label: 'Students', route: '/teacher/students' },
  { icon: 'bell', label: 'Notifications', route: '/teacher/notifications' },
  { icon: 'settings', label: 'Settings', route: '/teacher/settings' },
];

@Component({
  selector: 'app-teacher-layout',
  templateUrl: './teacher-layout.component.html',
  styleUrls: ['./teacher-layout.component.scss'],
})
export class TeacherLayoutComponent {
  readonly navItems = NAV_ITEMS;
  collapsed = false;
  search = '';

  constructor(
    private router: Router,
    public auth: AuthService,
  ) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  get breadcrumb(): string[] {
    const active = this.navItems.find((i) => this.isActive(i.route));
    return active && active.label !== 'Dashboard' ? ['Dashboard', active.label] : ['Dashboard'];
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  goTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  logout(): void {
    this.auth.logout();
  }
}