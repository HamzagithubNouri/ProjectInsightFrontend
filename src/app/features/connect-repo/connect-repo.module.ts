import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConnectRepoRoutingModule } from './connect-repo-routing.module';
import { ConnectRepoComponent } from './connect-repo.component';


@NgModule({
  declarations: [
    ConnectRepoComponent
  ],
  imports: [
    CommonModule,
    ConnectRepoRoutingModule
  ]
})
export class ConnectRepoModule { }
