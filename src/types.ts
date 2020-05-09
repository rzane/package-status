export interface Adapter {
  getVersion(cwd: string, name: string): Promise<string>;
  isPublished(name: string, version: string): Promise<boolean>;
}
