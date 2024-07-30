import type { NodePackage } from './NodePackage.js';

const recursionGuard = new Set<string>();

export const postProcessNodePackage = (rootPackage: NodePackage): number => {
  if (rootPackage.totalSize !== undefined) return rootPackage.totalSize;

  const key = `${rootPackage.name}@${rootPackage.version}`;

  if (recursionGuard.has(key)) {
    return rootPackage.size || 0;
  }
  recursionGuard.add(key);

  let totalSize = rootPackage.size || 0;
  rootPackage.dependencies?.forEach((nodePackage) => {
    const packageSize = postProcessNodePackage(nodePackage);
    totalSize += packageSize;
  });
  rootPackage.devDependencies?.forEach((nodePackage) => {
    const packageSize = postProcessNodePackage(nodePackage);
    totalSize += packageSize;
  });
  rootPackage.totalSize = totalSize;

  recursionGuard.delete(key);

  return rootPackage.totalSize;
};
