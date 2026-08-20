import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubService, GithubRepo, GithubBranch } from '../../core/services/github.service';
import { RepositoryService, TeamRepository } from '../../core/services/repository.service';
import { TeamMeService } from '../../core/services/team-me.service';

@Component({
  selector: 'app-connect-repo',
  templateUrl: './connect-repo.component.html',
  styleUrls: ['./connect-repo.component.scss'],
})
export class ConnectRepoComponent implements OnInit {
  loading = true;
  teamId: number | null = null;

  // State 2 : repo déjà connecté pour l'équipe
  existingRepo: TeamRepository | null = null;
  isSyncing = false;

  // State 1 : flux de connexion
  githubConnected = false;
  githubUsername: string | null = null;
  repos: GithubRepo[] = [];
  branches: GithubBranch[] = [];
  selectedRepo: GithubRepo | null = null;
  selectedBranch = '';
  manualUrl = '';
  isConnecting = false;
  errorMessage: string | null = null;

  // Passe en mode "changer de repo" même si un existingRepo est déjà là
  editing = false;

  constructor(
    private githubService: GithubService,
    private repositoryService: RepositoryService,
    private teamMe: TeamMeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.teamMe.getMyTeam().subscribe({
      next: (team) => {
        // Sécurité front : un membre normal ne devrait jamais atterrir ici
        // (le lien de nav est déjà masqué), le backend reste la vraie barrière.
        if (team.my_team_role !== 'LEADER') {
          this.router.navigateByUrl('/student/my-team');
          return;
        }
        this.teamId = team.team_id;
        this.loadExistingRepo();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Impossible de récupérer les informations d'équipe.";
      },
    });

    // Retour du callback OAuth GitHub (?github=connected)
    this.route.queryParams.subscribe((params) => {
      if (params['github'] === 'connected') {
        this.refreshGithubStatus();
      }
    });
  }

  loadExistingRepo(): void {
    if (!this.teamId) return;
    this.repositoryService.getTeamRepository(this.teamId).subscribe({
      next: (repo) => {
        this.existingRepo = repo;
        this.loading = false;
      },
      error: () => {
        // 404 = pas encore connecté, c'est normal -> State 1
        this.existingRepo = null;
        this.loading = false;
        this.refreshGithubStatus();
      },
    });
  }

  refreshGithubStatus(): void {
    this.githubService.getStatus().subscribe((status) => {
      this.githubConnected = status.connected;
      this.githubUsername = status.github_username;
      if (this.githubConnected) {
        this.loadRepos();
      }
    });
  }

  connectGithub(): void {
    this.githubService.connect(); // quitte Angular, redirige vers github.com
  }

  disconnectGithub(): void {
    this.githubService.disconnect().subscribe(() => {
      this.githubConnected = false;
      this.githubUsername = null;
      this.repos = [];
      this.selectedRepo = null;
      this.branches = [];
    });
  }

  loadRepos(): void {
    this.githubService.listRepos().subscribe((repos) => (this.repos = repos));
  }

  selectRepo(repo: GithubRepo): void {
    this.selectedRepo = repo;
    this.manualUrl = '';
    this.selectedBranch = repo.default_branch;
    const [owner, repoName] = repo.full_name.split('/');
    this.githubService.listBranches(owner, repoName).subscribe((branches) => (this.branches = branches));
  }

  selectBranch(name: string): void {
    this.selectedBranch = name;
  }

  get canConnect(): boolean {
    return !!(this.selectedRepo || this.manualUrl.trim()) && !!this.selectedBranch;
  }

  startEditing(): void {
    this.editing = true;
    this.refreshGithubStatus();
  }

  confirmConnection(): void {
    if (!this.teamId || !this.canConnect) return;

    const githubUrl = this.selectedRepo
      ? `https://github.com/${this.selectedRepo.full_name}`
      : this.manualUrl.trim();

    this.isConnecting = true;
    this.repositoryService
      .connectTeamRepository(this.teamId, {
        github_url: githubUrl,
        branch: this.selectedBranch,
        github_username: this.githubUsername,
      })
      .subscribe({
        next: (repo) => {
          this.existingRepo = repo;
          this.editing = false;
          this.isConnecting = false;
        },
        error: () => {
          this.isConnecting = false;
          this.errorMessage = 'Impossible de connecter ce repository.';
        },
      });
  }

  syncNow(): void {
    // Ré-utilise la même route de connexion pour resynchroniser avec les mêmes valeurs
    if (!this.teamId || !this.existingRepo) return;
    this.isSyncing = true;
    this.repositoryService
      .connectTeamRepository(this.teamId, {
        github_url: this.existingRepo.github_url,
        branch: this.existingRepo.branch,
        github_username: this.existingRepo.github_username ?? this.githubUsername,
      })
      .subscribe({
        next: (repo) => {
          this.existingRepo = repo;
          this.isSyncing = false;
        },
        error: () => {
          this.isSyncing = false;
          this.errorMessage = 'Échec de la synchronisation.';
        },
      });
  }
}