import { promises as fs } from 'fs';
import path from 'path';

import { requestNodePackage } from './cache.js';
import { calculateDirectorySize } from './calculateDirectorySize.js';
import type { NodePackage } from './NodePackage';
import { resolvePackagePath } from './resolvePackagePath.js';

export async function processNodePackage(
  nodePackage: NodePackage,
  rootPath: string,
  workQueue: NodePackage[]
): Promise<void> {
  //console.log(`processing ${nodePackage.name}`);
  if (!nodePackage.packagePath) {
    const packagePath = await resolvePackagePath(
      nodePackage.name,
      rootPath,
      nodePackage.parentPackagePath
    );
    if (!packagePath) return;
    nodePackage.packagePath = packagePath;
  }

  if (nodePackage.packagePath && nodePackage.size === undefined) {
    nodePackage.size = await calculateDirectorySize(nodePackage.packagePath);
    console.log(`size of ${nodePackage.name} is ${nodePackage.size}`);
  }

  if (
    nodePackage.dependencies === undefined ||
    nodePackage.devDependencies === undefined
  ) {
    const packageJsonPath = path.join(
      nodePackage.packagePath || '',
      'package.json'
    );
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    if (nodePackage.dependencies === undefined) {
      nodePackage.dependencies = Object.entries(
        packageJson.dependencies ?? {}
      ).map(([name, version]) =>
        requestNodePackage(nodePackage.packagePath, name, version as string)
      );

      //console.log('new dependencies', nodePackage.dependencies);
      workQueue.push(...nodePackage.dependencies);
    }

    if (nodePackage.devDependencies === undefined) {
      nodePackage.devDependencies = Object.entries(
        packageJson.devDependencies ?? {}
      ).map(([name, version]) =>
        requestNodePackage(nodePackage.packagePath, name, version as string)
      );

      //console.log('new devDependencies', nodePackage.devDependencies);
      workQueue.push(...nodePackage.devDependencies);
    }
  }
}
