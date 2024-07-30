export type NodePackage = {
  parentPackagePath: string | undefined;
  name: string;
  version: string;
  packagePath: string | undefined;
  size: number | undefined;
  totalSize: number | undefined;
  workspaces: NodePackage[] | undefined;
  dependencies: NodePackage[] | undefined;
  devDependencies: NodePackage[] | undefined;
};
