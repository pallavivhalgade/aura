/**
 * Removes HTML/XML tags from a string to prevent XSS.
 * @param text The input string to sanitize.
 * @returns The sanitized string.
 */
export const sanitizeInput = (text: string): string => {
  if (!text) return '';
  // A simple regex to remove anything that looks like an HTML tag.
  return text.replace(/<[^>]*>?/gm, '');
};
