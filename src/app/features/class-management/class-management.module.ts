import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  LucideAngularModule,
  Plus,
  ArrowRight,
  ArrowLeft,
  Users,
  CheckCircle,
  AlertTriangle,
} from 'lucide-angular';
import { ClassManagementComponent } from './class-management.component';
import { ClassDetailComponent } from '../class-detail/class-detail.component';

// Le param :classId est defini directement ici (pas d'inheritance de route
// necessaire) : la page de detail vit dans le meme chunk lazy que la liste.
const routes: Routes = [
  { path: '', component: ClassManagementComponent },
  { path: ':classId', component: ClassDetailComponent },
];

@NgModule({
  declarations: [ClassManagementComponent, ClassDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({
      Plus, ArrowRight, ArrowLeft, Users, CheckCircle, AlertTriangle,
    }),
  ],
})
export class ClassManagementModule {}