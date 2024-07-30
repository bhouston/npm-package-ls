import {
  initRootNodePackage,
  type NodePackage,
  outputTreeSize,
  postProcessNodePackage,
  processNodePackage
} from '@bhouston/node-lib';
import { createRequire } from 'module';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const require = createRequire(import.meta.url);
const packageInfo = require('../package.json');

type CommandLineArgs = {
  path: string;
};

export const main = async () => {
  const argv = (await yargs(hideBin(process.argv))
    .version(packageInfo.version)
    .options({
      path: {
        type: 'string',
        default: process.cwd(),
        description: 'The path to the package.json file to analyze'
      }
    }).argv) as CommandLineArgs;

  const path = argv.path;

  const rootPath = path;
  console.log(`Analyzing ${path}`);
  const rootPackageJsonPath = `${rootPath}/package.json`;
  const rootPackage = await initRootNodePackage(rootPackageJsonPath);
  const workQueue: NodePackage[] = [rootPackage];
  while (workQueue.length > 0) {
    const nodePackage = workQueue.pop();
    if (nodePackage) {
      await processNodePackage(nodePackage, rootPath, workQueue);
    }
  }
  postProcessNodePackage(rootPackage);
  outputTreeSize(rootPackage, 4);
};
