import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ClassService } from '../../core/services/class.service';
import { ClassSummary } from '../../core/models/class.model';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
})
export class TeacherDashboardComponent implements OnInit {
  classes: ClassSummary[] = [];
  loading = true;

  constructor(
    public auth: AuthService,
    private classService: ClassService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.classService.getAll().subscribe({
      next: (data) => {
        this.classes = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  get totalStudents(): number {
    return this.classes.reduce((sum, c) => sum + c.student_count, 0);
  }

  get totalTeams(): number {
    return this.classes.reduce((sum, c) => sum + c.team_count, 0);
  }

  openClass(cls: ClassSummary): void {
    this.router.navigateByUrl(`/teacher/classes/${cls.id}`);
  }

  goToClasses(): void {
    this.router.navigateByUrl('/teacher/classes');
  }
}