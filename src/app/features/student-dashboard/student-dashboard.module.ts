import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LucideAngularModule, GitCommit, GitPullRequest, PieChart, ArrowRight } from 'lucide-angular';
import { StudentDashboardComponent } from './student-dashboard.component';

const routes: Routes = [{ path: '', component: StudentDashboardComponent }];

@NgModule({
  declarations: [StudentDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({ GitCommit, GitPullRequest, PieChart, ArrowRight }),
  ],
})
export class StudentDashboardModule {}