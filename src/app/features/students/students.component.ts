import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../core/services/student.service';
import { ClassService } from '../../core/services/class.service';
import { Student } from '../../core/models/student.model';
import { ClassSummary } from '../../core/models/class.model';

const AVATAR_COLORS = ['#513BF6', '#16A34A', '#EA580C', '#7C5CFC', '#0891B2', '#DC2626', '#059669', '#D97706'];

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  classes: ClassSummary[] = [];
  loading = true;
  errorMessage: string | null = null;

  search = '';
  classFilter = 'all';

  showModal = false;
  isSaving = false;
  form = { first_name: '', last_name: '', email: '', password: '', class_id: null as number | null };

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.classService.getAll().subscribe((data) => {
      this.classes = data;
      if (data.length) this.form.class_id = data[0].id;
    });
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les étudiants.';
        this.loading = false;
      },
    });
  }

  get filtered(): Student[] {
    return this.students.filter((s) => {
      const name = `${s.first_name} ${s.last_name}`.toLowerCase();
      const q = this.search.toLowerCase();
      const matchSearch = name.includes(q) || s.email.toLowerCase().includes(q);
      const matchClass = this.classFilter === 'all' || s.class_name === this.classFilter;
      return matchSearch && matchClass;
    });
  }

  get inactiveCount(): number {
    return this.students.filter((s) => s.status === 'inactive').length;
  }

  avatarColor(index: number): string {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  }

  scoreColor(score = 0): string {
    if (score >= 80) return '#16A34A';
    if (score >= 60) return '#513BF6';
    return '#DC2626';
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.form = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      class_id: this.classes[0]?.id ?? null,
    };
  }

  submitAdd(): void {
    if (!this.form.first_name.trim() || !this.form.last_name.trim() || !this.form.email.trim() || !this.form.password.trim()) return;
    if (!this.form.class_id) return;

    this.isSaving = true;
    this.studentService
      .create({
        first_name: this.form.first_name,
        last_name: this.form.last_name,
        email: this.form.email,
        password: this.form.password,
        class_id: this.form.class_id,
      })
      .subscribe({
        next: (created) => {
          this.students = [created, ...this.students];
          this.isSaving = false;
          this.closeModal();
        },
        error: () => {
          this.isSaving = false;
          this.errorMessage = "Erreur lors de l'ajout de l'étudiant.";
        },
      });
  }
}