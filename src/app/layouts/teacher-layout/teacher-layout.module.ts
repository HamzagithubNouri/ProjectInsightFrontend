import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Cpu,
  LayoutDashboard,
  Users,
  BookOpen,
  FolderOpen,
  GraduationCap,
  Bell,
  Settings,
  ChevronLeft,
  Search,
  ChevronDown,
  LogOut,
} from 'lucide-angular';
import { TeacherLayoutComponent } from './teacher-layout.component';

@NgModule({
  declarations: [TeacherLayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule.pick({
      Cpu,
      LayoutDashboard,
      Users,
      BookOpen,
      FolderOpen,
      GraduationCap,
      Bell,
      Settings,
      ChevronLeft,
      Search,
      ChevronDown,
      LogOut,
    }),
  ],
  exports: [TeacherLayoutComponent],
})
export class TeacherLayoutModule {}