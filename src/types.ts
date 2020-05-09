export type PackageType = "gem" | "npm" | "hex";

export interface Config {
  name: string;
  type: PackageType;
  cwd: string;
}

export interface Adapter {
  getVersion(cwd: string, name: string): Promise<string>;
  isPublished(name: string, version: string): Promise<boolean>;
}

export interface Result {
  version: string;
  published: boolean;
}
