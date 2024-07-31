import { promises as fs } from 'fs';
import path from 'path';

const pathExists = async (dir: string): Promise<boolean> => {
  try {
    await fs.access(dir);
    return true;
  } catch (err) {
    return false;
  }
};

export const nodePackagePathCache: { [key: string]: string | true } = {};

export async function resolvePackagePath(
  packageName: string,
  rootPath: string,
  parentPathPath?: string
): Promise<string | undefined> {
  const key = `${packageName}/${parentPathPath ?? '<undefined>'}`;

  const cachedPath = nodePackagePathCache[key];
  if (cachedPath) {
    //console.log(`found ${packageName} in cache! ${cachedPath}`);
    if (cachedPath === true) {
      return undefined;
    }
    return cachedPath;
  }
  const parentPaths = [];
  if (parentPathPath) {
    parentPaths.push(parentPathPath);
  }
  parentPaths.push(rootPath);

  for (const parentPath of parentPaths) {
    const nodeModulesPath = path.join(parentPath, 'node_modules');
    const packagePath = path.join(nodeModulesPath, packageName);

    if (await pathExists(packagePath)) {
      const packageJsonPath = path.join(packagePath, 'package.json');
      if (await pathExists(packageJsonPath)) {
        //console.log(`resolving ${packageName} to ${packagePath}`);
        nodePackagePathCache[key] = packagePath;
        return packagePath;
      }
    }
  }
  nodePackagePathCache[key] = true;
  //console.log(`failed to resolve ${packageName}`);
  return undefined;
}
