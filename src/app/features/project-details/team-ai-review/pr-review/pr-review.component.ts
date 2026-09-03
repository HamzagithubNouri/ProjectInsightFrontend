import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherPullRequestService } from '../../../../core/services/teacher-pull-request.service';
import { PrReviewResult, PrFinding } from '../../../../core/models/pull-request.model';
import { Severity } from '../../../../core/models/ai-review.model';

const SEVERITY_ICON: Record<Severity, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢',
};

@Component({
  selector: 'app-teacher-pr-review',
  templateUrl: './pr-review.component.html',
  styleUrls: ['./pr-review.component.scss'],
})
export class TeacherPrReviewComponent implements OnInit {
  teamId!: number;
  prNumber!: number;

  result: PrReviewResult | null = null;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prService: TeacherPullRequestService,
  ) {}

  ngOnInit(): void {
    this.teamId = Number(this.route.snapshot.paramMap.get('teamId'));
    this.prNumber = Number(this.route.snapshot.paramMap.get('prNumber'));
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = null;
    this.prService.getReview(this.teamId, this.prNumber).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Aucune review sauvegardée pour cette PR.';
      },
    });
  }

  severityIcon(s: Severity): string {
    return SEVERITY_ICON[s];
  }

  get totalFindings(): number {
    if (!this.result) return 0;
    return this.result.critical_count + this.result.high_count + this.result.medium_count + this.result.low_count;
  }

  // Pie chart dynamique en pur CSS (conic-gradient), pas de librairie necessaire
  get pieGradient(): string {
    if (!this.result || this.totalFindings === 0) return '#E5E7EB';

    const segments = [
      { count: this.result.critical_count, color: '#DC2626' },
      { count: this.result.high_count, color: '#EA580C' },
      { count: this.result.medium_count, color: '#D97706' },
      { count: this.result.low_count, color: '#16A34A' },
    ];

    let cumulative = 0;
    const stops: string[] = [];
    for (const seg of segments) {
      if (seg.count === 0) continue;
      const start = (cumulative / this.totalFindings) * 360;
      cumulative += seg.count;
      const end = (cumulative / this.totalFindings) * 360;
      stops.push(`${seg.color} ${start}deg ${end}deg`);
    }
    return `conic-gradient(${stops.join(', ')})`;
  }

  get allFindings(): { filename: string; finding: PrFinding }[] {
    if (!this.result) return [];
    return this.result.files.flatMap((f) => f.findings.map((finding) => ({ filename: f.filename, finding })));
  }

  goBack(): void {
    this.router.navigateByUrl(`/teacher/projects/${this.teamId}/ai-review`);
  }
}