import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectRepoComponent } from './connect-repo.component';

const routes: Routes = [{ path: '', component: ConnectRepoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConnectRepoRoutingModule { }
