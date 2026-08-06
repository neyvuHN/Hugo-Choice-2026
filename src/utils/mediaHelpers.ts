/**
 * Sanitizes a path string to match Cloudinary public ID standards.
 * Strips accents, replaces special characters, and handles spaces.
 */
export function sanitizeCloudinaryPath(pathStr: string): string {
  // Clean path: remove leading slash
  let clean = pathStr.startsWith('/') ? pathStr.slice(1) : pathStr;
  
  // Convert Vietnamese accented characters to ASCII
  clean = clean
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

  // Replace '&' with 'and'
  clean = clean.replace(/&/g, 'and');

  // Replace spaces and multiple underscores with a single underscore
  clean = clean.replace(/\s+/g, '_').replace(/_+/g, '_');

  // Remove other invalid characters for Cloudinary public ID
  // Allow alphanumeric, slashes, underscores, hyphens, and dots
  clean = clean.replace(/[^a-zA-Z0-9_.\-\/]/g, '');

  return clean;
}

/**
 * Resolves a local relative media path to its Cloudinary CDN URL if configured,
 * or falls back to the local relative path.
 * 
 * Example:
 *   getMediaUrl('/Nominees/Perfect_duo/Doan Thanh Hau & Hoang Bao Ngoc.webm')
 *   -> 'https://res.cloudinary.com/yourname/video/upload/Nominees/Perfect_duo/Doan_Thanh_Hau_and_Hoang_Bao_Ngoc.webm'
 */
export function getMediaUrl(path: string): string {
  if (!path) return '';

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    // Fallback to local hosting (useful for local development without Cloudinary env vars)
    return path;
  }

  // Sanitize path for Cloudinary
  const cleanPath = sanitizeCloudinaryPath(path);

  // Detect resource type
  const lowerPath = cleanPath.toLowerCase();
  let resourceType = 'image';

  if (
    lowerPath.endsWith('.webm') ||
    lowerPath.endsWith('.mp4') ||
    lowerPath.endsWith('.mov') ||
    lowerPath.endsWith('.mp3') ||
    lowerPath.endsWith('.wav') ||
    lowerPath.endsWith('.ogg') ||
    lowerPath.endsWith('.aac')
  ) {
    resourceType = 'video';
  } else if (
    lowerPath.endsWith('.png') ||
    lowerPath.endsWith('.jpg') ||
    lowerPath.endsWith('.jpeg') ||
    lowerPath.endsWith('.webp') ||
    lowerPath.endsWith('.svg') ||
    lowerPath.endsWith('.gif')
  ) {
    resourceType = 'image';
  } else {
    resourceType = 'raw';
  }

  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${cleanPath}`;
}
