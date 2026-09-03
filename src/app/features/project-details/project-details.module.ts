import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ArrowLeft,
  CheckCircle,
  XCircle,
  GitBranch,
  Crown,
  Bot,
} from 'lucide-angular';
import { ProjectDetailsRoutingModule } from './project-details-routing.module';
import { ProjectDetailsComponent } from './project-details.component';
import { TeamAiReviewComponent } from './team-ai-review/team-ai-review.component';
import { TeacherPrReviewComponent } from './team-ai-review/pr-review/pr-review.component';

@NgModule({
  declarations: [ProjectDetailsComponent, TeamAiReviewComponent, TeacherPrReviewComponent],
  imports: [
    CommonModule,
    ProjectDetailsRoutingModule,
    LucideAngularModule.pick({
      ArrowLeft, CheckCircle, XCircle, GitBranch, Crown, Bot,
    }),
  ],
})
export class ProjectDetailsModule {}