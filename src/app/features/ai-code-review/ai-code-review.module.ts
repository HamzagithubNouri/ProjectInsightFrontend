import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AiCodeReviewRoutingModule } from './ai-code-review-routing.module';
import { AiCodeReviewComponent } from './ai-code-review.component';


@NgModule({
  declarations: [
    AiCodeReviewComponent
  ],
  imports: [
    CommonModule,
    AiCodeReviewRoutingModule
  ]
})
export class AiCodeReviewModule { }
