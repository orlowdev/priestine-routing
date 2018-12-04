/**
 * Merge given prefix with given string. If at least one of them is a RegExp, new RegExp will be returned.
 * @param {string | RegExp} prefix
 * @param {string | RegExp} url
 * @returns {IHttpMatcher}
 */
export const mergePrefixAndUrl = (prefix: string | RegExp, url: string | RegExp): string | RegExp => {
  if (!prefix) {
    return url;
  }

  const prefixIsString = typeof prefix === 'string';
  const urlIsString = typeof url === 'string';

  if (prefixIsString) {
    return urlIsString
      ? (prefix as string).concat(url as string)
      : new RegExp(new RegExp(prefix).source.concat((url as RegExp).source));
  }

  return urlIsString
    ? new RegExp((prefix as RegExp).source.concat(new RegExp(url).source))
    : new RegExp((prefix as RegExp).source.concat((url as RegExp).source));
};
