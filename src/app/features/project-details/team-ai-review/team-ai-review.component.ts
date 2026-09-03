import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../../core/services/team.service';
import { TeacherPullRequestService } from '../../../core/services/teacher-pull-request.service';
import { TeacherPrSummary } from '../../../core/models/pull-request.model';

@Component({
  selector: 'app-team-ai-review',
  templateUrl: './team-ai-review.component.html',
  styleUrls: ['./team-ai-review.component.scss'],
})
export class TeamAiReviewComponent implements OnInit {
  teamId!: number;
  teamName = '';
  repoName = '';
  prs: TeacherPrSummary[] = [];

  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    private prService: TeacherPullRequestService,
  ) {}

  ngOnInit(): void {
    this.teamId = Number(this.route.snapshot.paramMap.get('teamId'));
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = null;

    this.teamService.getProjectDetails(this.teamId).subscribe({
      next: (details) => {
        this.teamName = details.team_name;
        this.repoName = details.repository
          ? details.repository.github_url.replace('https://github.com/', '').replace('http://github.com/', '')
          : '';
      },
    });

    this.prService.list(this.teamId).subscribe({
      next: (data) => {
        this.prs = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Impossible de charger les pull requests.';
      },
    });
  }

  formatDate(iso: string | null): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // "No Review" est desactive : le prof ne peut jamais declencher une analyse
  viewReview(pr: TeacherPrSummary): void {
    if (!pr.already_reviewed) return;
    this.router.navigateByUrl(`/teacher/projects/${this.teamId}/ai-review/prs/${pr.number}`);
  }

  goBack(): void {
    this.router.navigateByUrl(`/teacher/projects/${this.teamId}`);
  }
}