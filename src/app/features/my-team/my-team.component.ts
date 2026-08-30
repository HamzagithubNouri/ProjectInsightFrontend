import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TeamMeService, MyTeam, TeamMemberInfo } from '../../core/services/team-me.service';
import { TeamContributionsService, MemberContribution } from '../../core/services/team-contributions.service';
import { TeamActivityService } from '../../core/services/team-activity.service';
import { GithubService } from '../../core/services/github.service';
import { AuthService } from '../../core/services/auth.service';
import { ActivityEvent } from '../../core/models/activity.model';

interface MemberRow extends TeamMemberInfo {
  commits: number;
  pull_requests: number;
  percentage: number;
}

const AVATAR_COLORS = ['#513BF6', '#16A34A', '#EA580C', '#7C5CFC', '#0891B2', '#DC2626', '#059669', '#D97706'];

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss'],
})
export class MyTeamComponent implements OnInit {
  team: MyTeam | null = null;
  members: MemberRow[] = [];
  totalCommits = 0;
  totalPullRequests = 0;
  activity: ActivityEvent[] = [];

  loading = true;
  errorMessage: string | null = null;

  constructor(
    private teamMe: TeamMeService,
    private contributionsService: TeamContributionsService,
    private activityService: TeamActivityService,
    private githubService: GithubService,
    public auth: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadAll();

    this.route.queryParams.subscribe((params) => {
      if (params['github'] === 'connected') {
        this.loadAll(true);
      }
    });
  }

  loadAll(forceRefresh = false): void {
    this.loading = true;
    this.errorMessage = null;

    const team$ = forceRefresh ? this.teamMe.refresh() : this.teamMe.getMyTeam();

    forkJoin({
      team: team$,
      contributions: this.contributionsService.getContributions(),
      activity: this.activityService.getActivity(8),
    }).subscribe({
      next: ({ team, contributions, activity }) => {
        this.team = team;
        this.totalCommits = contributions.total_commits;
        this.totalPullRequests = contributions.total_pull_requests;
        this.activity = activity;

        const byId = new Map<number, MemberContribution>(
          contributions.contributions.map((c) => [c.student_id, c]),
        );

        this.members = team.members
          .map((m) => {
            const c = byId.get(m.id);
            return {
              ...m,
              commits: c?.commits ?? 0,
              pull_requests: c?.pull_requests ?? 0,
              percentage: c?.percentage ?? 0,
            };
          })
          .sort((a, b) => (b.is_leader ? 1 : 0) - (a.is_leader ? 1 : 0) || b.commits - a.commits);

        this.loading = false;
      },
      error: (err) => {
        this.team = null;
        this.loading = false;
        this.errorMessage =
          err?.status === 404
            ? "Tu n'es assigné à aucune équipe pour le moment. Contacte ton enseignant."
            : 'Impossible de charger les informations de ton équipe.';
      },
    });
  }

  isSelf(member: TeamMemberInfo): boolean {
    return this.auth.currentUser?.id === member.id;
  }

  linkGithub(): void {
    this.githubService.connect();
  }

  get hasAiScore(): boolean {
    return false;
  }

  // --- Activity Timeline helpers ---
  avatarColor(initials: string): string {
    const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
    return AVATAR_COLORS[code % AVATAR_COLORS.length];
  }

  timeAgo(dateStr: string): string {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "à l'instant";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD}d ago`;
  }
}