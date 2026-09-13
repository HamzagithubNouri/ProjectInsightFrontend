import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  LucideAngularModule, UserPlus, Search, Pencil, Trash2, X, User, Mail, Lock, Eye,
} from 'lucide-angular';
import { TeacherManagementComponent } from './teacher-management.component';

const routes: Routes = [{ path: '', component: TeacherManagementComponent }];

@NgModule({
  declarations: [TeacherManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({ UserPlus, Search, Pencil, Trash2, X, User, Mail, Lock, Eye }),
  ],
})
export class TeacherManagementModule {}