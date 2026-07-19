import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassManagementComponent } from './class-management.component';

const routes: Routes = [{ path: '', component: ClassManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassManagementRoutingModule { }
