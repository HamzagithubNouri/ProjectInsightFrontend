import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisHistoryComponent } from './analysis-history.component';

const routes: Routes = [{ path: '', component: AnalysisHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisHistoryRoutingModule { }
