import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { Teacher } from '../../core/models/teacher.model';

@Component({
  selector: 'app-teacher-management',
  templateUrl: './teacher-management.component.html',
  styleUrls: ['./teacher-management.component.scss'],
})
export class TeacherManagementComponent implements OnInit {
  teachers: Teacher[] = [];
  loading = true;
  errorMessage: string | null = null;
  search = '';

  showModal = false;
  isSaving = false;
  showPassword = false;
  form = { first_name: '', last_name: '', email: '', password: '' };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.loading = true;
    this.adminService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les enseignants.';
        this.loading = false;
      },
    });
  }

  get filtered(): Teacher[] {
    const q = this.search.toLowerCase();
    return this.teachers.filter(
      (t) =>
        `${t.first_name} ${t.last_name}`.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q),
    );
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.form = { first_name: '', last_name: '', email: '', password: '' };
    this.showPassword = false;
  }

  submitCreate(): void {
    const { first_name, last_name, email, password } = this.form;
    if (!first_name.trim() || !last_name.trim() || !email.trim() || !password.trim()) return;

    this.isSaving = true;
    this.adminService.createTeacher(this.form).subscribe({
      next: (created) => {
        this.teachers = [created, ...this.teachers];
        this.isSaving = false;
        this.closeModal();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage =
          err?.status === 400 ? 'Cet email est déjà utilisé.' : "Erreur lors de la création.";
      },
    });
  }

  deleteTeacher(teacher: Teacher): void {
    if (!confirm(`Supprimer ${teacher.first_name} ${teacher.last_name} ?`)) return;

    this.adminService.deleteTeacher(teacher.id).subscribe({
      next: () => {
        this.teachers = this.teachers.filter((t) => t.id !== teacher.id);
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer cet enseignant.';
      },
    });
  }
}