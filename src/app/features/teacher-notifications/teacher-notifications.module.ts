import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherNotificationsRoutingModule } from './teacher-notifications-routing.module';
import { TeacherNotificationsComponent } from './teacher-notifications.component';


@NgModule({
  declarations: [
    TeacherNotificationsComponent
  ],
  imports: [
    CommonModule,
    TeacherNotificationsRoutingModule
  ]
})
export class TeacherNotificationsModule { }
