import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  LucideAngularModule,
  Plus,
  Search,
  Crown,
  CheckCircle,
  XCircle,
  UserPlus,
  UserMinus,
  GitBranch,
  X,
} from 'lucide-angular';
import { TeamsManagementComponent } from './teams-management.component';

const routes: Routes = [{ path: '', component: TeamsManagementComponent }];

@NgModule({
  declarations: [TeamsManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({
      Plus, Search, Crown, CheckCircle, XCircle, UserPlus, UserMinus, GitBranch, X,
    }),
  ],
})
export class TeamsManagementModule {}