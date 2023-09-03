import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';

/**
 * @param {{ in: string; relativeTo?: string; encoding?: string }} options
 * @param {boolean} lexer
 * 
 * @returns {Promise<import('marked').TokensList | null>}
 */
export const readFile = async (options, lexer) => {
  /**
   * @type {Buffer | null}
   */
  let file = null;

  try {
    const filePath = path.resolve(options.relativeTo ?? '.', options.in);
    file = await fs.readFile(filePath);
  } catch {
    console.error(`could not access file '${options.in}' in ${options.relativeTo}.`);

    return null;
  }

  const string = file.toString(options.encoding ?? 'utf-8');

  return lexer ? marked.lexer(string) : string;
}
