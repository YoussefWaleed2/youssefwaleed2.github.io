/**
 * Cloudflare Configuration
 * Toggle these settings when ready to connect your custom domain
 */

export const CLOUDFLARE_CONFIG = {
  // Set to true when Cloudflare is active with your custom domain
  enabled: false,
  
  // Your domain settings (fill these when ready)
  domain: '', // e.g., 'vzbl.com'
  zone: '', // Your Cloudflare zone ID
  
  // CDN settings
  cdn: {
    // Base URL for assets when Cloudflare is active
    baseUrl: '', // e.g., 'https://cdn.vzbl.com'
    
    // Image optimization settings
    images: {
      enablePolish: true,
      enableWebP: true,
      enableAVIF: true,
      defaultQuality: 85,
      enableLazyLoading: true
    },
    
    // Video optimization settings
    videos: {
      enableStream: false, // Cloudflare Stream (paid)
      defaultQuality: 'auto',
      enableAdaptive: true
    },
    
    // Caching settings
    cache: {
      staticAssets: 31536000, // 1 year
      images: 31536000, // 1 year
      videos: 31536000, // 1 year
      html: 3600 // 1 hour
    }
  },
  
  // Performance optimizations
  performance: {
    enableMinification: true,
    enableBrotli: true,
    enableRocketLoader: false, // Can break React apps
    enableMirage: true, // Image optimization for mobile
    enablePolish: true // Image compression
  },
  
  // Security settings
  security: {
    enableSSL: true,
    sslMode: 'flexible', // or 'full' or 'strict'
    enableHSTS: true,
    enableFirewall: true
  }
};

/**
 * Gets the appropriate base URL for assets
 */
export const getAssetBaseUrl = () => {
  if (CLOUDFLARE_CONFIG.enabled && CLOUDFLARE_CONFIG.cdn.baseUrl) {
    return CLOUDFLARE_CONFIG.cdn.baseUrl;
  }
  return ''; // Use relative paths for current Vercel setup
};

/**
 * Generates optimized URL for assets
 */
export const getOptimizedAssetUrl = (path, options = {}) => {
  const baseUrl = getAssetBaseUrl();
  const fullUrl = `${baseUrl}${path}`;
  
  if (!CLOUDFLARE_CONFIG.enabled) {
    return path; // Return original path for current setup
  }
  
  // Add Cloudflare optimization parameters when active
  const params = new URLSearchParams();
  
  if (options.width) params.append('w', options.width);
  if (options.height) params.append('h', options.height);
  if (options.quality) params.append('q', options.quality);
  if (options.format) params.append('f', options.format);
  
  const queryString = params.toString();
  return queryString ? `${fullUrl}?${queryString}` : fullUrl;
};

/**
 * Instructions for enabling Cloudflare (when ready)
 */
export const CLOUDFLARE_SETUP_INSTRUCTIONS = {
  step1: "Sign up for Cloudflare account at cloudflare.com",
  step2: "Add your custom domain to Cloudflare",
  step3: "Update your domain's nameservers to Cloudflare's",
  step4: "Get your Zone ID from Cloudflare dashboard",
  step5: "Update CLOUDFLARE_CONFIG.enabled to true",
  step6: "Fill in your domain and zone information",
  step7: "Deploy and test the optimizations",
  
  benefits: [
    "Automatic image compression and format conversion",
    "Global CDN for faster loading worldwide", 
    "Free SSL certificate",
    "DDoS protection",
    "100GB/month bandwidth on free tier",
    "Analytics and performance monitoring"
  ]
};

export default CLOUDFLARE_CONFIG;