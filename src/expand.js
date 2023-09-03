import path from 'path';
import { marked } from 'marked';
import { readFile } from './read-file.js';

/**
 * @param {import('marked').TokensList} tokens
 * @param {string} filePath
 * 
 * @returns {Promise<string>}
 */
export const expand = async (tokens, filePath) => {
  const fileName = path.basename(filePath);

  console.info(`expanding '${fileName}'.`);

  /**
   * @type {string[]}
   */
  const outputParts = [];

  for (const token of tokens) {
    if (token.type === 'heading') {
      outputParts.push(
        '<div style="color: green; background-color: white; width: max-content;">\n',
        marked.parse(token.raw),
        '</div>\n\n',
      );

      continue;
    } else if (token.type !== 'list') {
      outputParts.push(token.raw);

      continue;
    }

    /**
     * @type {(string | null)[]}
     */
    const links = token.items.map((item) => {
      const isLink = /^\[.*\]\(.*\)(\.|;)?$/gs.test(item.text);

      if (!isLink) {
        return null;
      }

      const linkTextToken = item.tokens[0];
      const linkToken = linkTextToken.tokens[0];

      const title = linkToken.text;
      const location = linkToken.href;

      console.info(`found link '${title}' to '${location}'.`);

      return location;
    });

    const isValidList = links.every((link) => link !== null);

    if (!isValidList) {
      outputParts.push(token.raw);

      continue;
    }

    for (const link of links) {
      const file = await readFile({
        in: link,
        relativeTo: path.dirname(filePath)
      }, false);

      if (file === null) {
        continue;
      }

      console.info(`expanded '${link}' into '${fileName}'.`);

      outputParts.push('\n' + file.trim() + '\n');
    }
  }

  console.info(`successfully expanded '${fileName}'.`);

  return outputParts.join('');
}
