import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassDetailRoutingModule } from './class-detail-routing.module';
import { ClassDetailComponent } from './class-detail.component';


@NgModule({
  declarations: [
    ClassDetailComponent
  ],
  imports: [
    CommonModule,
    ClassDetailRoutingModule
  ]
})
export class ClassDetailModule { }
