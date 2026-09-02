import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { TeamMeService, MyTeam } from '../../core/services/team-me.service';
import { TeamContributionsService } from '../../core/services/team-contributions.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ActivityDay, RecentFinding, FindingSeverity } from '../../core/models/dashboard.model';

const SEVERITY_COLOR: Record<FindingSeverity, string> = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#D97706',
  low: '#16A34A',
};

const SEVERITY_LABEL: Record<FindingSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent implements OnInit {
  loading = true;
  errorMessage: string | null = null;

  team: MyTeam | null = null;
  repoName: string | null = null;

  myCommits = 0;
  myPullRequests = 0;
  myContribution = 0;

  activity: ActivityDay[] = [];
  findings: RecentFinding[] = [];

  constructor(
    public auth: AuthService,
    private teamMe: TeamMeService,
    private contributionsService: TeamContributionsService,
    private dashboardService: DashboardService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.errorMessage = null;

    forkJoin({
      team: this.teamMe.getMyTeam(),
      contributions: this.contributionsService.getContributions(),
      activity: this.dashboardService.getWeeklyActivity(),
      findings: this.dashboardService.getRecentFindings(3),
    }).subscribe({
      next: ({ team, contributions, activity, findings }) => {
        this.team = team;
        this.repoName = team.repository ? this.extractRepoName(team.repository.github_url) : null;

        const mine = contributions.contributions.find(
          (c) => c.student_id === this.auth.currentUser?.id,
        );
        this.myCommits = mine?.commits ?? 0;
        this.myPullRequests = mine?.pull_requests ?? 0;
        this.myContribution = mine?.percentage ?? 0;

        this.activity = activity;
        this.findings = findings;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.status === 404
            ? "Tu n'es assigné à aucune équipe pour le moment."
            : 'Impossible de charger le tableau de bord.';
      },
    });
  }

  private extractRepoName(url: string): string {
    const parts = url.replace(/\/$/, '').split('/');
    return parts[parts.length - 1];
  }

  // --- Chart (SVG, sans librairie) ---
  get maxCommits(): number {
    return Math.max(4, ...this.activity.map((a) => a.commits));
  }

  get totalCommitsThisWeek(): number {
    return this.activity.reduce((sum, a) => sum + a.commits, 0);
  }

  pointX(index: number): number {
    const step = 640 / Math.max(1, this.activity.length - 1);
    return 20 + index * step;
  }

  pointY(commits: number): number {
    const top = 20;
    const bottom = 150;
    const ratio = commits / this.maxCommits;
    return bottom - ratio * (bottom - top);
  }

  get polylinePoints(): string {
    return this.activity.map((a, i) => `${this.pointX(i)},${this.pointY(a.commits)}`).join(' ');
  }

  severityColor(severity: FindingSeverity): string {
    return SEVERITY_COLOR[severity];
  }

  severityLabel(severity: FindingSeverity): string {
    return SEVERITY_LABEL[severity];
  }

  goToAiReview(): void {
    this.router.navigateByUrl('/student/ai-code-review');
  }
}