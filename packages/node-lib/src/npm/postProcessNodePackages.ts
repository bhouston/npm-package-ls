import type { NodePackage } from './NodePackage.js';

export const postProcessNodePackage = (
  rootPackage: NodePackage,
  uniquePackages: Set<string> = new Set()
): number => {
  if (rootPackage.totalSize !== undefined) return rootPackage.totalSize;

  const key = `${rootPackage.name}`;
  const localUniquePackages = new Set(uniquePackages);
  let totalSize = rootPackage.size;
  if (totalSize === undefined) {
    totalSize = 0;
  }

  /*  if (!localUniquePackages.has(key)) {
    localUniquePackages.add(key);

    rootPackage.dependencies?.forEach((nodePackage) => {
      totalSize += postProcessNodePackage(nodePackage, localUniquePackages);
    });
    rootPackage.devDependencies?.forEach((nodePackage) => {
      totalSize += postProcessNodePackage(nodePackage, localUniquePackages);
    });
  }*/

  rootPackage.totalSize = totalSize;
  return rootPackage.totalSize;
};
