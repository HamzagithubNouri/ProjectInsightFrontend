import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TeamMeService, MyTeam, TeamMemberInfo } from '../../core/services/team-me.service';
import { TeamContributionsService, MemberContribution } from '../../core/services/team-contributions.service';
import { GithubService } from '../../core/services/github.service';
import { AuthService } from '../../core/services/auth.service';

interface MemberRow extends TeamMemberInfo {
  commits: number;
  pull_requests: number;
  percentage: number;
}

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

  loading = true;
  errorMessage: string | null = null;

  constructor(
    private teamMe: TeamMeService,
    private contributionsService: TeamContributionsService,
    private githubService: GithubService,
    public auth: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadAll();

    // Retour du callback OAuth GitHub -> rafraichit pour voir son propre statut a jour
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
    }).subscribe({
      next: ({ team, contributions }) => {
        this.team = team;
        this.totalCommits = contributions.total_commits;
        this.totalPullRequests = contributions.total_pull_requests;

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
          // Leader en premier, puis par nombre de commits desc
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

  // Un etudiant ne peut lier QUE son propre compte GitHub, jamais celui d'un coequipier
  isSelf(member: TeamMemberInfo): boolean {
    return this.auth.currentUser?.id === member.id;
  }

  linkGithub(): void {
    this.githubService.connect();
  }

  get hasAiScore(): boolean {
    return false; // pas encore de route backend pour un vrai AI Score
  }
}