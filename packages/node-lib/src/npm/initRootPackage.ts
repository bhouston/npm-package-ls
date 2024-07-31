import { promises as fs } from 'fs';
import path from 'path';

import type { NodePackage } from './NodePackage.js';

export async function initRootNodePackage(
  rootPackageJsonPath: string
): Promise<NodePackage> {
  const rootPackageJson = JSON.parse(
    await fs.readFile(rootPackageJsonPath, 'utf-8')
  );
  const rootPath = path.dirname(rootPackageJsonPath);

  const rootNodePackage: NodePackage = {
    parentPackagePath: undefined,
    name: rootPackageJson.name,
    version: rootPackageJson.version,
    packagePath: rootPath,
    size: 0,
    totalSize: undefined,
    workspaces: undefined,
    dependencies: undefined,
    devDependencies: undefined
  };

  return rootNodePackage;
}
