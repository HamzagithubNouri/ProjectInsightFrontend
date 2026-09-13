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

// Correspond exactement a AutoFixResult (backend, POST /ai-review/fix)
export interface AutoFixResult {
  filename?: string;
  corrected_code: string;
  summary_of_changes: string;
  syntax_valid?: boolean | null;
  syntax_note?: string | null;
}