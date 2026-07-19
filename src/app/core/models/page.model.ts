// Équivalent Angular du `type Page = ...` dans App.tsx (React)
export type Page =
  | 'student-dashboard'
  | 'my-team'
  | 'connect-repo'
  | 'ai-code-review'
  | 'analysis-history'
  | 'notifications'
  | 'teacher-dashboard'
  | 'class-management'
  | 'class-detail'
  | 'project-details'
  | 'teams-management'
  | 'create-team'
  | 'students'
  | 'analytics'
  | 'teacher-notifications'
  | 'settings'
  | 'auth';
 
export interface NavItem {
  label: string;
  page: Page;
  route: string; // chemin réel utilisé par le Router Angular
  icon?: string; // nom de l'icône lucide-angular
}
 