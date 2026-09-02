export interface ActivityDay {
  day: string;
  date: string;
  commits: number;
}

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface RecentFinding {
  title: string;
  severity: FindingSeverity;
  filename: string | null;
  created_at: string;
}