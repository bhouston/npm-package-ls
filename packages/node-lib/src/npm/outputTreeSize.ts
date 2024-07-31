import { formatBytes } from '@bhouston/common-lib';

import type { NodePackage } from './NodePackage.js';
export const outputTreeSize = (
  nodePackage: NodePackage,
  maxLevels = -1,
  prefix = ''
) => {
  console.log(
    `${prefix}${nodePackage.name}@${
      nodePackage.version ?? '<none>'
    } - ${formatBytes(nodePackage.size)} / ${formatBytes(
      nodePackage.totalSize
    )}`
  );
  if (maxLevels !== 0) {
    if (nodePackage.dependencies && nodePackage.dependencies.length > 0) {
      console.log(`${prefix} deps:`);
      nodePackage.dependencies?.forEach((childNodePackage) => {
        outputTreeSize(childNodePackage, maxLevels - 1, prefix + '  ');
      });
    }
    if (nodePackage.devDependencies && nodePackage.devDependencies.length > 0) {
      console.log(`${prefix} devDeps:`);
      nodePackage.devDependencies?.forEach((childNodePackage) => {
        outputTreeSize(childNodePackage, maxLevels - 1, prefix + '  ');
      });
    }
  }
};
