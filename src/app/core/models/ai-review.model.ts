export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface Finding {
  severity: Severity;
  title: string;
  description: string;
  line_start: number;
  line_end: number;
  suggested_fix?: string;
}

export interface AiReviewResult {
  filename: string;
  findings: Finding[];
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}