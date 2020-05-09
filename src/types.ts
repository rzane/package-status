export type PackageType = "gem" | "npm" | "hex";

export interface Config {
  cwd: string;
  name: string;
  type: PackageType;
}

export interface Adapter {
  getVersion(cwd: string, name: string): Promise<string>;
  isPublished(name: string, version: string): Promise<boolean>;
}

export interface Result {
  version: string;
  published: boolean;
}
