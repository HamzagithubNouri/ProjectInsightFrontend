import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamsManagementComponent } from './teams-management.component';

const routes: Routes = [{ path: '', component: TeamsManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsManagementRoutingModule { }
