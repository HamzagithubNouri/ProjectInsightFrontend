export type ActivityType = 'push' | 'pr_opened' | 'pr_merged' | 'issue_opened';

export interface ActivityEvent {
  type: ActivityType;
  actor_name: string;
  actor_initials: string;
  description: string;
  created_at: string;
}