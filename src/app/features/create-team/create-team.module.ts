import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateTeamRoutingModule } from './create-team-routing.module';
import { CreateTeamComponent } from './create-team.component';


@NgModule({
  declarations: [
    CreateTeamComponent
  ],
  imports: [
    CommonModule,
    CreateTeamRoutingModule
  ]
})
export class CreateTeamModule { }
