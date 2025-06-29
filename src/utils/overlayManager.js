import gsap from 'gsap';

/**
 * Utility to handle overlay visibility across the application
 */
export const handleOverlay = () => {
  try {
    // Force clear the splash screen
    const overlayElement = document.querySelector('.overlay');
    if (overlayElement) {
      // First set display to flex (or block) if it's none
      if (overlayElement.style.display === 'none') {
        overlayElement.style.display = 'flex';
      }

      // Create a GSAP timeline for the overlay animation
      const tl = gsap.timeline({
        onComplete: () => {
          // Only hide the overlay after animation completes
          overlayElement.style.display = 'none';
        }
      });

      // Animate the overlay
      tl.to(overlayElement, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  } catch (error) {
    console.error('Error in handleOverlay:', error);
  }
};

/**
 * Check if splash screen should be shown
 */
export const shouldShowSplash = () => {
  try {
    // Clear the sessionStorage for debugging
    sessionStorage.removeItem('hasSeenSplash');
    
    // Always return true for debugging
    return true;
  } catch {
    // If sessionStorage is not available, default to true
    return true;
  }
};