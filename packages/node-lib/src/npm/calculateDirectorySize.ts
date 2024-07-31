import { formatBytes } from '@bhouston/common-lib';
import { promises as fs } from 'fs';
import path from 'path';

const directoryToSize = new Map<string, number>();

export async function calculateDirectorySize(
  directory: string,
  topLevel = true
): Promise<number> {
  const cachedSize = directoryToSize.get(directory);
  if (cachedSize !== undefined) {
    return cachedSize;
  }
  let totalSize = 0;

  const files = await fs.readdir(directory);

  for (const file of files) {
    if (file === 'node_modules') continue;
    const filePath = path.join(directory, file);
    const stats = await fs.lstat(filePath);

    if (stats.isSymbolicLink()) continue;

    if (stats.isDirectory()) {
      totalSize += await calculateDirectorySize(filePath, false);
    } else {
      totalSize += stats.size;
    }
  }

  directoryToSize.set(directory, totalSize);

  //if (topLevel) console.log(`size of ${directory}: ${formatBytes(totalSize)}`);
  return totalSize;
}
