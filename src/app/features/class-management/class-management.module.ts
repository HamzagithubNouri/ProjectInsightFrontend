import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  LucideAngularModule,
  Upload,
  Plus,
  Search,
  ChevronDown,
  BookOpen,
  Calendar,
  Users,
  Mail,
  Hash,
  MoreHorizontal,
} from 'lucide-angular';
import { ClassManagementComponent } from './class-management.component';

const routes: Routes = [{ path: '', component: ClassManagementComponent }];

@NgModule({
  declarations: [ClassManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({
      Upload, Plus, Search, ChevronDown, BookOpen, Calendar, Users, Mail, Hash, MoreHorizontal,
    }),
  ],
})
export class ClassManagementModule {}