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

  code = '';
  filename = 'untitled.py';
  selectedFile: File | null = null;

  loading = false;
  errorMessage: string | null = null;
  result: AiReviewResult | null = null;
  expandedIndex = 0;

  // --- Apply Fix : etat par finding, cle = index du finding ---
  applyingFixIndex: number | null = null;
  applyFixError: string | null = null;
  applyFixSuccessIndex: number | null = null;

  // My Repository
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
    this.loadTeamRepository();
  }

  loadTeamRepository(): void {
    this.teamLoading = true;
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
    this.applyFixError = null;
    this.applyFixSuccessIndex = null;

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

  // --- Apply Fix : appelle POST /ai-review/fix et remplace TOUT l'editeur
  // par le corrected_code retourne. Ne touche plus jamais a suggested_fix,
  // qui reste affiche comme texte informatif uniquement. ---
  applyFix(index: number): void {
    if (this.activeTab !== 'paste' || !this.code.trim()) return;

    this.applyingFixIndex = index;
    this.applyFixError = null;
    this.applyFixSuccessIndex = null;

    this.aiReviewService.generateFix(this.code, this.filename).subscribe({
      next: (res) => {
        this.code = res.corrected_code;
        this.applyingFixIndex = null;
        this.applyFixSuccessIndex = index;

        // Le fix regenere TOUT le fichier : les anciens findings ne
        // correspondent plus forcement au nouveau code, on les efface
        // pour eviter d'afficher des lignes obsoletes.
        this.result = null;
        this.expandedIndex = 0;
      },
      error: (err) => {
        this.applyingFixIndex = null;
        this.applyFixError =
          err?.status === 503
            ? "Le service d'analyse IA est indisponible."
            : 'Impossible de générer une version corrigée.';
      },
    });
  }

  // --- My Repository ---
  openPullRequests(): void {
    this.router.navigateByUrl('/student/ai-code-review/pulls');
  }

  goToConnectRepo(): void {
    this.router.navigateByUrl('/student/connect-repo');
  }
}