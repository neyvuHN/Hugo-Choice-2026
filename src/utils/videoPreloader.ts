/**
 * videoPreloader.ts
 * Preloads WebM nominee videos into browser memory/cache.
 * Called once per screen mount so videos are ready instantly when selected.
 */

const preloadedUrls = new Set<string>();
const preloadedElements = new Map<string, HTMLVideoElement>();

/**
 * Preload a list of video URLs by creating hidden <video> elements.
 * The browser will begin fetching and buffering the video in the background.
 */
export function preloadVideos(urls: string[]): void {
  urls.forEach(url => {
    if (!url || !url.endsWith('.webm')) return;
    if (preloadedUrls.has(url)) return; // already preloaded

    preloadedUrls.add(url);

    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.src = url;
    video.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
    video.setAttribute('aria-hidden', 'true');

    // Append to body temporarily to trigger browser preload
    document.body.appendChild(video);
    video.load();

    // Store reference so GC doesn't collect it before buffering
    preloadedElements.set(url, video);

    // Remove from DOM after buffering starts (keep in memory)
    video.addEventListener('loadeddata', () => {
      if (document.body.contains(video)) {
        document.body.removeChild(video);
      }
    }, { once: true });

    // Fallback: remove after 10s regardless
    setTimeout(() => {
      if (document.body.contains(video)) {
        document.body.removeChild(video);
      }
    }, 10000);
  });
}

/** Extract all .webm URLs from a list of candidates */
export function extractVideoUrls(candidates: Array<{ avatar?: string }>): string[] {
  return candidates
    .map(c => c.avatar || '')
    .filter(url => url.endsWith('.webm'));
}
