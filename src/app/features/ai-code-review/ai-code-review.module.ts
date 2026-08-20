import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  LucideAngularModule,
  Code,
  Upload,
  Play,
  Copy,
  Wand2,
  ShieldCheck,
} from 'lucide-angular';
import { AiCodeReviewComponent } from './ai-code-review.component';

const routes: Routes = [{ path: '', component: AiCodeReviewComponent }];

@NgModule({
  declarations: [AiCodeReviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({ Code, Upload, Play, Copy, Wand2, ShieldCheck }),
  ],
})
export class AiCodeReviewModule {}