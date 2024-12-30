export const validateAvatar = (url) => {
  if (!url) return true; // Empty URL is valid (will use default avatar)

  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol) &&
      /\.(jpg|jpeg|png|gif|webp)$/i.test(parsedUrl.pathname);
  } catch {
    return false;
  }
};