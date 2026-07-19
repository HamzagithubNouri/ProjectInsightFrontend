import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherNotificationsComponent } from './teacher-notifications.component';

const routes: Routes = [{ path: '', component: TeacherNotificationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherNotificationsRoutingModule { }
