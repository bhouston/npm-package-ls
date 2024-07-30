import type { NodePackage } from './NodePackage.js';

export const postProcessNodePackage = (
  rootPackage: NodePackage,
  uniquePackages: Set<string> = new Set()
): number => {
  if (rootPackage.totalSize !== undefined) return rootPackage.totalSize;

  const key = `${rootPackage.name}@${rootPackage.version}`;

  const localUniquePackages = new Set(uniquePackages);

  if (localUniquePackages.has(key)) {
    return 0;
  }
  localUniquePackages.add(key);

  let totalSize = rootPackage.size || 0;
  rootPackage.dependencies?.forEach((nodePackage) => {
    const packageSize = postProcessNodePackage(
      nodePackage,
      localUniquePackages
    );
    totalSize += packageSize;
  });
  rootPackage.devDependencies?.forEach((nodePackage) => {
    const packageSize = postProcessNodePackage(
      nodePackage,
      localUniquePackages
    );
    totalSize += packageSize;
  });
  rootPackage.totalSize = totalSize;

  return rootPackage.totalSize;
};
