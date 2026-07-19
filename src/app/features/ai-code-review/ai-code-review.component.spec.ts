import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiCodeReviewComponent } from './ai-code-review.component';

describe('AiCodeReviewComponent', () => {
  let component: AiCodeReviewComponent;
  let fixture: ComponentFixture<AiCodeReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiCodeReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiCodeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
