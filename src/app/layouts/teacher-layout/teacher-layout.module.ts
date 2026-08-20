import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Cpu,
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Users,
  GraduationCap,
  Bot,
  ShieldCheck,
  BarChart3,
  FileText,
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
      BookOpen,
      FolderOpen,
      Users,
      GraduationCap,
      Bot,
      ShieldCheck,
      BarChart3,
      FileText,
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