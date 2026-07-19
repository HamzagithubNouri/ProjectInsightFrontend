import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';

// Chaque page devient un module lazy-loadé (features/xxx/xxx.module.ts).
// Le layout agit comme "shell" avec un router-outlet pour ses enfants,
// exactement comme {children} en React mais géré par le Router.
const routes: Routes = [
  {
    path: 'student',
    component: StudentLayoutComponent,
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
    ],
  },
  // { path: 'teacher', component: TeacherLayoutComponent, children: [...] } (même principe)
  { path: '', redirectTo: '/student', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}