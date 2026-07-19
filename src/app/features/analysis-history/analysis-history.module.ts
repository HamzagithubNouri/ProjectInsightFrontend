import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalysisHistoryRoutingModule } from './analysis-history-routing.module';
import { AnalysisHistoryComponent } from './analysis-history.component';


@NgModule({
  declarations: [
    AnalysisHistoryComponent
  ],
  imports: [
    CommonModule,
    AnalysisHistoryRoutingModule
  ]
})
export class AnalysisHistoryModule { }
