import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamMeService } from '../../../core/services/team-me.service';
import { PullRequestService } from '../../../core/services/pull-request.service';
import { PrReviewResult } from '../../../core/models/pull-request.model';
import { Severity } from '../../../core/models/ai-review.model';

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const SEVERITY_ICON: Record<Severity, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢',
};

@Component({
  selector: 'app-pr-review',
  templateUrl: './pr-review.component.html',
  styleUrls: ['./pr-review.component.scss'],
})
export class PrReviewComponent implements OnInit {
  mode: 'review' | 'history' = 'review';
  prNumber!: number;
  teamId: number | null = null;

  result: PrReviewResult | null = null;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamMe: TeamMeService,
    private prService: PullRequestService,
  ) {}

  ngOnInit(): void {
    this.prNumber = Number(this.route.snapshot.paramMap.get('prNumber'));
    this.mode = (this.route.snapshot.data['mode'] as 'review' | 'history') ?? 'review';

    this.teamMe.getMyTeam().subscribe({
      next: (team) => {
        this.teamId = team.team_id;
        this.loadResult();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Impossible de récupérer les informations d'équipe.";
      },
    });
  }

  loadResult(): void {
    if (!this.teamId) return;
    this.loading = true;
    this.errorMessage = null;

    // "review" = lance l'analyse LangChain (Review PR)
    // "history" = ne lance rien, lit la review déjà sauvegardée (View Review)
    const request$ =
      this.mode === 'review'
        ? this.prService.review(this.teamId, this.prNumber)
        : this.prService.getReviewHistory(this.teamId, this.prNumber);

    request$.subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage =
          this.mode === 'history'
            ? 'Aucune review sauvegardée pour cette PR.'
            : "Erreur lors de l'analyse de la Pull Request.";
      },
    });
  }

  severityLabel(s: Severity): string {
    return SEVERITY_LABEL[s];
  }

  severityIcon(s: Severity): string {
    return SEVERITY_ICON[s];
  }

  get allFindingsEmpty(): boolean {
    return !this.result || this.result.files.every((f) => f.findings.length === 0);
  }

  goBack(): void {
    this.router.navigateByUrl('/student/ai-code-review/pulls');
  }
}