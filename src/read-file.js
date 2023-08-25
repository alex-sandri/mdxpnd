import fs from 'fs/promises';
import { marked } from 'marked';

/**
 * @param {{ in: string; encoding?: string }} options
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
    file = await fs.readFile(options.in);
  } catch {
    console.error(`could not access file '${options.in}'.`);

    return null;
  }

  const string = file.toString(options.encoding ?? 'utf-8');

  return lexer ? marked.lexer(string) : string;
}
