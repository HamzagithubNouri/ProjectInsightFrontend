import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { AuthService } from '../../core/services/auth.service';
import { TeamMeService } from '../../core/services/team-me.service';
import { NavItem, Page } from '../../core/models/page.model';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', page: 'student-dashboard', route: '/student/dashboard' },
  { label: 'My Team', page: 'my-team', route: '/student/my-team' },
  { label: 'Repository', page: 'connect-repo', route: '/student/connect-repo' },
  { label: 'AI Review', page: 'ai-code-review', route: '/student/ai-code-review' },
  { label: 'Reports', page: 'analysis-history', route: '/student/analysis-history' },
  { label: 'Notifications', page: 'notifications', route: '/student/notifications' },
];

@Component({
  selector: 'app-student-layout',
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.scss'],
})
export class StudentLayoutComponent implements OnInit {
  isMenuOpen = false;
  isLeader = false;

  constructor(
    private nav: NavigationService,
    public auth: AuthService,
    private team: TeamMeService,
    private elRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.team.getMyTeam().subscribe({
      next: (myTeam) => (this.isLeader = myTeam.my_team_role === 'LEADER'),
      error: () => (this.isLeader = false), // pas d'équipe assignée -> pas de gestion repo
    });
  }

  // "Repository" n'apparaît que pour le Team Leader (cf. cahier des charges)
  get navItems(): NavItem[] {
    return this.isLeader ? NAV_ITEMS : NAV_ITEMS.filter((i) => i.page !== 'connect-repo');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isMenuOpen && !this.elRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  goTo(page: Page): void {
    this.nav.navigate(page);
  }

  isActive(page: Page): boolean {
    return this.nav.isActive(page);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.auth.logout(); // supprime le token + redirige vers /auth
  }

  get currentUser() {
    return this.auth.currentUser;
  }
}