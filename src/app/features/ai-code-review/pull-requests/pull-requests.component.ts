import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamMeService, TeamRepositoryInfo } from '../../../core/services/team-me.service';
import { PullRequestService } from '../../../core/services/pull-request.service';
import { PullRequestSummary } from '../../../core/models/pull-request.model';

@Component({
  selector: 'app-pull-requests',
  templateUrl: './pull-requests.component.html',
  styleUrls: ['./pull-requests.component.scss'],
})
export class PullRequestsComponent implements OnInit {
  teamId: number | null = null;
  repository: TeamRepositoryInfo | null = null;
  pullRequests: PullRequestSummary[] = [];

  loading = true;
  errorMessage: string | null = null;

  constructor(
    private teamMe: TeamMeService,
    private prService: PullRequestService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.teamMe.getMyTeam().subscribe({
      next: (team) => {
        this.teamId = team.team_id;
        this.repository = team.repository;
        this.loadPullRequests();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Impossible de récupérer les informations d'équipe.";
      },
    });
  }

  loadPullRequests(): void {
    if (!this.teamId) return;
    this.loading = true;
    this.prService.list(this.teamId).subscribe({
      next: (data) => {
        this.pullRequests = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Impossible de charger les pull requests.';
      },
    });
  }

  get repoNameOnly(): string {
    if (!this.repository) return '';
    return this.repository.github_url
      .replace('https://github.com/', '')
      .replace('http://github.com/', '');
  }

  stateLabel(pr: PullRequestSummary): string {
    if (pr.state === 'merged') return 'Merged';
    if (pr.state === 'closed') return 'Closed';
    return 'Open';
  }

  // Lance une nouvelle analyse LangChain
  reviewPr(pr: PullRequestSummary): void {
    this.router.navigate(['/student/ai-code-review/pulls', pr.number, 'review']);
  }

  // Affiche la review déjà sauvegardée, sans rien relancer
  viewReview(pr: PullRequestSummary): void {
    this.router.navigate(['/student/ai-code-review/pulls', pr.number, 'history']);
  }

  goBack(): void {
    this.router.navigateByUrl('/student/ai-code-review');
  }
}