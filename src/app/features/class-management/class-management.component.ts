import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassService } from '../../core/services/class.service';
import { SchoolClass } from '../../core/models/class.model';

type StatusFilter = 'all' | 'active' | 'archived';

@Component({
  selector: 'app-class-management',
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.scss'],
})
export class ClassManagementComponent implements OnInit {
  readonly filterOptions: StatusFilter[] = ['all', 'active', 'archived'];

  classes: SchoolClass[] = [];
  loading = true;
  errorMessage: string | null = null;

  search = '';
  filter: StatusFilter = 'all';

  showModal = false;
  isSaving = false;
  form = { name: '', course_code: '', year: '', max_students: 40 };

  constructor(
    private classService: ClassService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    this.classService.getAll().subscribe({
      next: (data) => {
        this.classes = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les classes.';
        this.loading = false;
      },
    });
  }

  get filtered(): SchoolClass[] {
    return this.classes.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(this.search.toLowerCase());
      const matchFilter = this.filter === 'all' || c.status === this.filter;
      return matchSearch && matchFilter;
    });
  }

  get activeCount(): number {
    return this.classes.filter((c) => c.status === 'active').length;
  }

  progressColor(progress = 0): string {
    if (progress >= 80) return '#16A34A';
    if (progress >= 50) return '#513BF6';
    return '#EA580C';
  }

  openClass(cls: SchoolClass): void {
    this.router.navigateByUrl(`/teacher/classes/${cls.id}`);
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.form = { name: '', course_code: '', year: '', max_students: 40 };
  }

  submitCreate(): void {
    if (!this.form.name.trim() || !this.form.course_code.trim()) return;

    this.isSaving = true;
    this.classService.create(this.form).subscribe({
      next: (created) => {
        this.classes = [created, ...this.classes];
        this.isSaving = false;
        this.closeModal();
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = "Erreur lors de la création de la classe.";
      },
    });
  }
}