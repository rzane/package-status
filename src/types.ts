export interface Project {
  name: string;
  version: string;
}

export interface Adapter {
  isProject(cwd: string): Promise<boolean>;
  getProject(cwd: string): Promise<Project>;
  isPublished(name: string, version: string): Promise<boolean>;
}
