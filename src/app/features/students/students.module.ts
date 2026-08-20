import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LucideAngularModule, Search, Plus, X, GitCommit } from 'lucide-angular';
import { StudentsComponent } from './students.component';

const routes: Routes = [{ path: '', component: StudentsComponent }];

@NgModule({
  declarations: [StudentsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({ Search, Plus, X, GitCommit }),
  ],
})
export class StudentsModule {}