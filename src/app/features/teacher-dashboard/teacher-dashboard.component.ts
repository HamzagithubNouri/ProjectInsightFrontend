import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ClassService } from '../../core/services/class.service';
import { ClassSummary } from '../../core/models/class.model';

// Palette cyclique : fonctionne pour n'importe quel nombre de classes
const PIE_COLORS = ['#513BF6', '#16A34A', '#EA580C', '#0891B2', '#DC2626', '#D97706', '#7C5CFC', '#059669'];

interface ClassPieSlice {
  name: string;
  team_count: number;
  color: string;
  percentage: number;
}

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

  // --- Pie chart "Répartition des équipes par classe" ---

  get pieSlices(): ClassPieSlice[] {
    const total = this.totalTeams;
    return this.classes.map((c, i) => ({
      name: c.name,
      team_count: c.team_count,
      color: PIE_COLORS[i % PIE_COLORS.length],
      percentage: total > 0 ? Math.round((c.team_count / total) * 100) : 0,
    }));
  }

  // Pie chart dynamique en pur CSS (conic-gradient), pas de librairie necessaire
  get pieGradient(): string {
    const total = this.totalTeams;
    if (total === 0) return '#E5E7EB';

    let cumulative = 0;
    const stops: string[] = [];
    for (const slice of this.pieSlices) {
      if (slice.team_count === 0) continue;
      const start = (cumulative / total) * 360;
      cumulative += slice.team_count;
      const end = (cumulative / total) * 360;
      stops.push(`${slice.color} ${start}deg ${end}deg`);
    }
    return `conic-gradient(${stops.join(', ')})`;
  }

  openClass(cls: ClassSummary): void {
    this.router.navigateByUrl(`/teacher/classes/${cls.id}`);
  }

  goToClasses(): void {
    this.router.navigateByUrl('/teacher/classes');
  }
}