export const generateFilesystemSafeSlug = (
  value: string,
  fallback = 'workspaceos-project'
): string => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return slug.length > 0 ? slug : fallback;
};
