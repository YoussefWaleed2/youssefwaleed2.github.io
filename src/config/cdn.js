/**
 * CDN Configuration for Video Assets
 * Using GitHub Releases + jsDelivr CDN for global distribution
 */

export const CDN_CONFIG = {
  // GitHub repository information
  username: 'ywsosman',
  repo: 'vzbl',
  release: 'videos-2025-01-08',
  
  // Base CDN URL
  get baseUrl() {
    return `https://github.com/${this.username}/${this.repo}/releases/download/${this.release}`;
  },
  
  // Video URLs
  videos: {
    // Main home video
    home: {
      mobile: 'new.mp4',
      desktop: 'new.mp4'
    },
    
    // Project videos (add as you upload them to releases)
    projects: {
      // Marketing videos
      'bunker': 'Bunker.webm',
      'crmbz': 'CRMBZ.webm', 
      'momochi': 'Momochi.webm',
      'munch-shake': 'Munch.Shake.webm',
      'nev': 'Nev.webm',
      'pyramids': 'Pyramids.webm',
      'bouche': 'Bouche.webm',
      
      // Advertising videos
      'apero-emit': 'Apero.with.Emit.Porsche.Edition.webm',
      'emit-leopelle': 'EmitxLeopelle.webm',
      'leopelle': 'Leopellee.webm',
      'shawerma': 'SHAWERMA.EL.REEM.webm',
      'yazis-world': 'Yazi.s.World.webm',
      
      // Branding videos
      'epos': 'Epos.webm',
      'telofil': 'Telofil.webm',
      'venti': 'VENTI.webm',
      'dippys': 'dippys.webm',
      'hlep': 'hlep.logo.animation.webm',
      'lazurde': 'lazurde.webm',
      'merkur': 'merker.webm',
      'ozirea': 'ozirea.webm'
    }
  },
  
  // Helper function to get video URL
  getVideoUrl(path) {
    return `${this.baseUrl}/${path}`;
  },
  
  // Helper for home videos
  getHomeVideoUrl(device = 'desktop') {
    return this.getVideoUrl(this.videos.home[device]);
  },
  
  // Helper for project videos
  getProjectVideoUrl(projectName) {
    const videoFile = this.videos.projects[projectName];
    return videoFile ? this.getVideoUrl(videoFile) : null;
  },
  
  // Simplified function to get CDN URL from any video path or filename
  getVideoFromPath(path) {
    // If it's already a CDN URL, return as is
    if (path.startsWith('http')) {
      return path;
    }
    
    // Extract filename from path and map to correct CDN filename
    const filename = path.split('/').pop();
    
    // Simple mapping from problematic filenames to correct CDN filenames
    const fileMapping = {
      // Marketing videos - main hover files
      'BOUCHÉE.webm': 'Bouche.webm',
      'Bouchée.webm': 'Bouche.webm',
      
      // Munch & Shake variants
      'Munch & Shake.webm': 'Munch.Shake.webm', // Main hover video
      'Munch & Shakee.webm': 'Munch.Shakee.webm', // Single project detail video
      
      // Other single project detail videos  
      '12 MOMOCHI.webm': '12.MOMOCHI.webm',
      'Emit x Leopelle.webm': 'Emit.x.Leopelle.webm',
      'EmitxLeopelle.webm': 'EmitxLeopelle.webm',
      'Leopellee.webm': 'Leopellee.webm',
      'Apero with Emit.webm': 'Apero.with.Emit.Porsche.Edition.webm',
      'Apero with Emit (Porsche Edition).webm': 'Apero.with.Emit.Porsche.Edition.webm',
      'hlep logo animation.webm': 'hlep.logo.animation.webm',
      
      // Other mappings
      'SHAWERMA EL REEM.webm': 'SHAWERMA.EL.REEM.webm',
      'Yazi\'s World.webm': 'Yazi.s.World.webm',
      'Yazi\'s Worldd.webm': 'Yazi.s.Worldd.webm'
    };
    
    // Use mapped filename if exists, otherwise use original filename
    const cdnFilename = fileMapping[filename] || filename;
    
    return this.getVideoUrl(cdnFilename);
  }
};

/**
 * Instructions for adding new videos:
 * 
 * 1. Upload video to GitHub Release: https://github.com/ywsosman/vzbl/releases
 * 2. Add filename to CDN_CONFIG.videos
 * 3. Use getVideoUrl() or helper functions in components
 * 
 * Benefits:
 * - Global CDN with 100+ edge locations
 * - No file size limits
 * - No custom domain required
 * - Free forever
 * - Automatic compression and optimization
 */

export default CDN_CONFIG;