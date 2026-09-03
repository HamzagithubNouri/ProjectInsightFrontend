import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../../core/services/class.service';
import { ClassDetail, TeamSummary } from '../../core/models/class.model';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.scss'],
})
export class ClassDetailComponent implements OnInit {
  classId!: number;
  classDetail: ClassDetail | null = null;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classService: ClassService,
  ) {}

  ngOnInit(): void {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    this.loadDetail();
  }

  loadDetail(): void {
    this.loading = true;
    this.errorMessage = null;
    this.classService.getDetail(this.classId).subscribe({
      next: (data) => {
        this.classDetail = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Impossible de charger cette classe.';
      },
    });
  }

  openTeam(team: TeamSummary): void {
    this.router.navigateByUrl(`/teacher/projects/${team.id}`);
  }

  goBack(): void {
    this.router.navigateByUrl('/teacher/classes');
  }
}