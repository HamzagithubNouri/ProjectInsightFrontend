import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface TeacherNavItem {
  icon: string; // nom lucide
  label: string;
  route: string;
}

const NAV_ITEMS: TeacherNavItem[] = [
  { icon: 'layout-dashboard', label: 'Dashboard', route: '/teacher/dashboard' },
  { icon: 'book-open', label: 'Classes', route: '/teacher/classes' },
  { icon: 'folder-open', label: 'Projects', route: '/teacher/projects' },
  { icon: 'users', label: 'Teams', route: '/teacher/teams' },
  { icon: 'graduation-cap', label: 'Students', route: '/teacher/students' },
  { icon: 'bot', label: 'AI Reviews', route: '/teacher/ai-reviews' },
  { icon: 'shield-check', label: 'Code Quality', route: '/teacher/code-quality' },
  { icon: 'bar-chart-3', label: 'Analytics', route: '/teacher/analytics' },
  { icon: 'file-text', label: 'Reports', route: '/teacher/reports' },
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

  // Le breadcrumb en React venait d'une prop passée par chaque page.
  // Ici le layout est un shell avec <router-outlet>, donc on le déduit
  // simplement du nav actif : ['Dashboard', 'Classes'] par ex.
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