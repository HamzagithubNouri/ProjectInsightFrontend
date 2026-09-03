import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService } from '../../core/services/team.service';
import { ClassService } from '../../core/services/class.service';
import { StudentService } from '../../core/services/student.service';
import { Team } from '../../core/models/team.model';
import { ClassSummary } from '../../core/models/class.model';
import { Student } from '../../core/models/student.model';

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  excellent: { bg: '#F0FDF4', color: '#16A34A', label: 'Excellent' },
  good: { bg: '#EEF2FF', color: '#513BF6', label: 'Good' },
  average: { bg: '#FFF7ED', color: '#EA580C', label: 'Average' },
  'at-risk': { bg: '#FEF2F2', color: '#DC2626', label: 'At Risk' },
};

@Component({
  selector: 'app-teams-management',
  templateUrl: './teams-management.component.html',
  styleUrls: ['./teams-management.component.scss'],
})
export class TeamsManagementComponent implements OnInit {
  teams: Team[] = [];
  classes: ClassSummary[] = [];
  loading = true;
  errorMessage: string | null = null;

  search = '';
  classFilter = 'all';

  showModal = false;
  isSaving = false;
  newTeamName = '';
  newTeamClassId: number | null = null;
  newTeamMembers: number[] = [];
  newTeamLeaderId: number | null = null;
  availableStudents: Student[] = [];

  constructor(
    private teamService: TeamService,
    private classService: ClassService,
    private studentService: StudentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    this.classService.getAll().subscribe((data) => (this.classes = data));
  }

  loadTeams(): void {
    this.loading = true;
    this.teamService.getAll().subscribe({
      next: (data) => {
        this.teams = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les équipes.';
        this.loading = false;
      },
    });
  }

  get filtered(): Team[] {
    return this.teams.filter((t) => {
      const q = this.search.toLowerCase();
      const matchSearch =
        t.name.toLowerCase().includes(q) || (t.leader_name ?? '').toLowerCase().includes(q);
      const matchClass = this.classFilter === 'all' || t.class_name === this.classFilter;
      return matchSearch && matchClass;
    });
  }

  statusStyle(status?: string) {
    return STATUS_STYLE[status ?? 'good'];
  }

  scoreColor(score = 0): string {
    if (score >= 80) return '#16A34A';
    if (score >= 60) return '#513BF6';
    if (score >= 45) return '#EA580C';
    return '#DC2626';
  }

  openTeam(): void {
    this.router.navigateByUrl('/teacher/projects');
  }

  openModal(): void {
    this.showModal = true;
    if (this.classes.length) {
      this.onClassChange(this.classes[0].id);
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.newTeamName = '';
    this.newTeamMembers = [];
    this.newTeamLeaderId = null;
  }

  onClassChange(classId: number): void {
    this.newTeamClassId = classId;
    this.newTeamMembers = [];
    this.newTeamLeaderId = null;
    this.studentService.getAll(classId).subscribe((data) => (this.availableStudents = data));
  }

  toggleMember(studentId: number): void {
    if (this.newTeamMembers.includes(studentId)) {
      this.newTeamMembers = this.newTeamMembers.filter((id) => id !== studentId);
      if (this.newTeamLeaderId === studentId) {
        this.newTeamLeaderId = null;
      }
    } else {
      this.newTeamMembers = [...this.newTeamMembers, studentId];
    }
  }

  setLeader(studentId: number): void {
    if (!this.newTeamMembers.includes(studentId)) {
      this.newTeamMembers = [...this.newTeamMembers, studentId];
    }
    this.newTeamLeaderId = studentId;
  }

  submitCreate(): void {
    if (!this.newTeamName.trim() || !this.newTeamClassId) return;

    this.isSaving = true;
    this.teamService
      .create({
        name: this.newTeamName,
        class_id: this.newTeamClassId,
        member_ids: this.newTeamMembers,
        leader_id: this.newTeamLeaderId ?? undefined,
      })
      .subscribe({
        next: (created) => {
          this.teams = [created, ...this.teams];
          this.isSaving = false;
          this.closeModal();
        },
        error: () => {
          this.isSaving = false;
          this.errorMessage = "Erreur lors de la création de l'équipe.";
        },
      });
  }
}