import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';
import { TeacherLayoutComponent } from './layouts/teacher-layout/teacher-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/student-dashboard/student-dashboard.module').then(
            (m) => m.StudentDashboardModule,
          ),
      },
      {
        path: 'my-team',
        loadChildren: () =>
          import('./features/my-team/my-team.module').then((m) => m.MyTeamModule),
      },
      {
        path: 'connect-repo',
        loadChildren: () =>
          import('./features/connect-repo/connect-repo.module').then(
            (m) => m.ConnectRepoModule,
          ),
      },
      {
        path: 'ai-code-review',
        loadChildren: () =>
          import('./features/ai-code-review/ai-code-review.module').then(
            (m) => m.AiCodeReviewModule,
          ),
      },
      {
        path: 'analysis-history',
        loadChildren: () =>
          import('./features/analysis-history/analysis-history.module').then(
            (m) => m.AnalysisHistoryModule,
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./features/notifications/notifications.module').then(
            (m) => m.NotificationsModule,
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.module').then((m) => m.SettingsModule),
      },
    ],
  },
  {
    path: 'teacher',
    component: TeacherLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['teacher', 'admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/teacher-dashboard/teacher-dashboard.module').then(
            (m) => m.TeacherDashboardModule,
          ),
      },
      {
        path: 'classes',
        loadChildren: () =>
          import('./features/class-management/class-management.module').then(
            (m) => m.ClassManagementModule,
          ),
      },
      {
        path: 'teams',
        loadChildren: () =>
          import('./features/teams-management/teams-management.module').then(
            (m) => m.TeamsManagementModule,
          ),
      },
      {
        path: 'students',
        loadChildren: () =>
          import('./features/students/students.module').then((m) => m.StudentsModule),
      },
      // project-details, analytics, teacher-notifications, settings: meme pattern a ajouter
    ],
  },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}