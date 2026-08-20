import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  LucideAngularModule,
  CheckCircle,
  GitBranch,
  Github,
  RefreshCw,
} from 'lucide-angular';
import { ConnectRepoComponent } from './connect-repo.component';

const routes: Routes = [{ path: '', component: ConnectRepoComponent }];

@NgModule({
  declarations: [ConnectRepoComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({ CheckCircle, GitBranch, Github, RefreshCw }),
  ],
})
export class ConnectRepoModule {}