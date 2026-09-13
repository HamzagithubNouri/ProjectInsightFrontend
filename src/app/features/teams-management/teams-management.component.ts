import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TeamService } from '../../core/services/team.service';
import { ClassService } from '../../core/services/class.service';
import { StudentService } from '../../core/services/student.service';
import { ClassSummary } from '../../core/models/class.model';
import { Student } from '../../core/models/student.model';
import { TeamListItem, AvailableStudent } from '../../core/models/team.model';
import { TeamMemberInfo } from '../../core/services/team-me.service';

@Component({
  selector: 'app-teams-management',
  templateUrl: './teams-management.component.html',
  styleUrls: ['./teams-management.component.scss'],
})
export class TeamsManagementComponent implements OnInit {
  teams: TeamListItem[] = [];
  classes: ClassSummary[] = [];
  loading = true;
  errorMessage: string | null = null;

  search = '';
  classFilter = 'all';

  // --- Create Team modal ---
  showCreateModal = false;
  isSaving = false;
  newTeamName = '';
  newTeamClassId: number | null = null;
  newTeamMembers: number[] = [];
  newTeamLeaderId: number | null = null;
  availableStudentsForCreate: Student[] = [];

  // --- Add Member modal ---
  showAddModal = false;
  addModalTeam: TeamListItem | null = null;
  addModalSearch = '';
  addModalStudents: AvailableStudent[] = [];
  addModalSelectedId: number | null = null;
  addModalLoading = false;
  addModalSaving = false;
  addModalError: string | null = null;

  // --- Remove Member modal ---
  showRemoveModal = false;
  removeModalTeam: TeamListItem | null = null;
  removeModalMembers: TeamMemberInfo[] = [];
  removeModalSelectedId: number | null = null;
  removeModalLoading = false;
  removeModalSaving = false;
  removeModalError: string | null = null;

  constructor(
    private teamService: TeamService,
    private classService: ClassService,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  // Aucune route "liste toutes les teams" n'existe cote backend : on
  // reconstruit la liste a partir de GET /teacher/classes + le detail de
  // chaque classe (deja implementes), qui renvoient chacun member_count.
  loadTeams(): void {
    this.loading = true;
    this.errorMessage = null;

    this.classService.getAll().subscribe({
      next: (classes) => {
        this.classes = classes;

        if (classes.length === 0) {
          this.teams = [];
          this.loading = false;
          return;
        }

        forkJoin(classes.map((c) => this.classService.getDetail(c.id))).subscribe({
          next: (details) => {
            this.teams = details.flatMap((d) =>
              d.teams.map((t) => ({
                id: t.id,
                name: t.name,
                member_count: t.member_count,
                class_name: d.name,
              })),
            );
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'Impossible de charger les équipes.';
            this.loading = false;
          },
        });
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les classes.';
        this.loading = false;
      },
    });
  }

  get filtered(): TeamListItem[] {
    return this.teams.filter((t) => {
      const q = this.search.toLowerCase();
      const matchSearch = t.name.toLowerCase().includes(q);
      const matchClass = this.classFilter === 'all' || t.class_name === this.classFilter;
      return matchSearch && matchClass;
    });
  }

  // ================= Create Team =================

  openCreateModal(): void {
    this.showCreateModal = true;
    if (this.classes.length) {
      this.onCreateClassChange(this.classes[0].id);
    }
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newTeamName = '';
    this.newTeamMembers = [];
    this.newTeamLeaderId = null;
  }

  onCreateClassChange(classId: number): void {
    this.newTeamClassId = classId;
    this.newTeamMembers = [];
    this.newTeamLeaderId = null;
    this.studentService.getAll(classId).subscribe((data) => (this.availableStudentsForCreate = data));
  }

  toggleCreateMember(studentId: number): void {
    if (this.newTeamMembers.includes(studentId)) {
      this.newTeamMembers = this.newTeamMembers.filter((id) => id !== studentId);
      if (this.newTeamLeaderId === studentId) this.newTeamLeaderId = null;
    } else {
      this.newTeamMembers = [...this.newTeamMembers, studentId];
    }
  }

  setCreateLeader(studentId: number): void {
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
        next: () => {
          this.isSaving = false;
          this.closeCreateModal();
          this.loadTeams();
        },
        error: () => {
          this.isSaving = false;
          this.errorMessage = "Erreur lors de la création de l'équipe.";
        },
      });
  }

  // ================= Add Member =================

  openAddModal(team: TeamListItem): void {
    this.addModalTeam = team;
    this.addModalSelectedId = null;
    this.addModalSearch = '';
    this.addModalError = null;
    this.showAddModal = true;
    this.addModalLoading = true;

    this.teamService.getAvailableStudents(team.id).subscribe({
      next: (data) => {
        this.addModalStudents = data;
        this.addModalLoading = false;
      },
      error: () => {
        this.addModalError = 'Impossible de charger les étudiants disponibles.';
        this.addModalLoading = false;
      },
    });
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.addModalTeam = null;
    this.addModalStudents = [];
    this.addModalSelectedId = null;
  }

  get filteredAddModalStudents(): AvailableStudent[] {
    const q = this.addModalSearch.toLowerCase();
    return this.addModalStudents.filter(
      (s) => `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) || s.email.toLowerCase().includes(q),
    );
  }

  confirmAddMember(): void {
    if (!this.addModalTeam || !this.addModalSelectedId) return;

    this.addModalSaving = true;
    this.addModalError = null;

    this.teamService.addMember(this.addModalTeam.id, this.addModalSelectedId).subscribe({
      next: () => {
        this.addModalSaving = false;
        this.closeAddModal();
        this.loadTeams(); // recharge pour mettre a jour member_count
      },
      error: (err) => {
        this.addModalSaving = false;
        this.addModalError =
          err?.status === 400
            ? 'Cet étudiant est déjà membre de cette équipe.'
            : "Erreur lors de l'ajout du membre.";
      },
    });
  }

  // ================= Remove Member =================

  openRemoveModal(team: TeamListItem): void {
    this.removeModalTeam = team;
    this.removeModalSelectedId = null;
    this.removeModalError = null;
    this.showRemoveModal = true;
    this.removeModalLoading = true;

    this.teamService.getProjectDetails(team.id).subscribe({
      next: (details) => {
        this.removeModalMembers = details.members;
        this.removeModalLoading = false;
      },
      error: () => {
        this.removeModalError = 'Impossible de charger les membres de cette équipe.';
        this.removeModalLoading = false;
      },
    });
  }

  closeRemoveModal(): void {
    this.showRemoveModal = false;
    this.removeModalTeam = null;
    this.removeModalMembers = [];
    this.removeModalSelectedId = null;
  }

  confirmRemoveMember(): void {
    if (!this.removeModalTeam || !this.removeModalSelectedId) return;

    this.removeModalSaving = true;
    this.removeModalError = null;

    this.teamService.removeMember(this.removeModalTeam.id, this.removeModalSelectedId).subscribe({
      next: () => {
        this.removeModalSaving = false;
        this.closeRemoveModal();
        this.loadTeams(); // recharge pour mettre a jour member_count
      },
      error: () => {
        this.removeModalSaving = false;
        this.removeModalError = 'Erreur lors de la suppression du membre.';
      },
    });
  }
}