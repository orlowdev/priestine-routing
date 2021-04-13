/**
 * Merge given prefix with given string. If at least one of them is a RegExp, new RegExp will be returned.
 * @param {string | RegExp} prefix
 * @param {string | RegExp} url
 * @returns {HttpMatcherInterface}
 */
export const mergePrefixAndUrl = (prefix: string | RegExp, url: string | RegExp): string | RegExp => {
  if (!prefix) {
    return url;
  }

  const prefixIsString = typeof prefix === 'string';
  const urlIsString = typeof url === 'string';

  if (prefixIsString) {
    return urlIsString
      ? (prefix as string).concat(url as string).replace(/(\/\/)/g, '/')
      : new RegExp(new RegExp(prefix).source.concat((url as RegExp).source).replace(/(\\\/\\\/)/g, '/'));
  }

  return urlIsString
    ? new RegExp((prefix as RegExp).source.concat(new RegExp(url).source).replace(/(\\\/\\\/)/g, '/'))
    : new RegExp((prefix as RegExp).source.concat((url as RegExp).source).replace(/(\\\/\\\/)/g, '/'));
};
