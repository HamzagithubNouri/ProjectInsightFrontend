import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TeamService, TeamProjectDetails } from '../../core/services/team.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  teamId!: number;
  details: TeamProjectDetails | null = null;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private teamService: TeamService,
  ) {}

  ngOnInit(): void {
    this.teamId = Number(this.route.snapshot.paramMap.get('teamId'));
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = null;
    this.teamService.getProjectDetails(this.teamId).subscribe({
      next: (data) => {
        this.details = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Impossible de charger ce projet.';
      },
    });
  }

  get leader() {
    return this.details?.members.find((m) => m.is_leader) ?? null;
  }

  get otherMembers() {
    return this.details?.members.filter((m) => !m.is_leader) ?? [];
  }

  get repoNameOnly(): string {
    if (!this.details?.repository) return '';
    return this.details.repository.github_url
      .replace('https://github.com/', '')
      .replace('http://github.com/', '');
  }

  openAiReview(): void {
    this.router.navigateByUrl(`/teacher/projects/${this.teamId}/ai-review`);
  }

  // Vient de la page Class Detail : Location.back() y ramene naturellement
  goBack(): void {
    this.location.back();
  }
}