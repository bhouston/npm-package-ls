import { promises as fs } from 'fs';
import path from 'path';

export async function calculateDirectorySize(
  directory: string,
  topLevel = true
): Promise<number> {
  let totalSize = 0;

  const files = await fs.readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.lstat(filePath);

    if (stats.isSymbolicLink()) continue;

    if (stats.isDirectory()) {
      await calculateDirectorySize(filePath, false);
    } else {
      totalSize += stats.size;
    }
  }

  if (topLevel) console.log(`${directory}: ${totalSize}`);
  return totalSize;
}
