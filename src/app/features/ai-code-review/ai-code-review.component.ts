import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AiReviewService } from '../../core/services/ai-review.service';
import { AiReviewResult, Severity } from '../../core/models/ai-review.model';
import { TeamMeService, TeamRepositoryInfo } from '../../core/services/team-me.service';

type Tab = 'paste' | 'upload' | 'repository';

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

@Component({
  selector: 'app-ai-code-review',
  templateUrl: './ai-code-review.component.html',
  styleUrls: ['./ai-code-review.component.scss'],
})
export class AiCodeReviewComponent implements OnInit {
  activeTab: Tab = 'paste';

  // Mode "Paste Code"
  code = '';
  filename = 'untitled.py';

  // Mode "Upload File"
  selectedFile: File | null = null;

  loading = false;
  errorMessage: string | null = null;
  result: AiReviewResult | null = null;
  expandedIndex = 0;

  // Mode "My Repository"
  teamId: number | null = null;
  repository: TeamRepositoryInfo | null = null;
  teamLoading = true;
  teamErrorMessage: string | null = null;

  constructor(
    private aiReviewService: AiReviewService,
    private teamMe: TeamMeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // TeamMeService met en cache la réponse (shareReplay) : appel peu coûteux
    // même si on ne va jamais sur l'onglet "My Repository".
    this.loadTeamRepository();
  }

  loadTeamRepository(): void {
    this.teamLoading = true;
    this.teamErrorMessage = null;
    this.teamMe.getMyTeam().subscribe({
      next: (team) => {
        this.teamId = team.team_id;
        this.repository = team.repository;
        this.teamLoading = false;
      },
      error: () => {
        this.teamLoading = false;
        this.teamErrorMessage = "Impossible de récupérer les informations d'équipe.";
      },
    });
  }

  get repoNameOnly(): string {
    if (!this.repository) return '';
    return this.repository.github_url
      .replace('https://github.com/', '')
      .replace('http://github.com/', '');
  }

  setTab(tab: Tab): void {
    this.activeTab = tab;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;
    if (file) this.filename = file.name;
  }

  get canRun(): boolean {
    return this.activeTab === 'paste' ? this.code.trim().length > 0 : !!this.selectedFile;
  }

  runReview(): void {
    if (!this.canRun) return;

    this.loading = true;
    this.errorMessage = null;
    this.result = null;

    const request$ =
      this.activeTab === 'paste'
        ? this.aiReviewService.analyzeCode(this.code, this.filename)
        : this.aiReviewService.analyzeFile(this.selectedFile!);

    request$.subscribe({
      next: (res) => {
        this.result = res;
        this.expandedIndex = 0;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.status === 503
            ? "Le service d'analyse IA est indisponible (Ollama non démarré)."
            : "Erreur lors de l'analyse du code.";
      },
    });
  }

  toggleFinding(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }

  severityLabel(s: Severity): string {
    return SEVERITY_LABEL[s];
  }

  copyFix(fix: string): void {
    navigator.clipboard?.writeText(fix);
  }

  applyFix(index: number): void {
    if (!this.result) return;
    const finding = this.result.findings[index];
    if (!finding.suggested_fix || this.activeTab !== 'paste') return;

    const lines = this.code.split('\n');
    const start = Math.max(0, finding.line_start - 1);
    const end = Math.min(lines.length, finding.line_end);
    lines.splice(start, end - start, finding.suggested_fix);
    this.code = lines.join('\n');
  }

  // --- Navigation vers la liste des Pull Requests ---
  openPullRequests(): void {
    this.router.navigateByUrl('/student/ai-code-review/pulls');
  }

  goToConnectRepo(): void {
    this.router.navigateByUrl('/student/connect-repo');
  }
}