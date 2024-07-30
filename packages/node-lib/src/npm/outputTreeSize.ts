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
    } - ${formatBytes(nodePackage.totalSize ?? 0)}`
  );
  if (maxLevels !== 0) {
    nodePackage.dependencies?.forEach((childNodePackage) => {
      outputTreeSize(childNodePackage, maxLevels - 1, prefix + '  ');
    });
    nodePackage.devDependencies?.forEach((childNodePackage) => {
      outputTreeSize(childNodePackage, maxLevels - 1, prefix + '  ');
    });
  }
};
