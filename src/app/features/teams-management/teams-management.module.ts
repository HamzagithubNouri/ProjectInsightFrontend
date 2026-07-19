import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsManagementRoutingModule } from './teams-management-routing.module';
import { TeamsManagementComponent } from './teams-management.component';


@NgModule({
  declarations: [
    TeamsManagementComponent
  ],
  imports: [
    CommonModule,
    TeamsManagementRoutingModule
  ]
})
export class TeamsManagementModule { }
