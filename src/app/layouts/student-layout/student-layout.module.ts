import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Cpu, Bell, ChevronDown } from 'lucide-angular';
import { StudentLayoutComponent } from './student-layout.component';
 
@NgModule({
  declarations: [StudentLayoutComponent],
  imports: [
    CommonModule,
    RouterModule, // fournit router-outlet et routerLink
    LucideAngularModule.pick({ Cpu, Bell, ChevronDown }),
  ],
  exports: [StudentLayoutComponent],
})
export class StudentLayoutModule {}
 