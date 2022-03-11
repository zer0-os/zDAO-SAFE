export const shorten = (str: string, limit: number) => {
  return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
};
