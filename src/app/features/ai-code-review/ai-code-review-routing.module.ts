import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiCodeReviewComponent } from './ai-code-review.component';

const routes: Routes = [{ path: '', component: AiCodeReviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiCodeReviewRoutingModule { }
