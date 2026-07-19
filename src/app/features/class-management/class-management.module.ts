import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassManagementRoutingModule } from './class-management-routing.module';
import { ClassManagementComponent } from './class-management.component';


@NgModule({
  declarations: [
    ClassManagementComponent
  ],
  imports: [
    CommonModule,
    ClassManagementRoutingModule
  ]
})
export class ClassManagementModule { }
