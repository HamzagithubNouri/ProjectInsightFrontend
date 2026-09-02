import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  LucideAngularModule,
  Code,
  Upload,
  Play,
  Copy,
  Wand2,
  ShieldCheck,
  Folder,
  CheckCircle,
  GitBranch,
  GitPullRequest,
  ArrowLeft,
} from 'lucide-angular';
import { AiCodeReviewComponent } from './ai-code-review.component';
import { PullRequestsComponent } from './pull-requests/pull-requests.component';
import { PrReviewComponent } from './pr-review/pr-review.component';

const routes: Routes = [
  { path: '', component: AiCodeReviewComponent },
  { path: 'pulls', component: PullRequestsComponent },
  { path: 'pulls/:prNumber/review', component: PrReviewComponent, data: { mode: 'review' } },
  { path: 'pulls/:prNumber/history', component: PrReviewComponent, data: { mode: 'history' } },
];

@NgModule({
  declarations: [AiCodeReviewComponent, PullRequestsComponent, PrReviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({
      Code, Upload, Play, Copy, Wand2, ShieldCheck,
      Folder, CheckCircle, GitBranch, GitPullRequest, ArrowLeft,
    }),
  ],
})
export class AiCodeReviewModule {}