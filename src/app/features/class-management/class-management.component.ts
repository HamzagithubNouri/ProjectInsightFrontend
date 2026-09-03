import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassService } from '../../core/services/class.service';
import { ClassSummary } from '../../core/models/class.model';

@Component({
  selector: 'app-class-management',
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.scss'],
})
export class ClassManagementComponent implements OnInit {
  classes: ClassSummary[] = [];
  loading = true;
  errorMessage: string | null = null;

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

  openClass(cls: ClassSummary): void {
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
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadClasses(); // recharge pour recuperer les compteurs a jour
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Erreur lors de la création de la classe.';
      },
    });
  }
}