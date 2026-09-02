import { Severity } from './ai-review.model';

export type PrState = 'open' | 'closed' | 'merged';

export interface PullRequestSummary {
  number: number;
  title: string;
  state: PrState;
  author: string | null;
  already_reviewed: boolean;
}

export interface PrFinding {
  severity: Severity;
  title: string;
  description: string;
  line_start?: number | null;
  line_end?: number | null;
  suggested_fix?: string | null;
}

export interface PrFileReview {
  filename: string;
  findings: PrFinding[];
}

// Correspond exactement à PRReviewResult (backend)
export interface PrReviewResult {
  pr_number: number;
  pr_title: string;
  files: PrFileReview[];
  overall_quality_score: number;
  summary: string;
  recurring_issues: string[];
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}