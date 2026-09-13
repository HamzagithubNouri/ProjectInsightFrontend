import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Cpu, LogOut } from 'lucide-angular';
import { AdminLayoutComponent } from './admin-layout.component';

@NgModule({
  declarations: [AdminLayoutComponent],
  imports: [CommonModule, RouterModule, LucideAngularModule.pick({ Cpu, LogOut })],
  exports: [AdminLayoutComponent],
})
export class AdminLayoutModule {}