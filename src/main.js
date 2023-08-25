import fs from 'fs/promises';
import path from 'path';

import { expand } from './expand.js';
import { readFile } from './read-file.js';

/**
 * @param {{ in: string; out: string; encoding: string }} options
 * 
 * @returns {Promise<void>}
 */
export const main = async (options) => {
  const tokens = await readFile(options, true);

  if (tokens === null) {
    return;
  }

  const result = await expand(tokens, path.basename(options.in));

  await fs.writeFile(options.out, result, options.encoding);

  console.info(`successfully wrote output to '${options.out}'.`);
}
