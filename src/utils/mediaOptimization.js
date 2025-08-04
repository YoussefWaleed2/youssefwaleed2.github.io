/**
 * Media Optimization Utilities
 * Ready for Cloudflare integration when domain is connected
 */

import { CLOUDFLARE_CONFIG, getOptimizedAssetUrl } from '../config/cloudflare';

// Configuration - easily switch to Cloudflare later
const MEDIA_CONFIG = {
  // Uses Cloudflare config
  get useCloudflare() { return CLOUDFLARE_CONFIG.enabled; },
  get cloudflareZone() { return CLOUDFLARE_CONFIG.zone; },
  
  // Current optimization settings
  enableWebP: true,
  get enableAVIF() { return CLOUDFLARE_CONFIG.enabled && CLOUDFLARE_CONFIG.cdn.images.enableAVIF; },
  enableLazyLoading: true,
  enableProgressive: true
};

/**
 * Detects browser support for modern image formats
 */
export const detectImageSupport = () => {
  if (typeof window === 'undefined') return { webp: false, avif: false };
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return {
    webp: canvas.toDataURL('image/webp').startsWith('data:image/webp'),
    avif: canvas.toDataURL('image/avif').startsWith('data:image/avif')
  };
};

/**
 * Optimizes image URL for current setup and future Cloudflare integration
 */
export const optimizeImageUrl = (src, options = {}) => {
  const {
    width = null,
    height = null,
    quality = CLOUDFLARE_CONFIG.cdn?.images?.defaultQuality || 85,
    format = 'auto',
    fit = 'cover'
  } = options;

  // Use the centralized asset URL function
  return getOptimizedAssetUrl(src, { width, height, quality, format, fit });
};

/**
 * Optimizes video URL for streaming
 */
export const optimizeVideoUrl = (src, options = {}) => {
  // Current setup - return original path
  if (!MEDIA_CONFIG.useCloudflare) {
    return src;
  }
  
  // Future Cloudflare Stream integration
  const { quality = 'auto', format = 'auto' } = options;
  const baseUrl = `https://videodelivery.net/${MEDIA_CONFIG.cloudflareZone}`;
  
  // Add optimization parameters for Cloudflare Stream
  const params = [];
  if (quality !== 'auto') params.push(`quality=${quality}`);
  if (format !== 'auto') params.push(`format=${format}`);
  
  const queryString = params.length > 0 ? `?${params.join('&')}` : '';
  return `${baseUrl}/${src}${queryString}`;
};

/**
 * Creates responsive image srcset for different screen sizes
 */
export const createResponsiveSrcSet = (src, sizes = [400, 800, 1200, 1600]) => {
  return sizes.map(size => {
    const optimizedUrl = optimizeImageUrl(src, { width: size });
    return `${optimizedUrl} ${size}w`;
  }).join(', ');
};

/**
 * Enhanced image loading with optimization
 */
export const createOptimizedImageProps = (src, options = {}) => {
  const {
    alt = '',
    width = null,
    height = null,
    lazy = true,
    responsive = false,
    sizes = [400, 800, 1200, 1600]
  } = options;

  const optimizedSrc = optimizeImageUrl(src, { width, height });
  
  const props = {
    src: optimizedSrc,
    alt,
    loading: lazy ? 'lazy' : 'eager',
    decoding: 'async',
    style: {
      // Hardware acceleration for better performance
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      // Smooth loading transition
      transition: 'opacity 0.3s ease-in-out'
    }
  };

  // Add responsive images if requested
  if (responsive) {
    props.srcSet = createResponsiveSrcSet(src, sizes);
    props.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }

  return props;
};

/**
 * Preload critical images
 */
export const preloadImage = (src, options = {}) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const optimizedSrc = optimizeImageUrl(src, options);
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = optimizedSrc;
    
    // Add to document head for browser optimization
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedSrc;
    document.head.appendChild(link);
  });
};

/**
 * Video optimization for current setup
 */
export const createOptimizedVideoProps = (src, options = {}) => {
  const {
    poster = null,
    autoplay = false,
    muted = true,
    loop = false,
    preload = 'metadata'
  } = options;

  return {
    src: optimizeVideoUrl(src),
    poster: poster ? optimizeImageUrl(poster) : null,
    autoPlay: autoplay,
    muted,
    loop,
    playsInline: true,
    preload,
    style: {
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden'
    }
  };
};

// Export configuration for easy Cloudflare switching
export const updateMediaConfig = (newConfig) => {
  Object.assign(MEDIA_CONFIG, newConfig);
};

export default {
  optimizeImageUrl,
  optimizeVideoUrl,
  createOptimizedImageProps,
  createOptimizedVideoProps,
  preloadImage,
  createResponsiveSrcSet,
  detectImageSupport,
  updateMediaConfig
};