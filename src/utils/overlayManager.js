import gsap from 'gsap';

// Keep track of whether overlay is currently being handled
let isHandlingOverlay = false;

/**
 * Utility to handle overlay visibility across the application
 */
export const handleOverlay = () => {
  // If already handling overlay, skip
  if (isHandlingOverlay) return;
  
  try {
    isHandlingOverlay = true;
    
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
          isHandlingOverlay = false;
        }
      });

      // Animate the overlay
      tl.to(overlayElement, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else {
      isHandlingOverlay = false;
    }
  } catch (error) {
    isHandlingOverlay = false;
  }
};

/**
 * Check if splash screen should be shown
 */
export const shouldShowSplash = () => {
  try {
    return !sessionStorage.getItem('hasSeenSplash');
  } catch (error) {
    return false;
  }
};