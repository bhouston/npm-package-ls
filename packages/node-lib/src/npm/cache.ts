import type { NodePackage } from './NodePackage.js';

export const nodePackageCache: { [key: string]: NodePackage } = {};

export const requestNodePackage = (
  parentPackagePath: string | undefined,
  name: string,
  version: string
): NodePackage => {
  const key = `${name}`;

  //console.log(`requesting ${key}`);

  const existingNodePackage = nodePackageCache[key];
  if (existingNodePackage) {
    return existingNodePackage;
  }

  const newNodePackage: NodePackage = {
    parentPackagePath,
    name,
    version: version as string,
    packagePath: undefined,
    size: undefined,
    totalSize: undefined,
    workspaces: undefined,
    dependencies: undefined,
    devDependencies: undefined
  };

  nodePackageCache[key] = newNodePackage;
  return newNodePackage;
};
