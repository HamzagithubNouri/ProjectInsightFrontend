import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Cpu, GitBranch, BarChart3, Shield } from 'lucide-angular';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';


@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({ Cpu, GitBranch, BarChart3, Shield }),
  ]
})
export class AuthModule { }
