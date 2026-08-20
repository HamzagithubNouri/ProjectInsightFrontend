import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  LucideAngularModule,
  CheckCircle,
  XCircle,
  Crown,
  Github,
  AlertTriangle,
} from 'lucide-angular';
import { MyTeamComponent } from './my-team.component';

const routes: Routes = [{ path: '', component: MyTeamComponent }];

@NgModule({
  declarations: [MyTeamComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({ CheckCircle, XCircle, Crown, Github, AlertTriangle }),
  ],
})
export class MyTeamModule {}