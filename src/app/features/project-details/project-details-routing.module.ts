import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailsComponent } from './project-details.component';
import { TeamAiReviewComponent } from './team-ai-review/team-ai-review.component';
import { TeacherPrReviewComponent } from './team-ai-review/pr-review/pr-review.component';

const routes: Routes = [
  // Acces direct a /teacher/projects (ex: clic sur "Projects" dans la sidebar
  // sans avoir choisi de team) -> redirige vers la liste des classes
  { path: '', redirectTo: '/teacher/classes', pathMatch: 'full' },
  { path: ':teamId', component: ProjectDetailsComponent },
  { path: ':teamId/ai-review', component: TeamAiReviewComponent },
  { path: ':teamId/ai-review/prs/:prNumber', component: TeacherPrReviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectDetailsRoutingModule {}