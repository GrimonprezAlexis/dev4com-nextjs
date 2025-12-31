export type ProjectStatus = 'In Progress' | 'Completed' | 'Archived';

export interface ProjectLinks {
  app_link?: string;
  repository?: string;
  maquette?: string;
  swagger_yaml?: string;
  credentials?: Array<{
    email: string;
    password: string;
  }>;
  conversion_details?: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  job?: string;
  description: string;
  imageUrl: string;
  imagesUrl?: string[];
  technologies: string[];
  icons?: string[];
  tags?: string[];
  links: ProjectLinks;
  status: ProjectStatus;
  createdAt: Date;
  client?: string;
}

export const PROJECT_STATUSES: ProjectStatus[] = [
  'In Progress',
  'Completed',
  'Archived'
];
