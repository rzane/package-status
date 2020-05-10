export const getDescription = (
  name: string,
  version: string,
  published: boolean
) => {
  if (published) {
    return `${name} version ${version} has already been published\n`;
  } else {
    return `${name} version ${version} has not been published\n`;
  }
};
