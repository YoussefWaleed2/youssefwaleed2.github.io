import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Home.css";
import SplashScreen from "../../components/SplashScreen/SplashScreen";
import ReactLenis from "lenis/react";
import Transition from "../../components/Transition/Transition";
import { handleOverlay, shouldShowSplash } from "./../../utils/overlayManager";
import { CDN_CONFIG } from "../../config/cdn";

const Home = () => {
  const videoRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const [showSplash, setShowSplash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false); // Start false for proper transition

  // Unified transition function for consistent animation
  const triggerVideoTransition = useCallback(() => {
    const videoWrapper = videoWrapperRef.current;
    if (!videoWrapper) {
      return;
    }
    
    // For mobile devices, use a more reliable approach
    if (isMobile) {
      // Remove any existing classes first
      videoWrapper.classList.remove('fade-in');
      
      // Force a reflow
      const _ = videoWrapper.offsetHeight;
      
      // Use requestAnimationFrame for better mobile performance
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          videoWrapper.classList.add('fade-in');
          setFadeIn(true);
        });
      });
    } else {
      // Desktop version (original logic)
      videoWrapper.classList.remove('fade-in');
      const _ = videoWrapper.offsetHeight;
      videoWrapper.classList.add('fade-in');
      setFadeIn(true);
    }
  }, [isMobile, setFadeIn]);

  // Handle page transitions (navigation/reload scenarios)
  useEffect(() => {
    // If no splash screen will show, trigger transition after video loads
    if (!shouldShowSplash()) {
      const video = videoRef.current;
      if (video) {
        const handleTransition = () => {
          if (video.readyState >= 3) {
            // Video is ready, trigger transition
            triggerVideoTransition();
          } else {
            // Wait for video to be ready
            const handleCanPlay = () => {
              triggerVideoTransition();
              video.removeEventListener('canplay', handleCanPlay);
            };
            video.addEventListener('canplay', handleCanPlay);
            
            // Mobile-specific fallbacks
            if (isMobile) {
              // Also listen for loadeddata event (more reliable on mobile)
              const handleLoadedData = () => {
                triggerVideoTransition();
                video.removeEventListener('loadeddata', handleLoadedData);
                video.removeEventListener('canplay', handleCanPlay);
              };
              video.addEventListener('loadeddata', handleLoadedData);
              
              // Longer timeout for mobile
              setTimeout(() => {
                video.removeEventListener('canplay', handleCanPlay);
                video.removeEventListener('loadeddata', handleLoadedData);
                triggerVideoTransition();
              }, 4000);
            } else {
              // Fallback timeout for desktop
              setTimeout(() => {
                video.removeEventListener('canplay', handleCanPlay);
                triggerVideoTransition();
              }, 2000);
            }
          }
        };
        
        // Small delay to ensure proper setup
        setTimeout(handleTransition, 100);
      }
    }
  }, [isMobile, triggerVideoTransition]); // Include all dependencies

  // Check if device is mobile and disable scrolling
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // On home page, prevent scrolling on mobile
      if (mobile) {
        // Apply fixed position and prevent scrolling
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.position = 'fixed';
        document.body.style.position = 'fixed';
        document.documentElement.style.width = '100%';
        document.body.style.width = '100%';
        
        // Add no-scroll class
        document.body.classList.add('no-scroll');
        document.documentElement.classList.add('no-scroll');
        
        // Set full screen size immediately for mobile
        if (videoWrapperRef.current) {
          videoWrapperRef.current.style.width = '100%';
          videoWrapperRef.current.style.height = '100%';
          videoWrapperRef.current.style.maxWidth = '100vw';
          videoWrapperRef.current.style.maxHeight = '100vh';
        }
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Add a listener to prevent touchmove events on mobile
    const preventScroll = (e) => {
      // Check if the touch event is on a menu element - if so, allow it
      if (e.target.closest('.menu') || 
          e.target.closest('nav') || 
          e.target.closest('button') || 
          e.target.tagName === 'BUTTON' ||
          e.target.closest('.menu-button') ||
          e.target.closest('.navigation-menu') ||
          e.target.closest('.menu-toggle-close') ||
          e.target.closest('.close-btn') ||
          e.target.closest('.menu-overlay') ||
          e.target.closest('.menu-overlay-bar') ||
          e.target.closest('.menu-links') ||
          e.target.closest('svg') ||
          e.target.closest('path') ||
          e.target.tagName === 'svg' ||
          e.target.tagName === 'path' ||
          e.target.classList.contains('close-btn') ||
          e.target.classList.contains('menu-toggle-close') ||
          e.target.parentElement?.classList.contains('close-btn') ||
          e.target.parentElement?.classList.contains('menu-toggle-close')) {
        // Always allow event propagation for menu elements
        return true;
      }
      
      // Only prevent default if we're on the Home page
      if (window.location.pathname === '/' || window.location.pathname === '') {
        e.preventDefault();
        return false;
      }
      
      return true;
    };
    
    if (isMobile) {
      document.addEventListener('touchmove', preventScroll, { passive: false });
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('touchmove', preventScroll);
      
      // Restore scrolling when component unmounts
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.position = '';
      document.body.style.position = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.documentElement.style.width = '';
      document.body.style.width = '';
      
      // Remove no-scroll class
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, [isMobile]);
  
  // iOS-specific scroll prevention - in a separate useEffect
  useEffect(() => {
    // Function to prevent touch events
    const preventTouch = (e) => {
      // Check if the touch event is on a menu element - if so, allow it
      if (e.target.closest('.menu') || 
          e.target.closest('nav') || 
          e.target.closest('button') || 
          e.target.tagName === 'BUTTON' ||
          e.target.closest('.menu-button') ||
          e.target.closest('.navigation-menu') ||
          e.target.closest('.menu-toggle-close') ||
          e.target.closest('.close-btn') ||
          e.target.closest('.menu-overlay') ||
          e.target.closest('.menu-overlay-bar') ||
          e.target.closest('.menu-links') ||
          e.target.closest('svg') ||
          e.target.closest('path') ||
          e.target.tagName === 'svg' ||
          e.target.tagName === 'path' ||
          e.target.classList.contains('close-btn') ||
          e.target.classList.contains('menu-toggle-close') ||
          e.target.parentElement?.classList.contains('close-btn') ||
          e.target.parentElement?.classList.contains('menu-toggle-close')) {
        // Always allow event propagation for menu elements
        return true;
      }
      
      // Only prevent default if we're on the Home page
      if (window.location.pathname === '/' || window.location.pathname === '') {
        e.preventDefault();
        return false;
      }
      
      return true;
    };
    
    if (isMobile) {
      // Apply these techniques specifically for iOS
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        // Use a more aggressive approach for iOS
        document.addEventListener('touchstart', preventTouch, { passive: false });
        document.addEventListener('touchmove', preventTouch, { passive: false });
        document.addEventListener('touchend', preventTouch, { passive: false });
        
        // iOS-specific style for body
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '-webkit-fill-available';
        document.body.style.overscrollBehavior = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
        
        // Add specific handling for close button on iOS
        const handleCloseButtonTouchForIOS = () => {
          // Find all close button elements
          const closeButtons = document.querySelectorAll('.menu-toggle-close, .close-btn');
          
          // Add specific event listeners for these elements
          closeButtons.forEach(btn => {
            if (btn) {
              // Ensure all touch events pass through on close buttons
              btn.style.touchAction = 'auto';
              btn.style.zIndex = '9999';
              
              // Extra handling for iOS touch events on close button
              btn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: false });
              btn.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: false });
              btn.addEventListener('touchend', (e) => e.stopPropagation(), { passive: false });
            }
          });
        };
        
        // Run the handler after a short delay to ensure DOM is ready
        setTimeout(handleCloseButtonTouchForIOS, 1000);
      }
    }
    
    return () => {
      // Remove iOS-specific event listeners
      document.removeEventListener('touchstart', preventTouch);
      document.removeEventListener('touchmove', preventTouch);
      document.removeEventListener('touchend', preventTouch);
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, [isMobile]);

  // Set page title
  useEffect(() => {
    document.title = "VZBL";
  }, []);

  // Check if we should show the splash screen
  useEffect(() => {
    // Force clear the splash screen on each page mount to handle navigation
    handleOverlay();
    
    // Check if splash should be shown
    const shouldShow = shouldShowSplash();
    setShowSplash(shouldShow);
    
    // Start video loading immediately if no splash, or with a delay if splash is showing
    if (!shouldShow) {
      // No splash, start video immediately and play it
      const video = videoRef.current;
      if (video) {
        video.load();
        // Since there's no splash screen, start playing once video can play
        const handleNoSplashPlay = () => {
          video.currentTime = 0;
          video.play().catch(() => {
            setVideoError(true);
            setTimeout(() => setFadeIn(true), 100);
          });
          video.removeEventListener('canplay', handleNoSplashPlay);
        };
        video.addEventListener('canplay', handleNoSplashPlay);
        
        // Store cleanup function
        return () => {
          handleOverlay();
          video.removeEventListener('canplay', handleNoSplashPlay);
        };
      }
    } else {
      // Splash is showing, start video loading after 1 second (early in splash animation)
      const videoLoadTimer = setTimeout(() => {
        const video = videoRef.current;
        if (video) {
          video.load();
        }
      }, 500); // Start loading 1 second into splash animation for large webm file
      
      return () => {
        clearTimeout(videoLoadTimer);
        handleOverlay();
      };
    }
    
    // Add a cleanup function to force hide the overlay when unmounting
    return () => {
      handleOverlay();
    };
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem('hasSeenSplash', 'true');
    } catch (error) {
      console.error("Error setting sessionStorage:", error);
    }
    
    // First ensure fadeIn is false before showing video wrapper
    setFadeIn(false);
    setShowSplash(false);
    handleOverlay();
    
    // Ensure video starts from beginning and plays only after splash is done
    const video = videoRef.current;
    
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {
        setVideoError(true);
        setTimeout(() => setFadeIn(true), 100);
      });
    }

    // Force the video wrapper to start with opacity 0, then fade in
    const delay = isMobile ? 200 : 100; // Longer delay for mobile
    setTimeout(() => {
      const videoWrapper = videoWrapperRef.current;
      if (videoWrapper) {
        // Force opacity to 0 with !important to override any CSS
        videoWrapper.style.setProperty('opacity', '0', 'important');
        
        // Force reflow
        const _ = videoWrapper.offsetHeight;
        
        // Wait for video to be ready on mobile before triggering transition
        if (isMobile) {
          const video = videoRef.current;
          if (video && video.readyState < 3) {
            // Video not ready on mobile, wait for it
            const handleMobileReady = () => {
              videoWrapper.style.removeProperty('opacity');
              triggerVideoTransition();
              video.removeEventListener('canplay', handleMobileReady);
              video.removeEventListener('loadeddata', handleMobileReady);
            };
            
            video.addEventListener('canplay', handleMobileReady);
            video.addEventListener('loadeddata', handleMobileReady);
            
            // Fallback for mobile
            setTimeout(() => {
              video.removeEventListener('canplay', handleMobileReady);
              video.removeEventListener('loadeddata', handleMobileReady);
              videoWrapper.style.removeProperty('opacity');
              triggerVideoTransition();
            }, 2000);
          } else {
            // Mobile video ready or no video
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                videoWrapper.style.removeProperty('opacity');
                triggerVideoTransition();
              });
            });
          }
        } else {
          // Desktop version (original logic)
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              videoWrapper.style.removeProperty('opacity');
              triggerVideoTransition();
            });
          });
        }
      }
    }, delay);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add error handler for video
    const handleVideoError = () => {
      setVideoError(true);
      // Trigger fade-in for fallback image
      setTimeout(() => setFadeIn(true), 100);
    };
    
    // Handle successful loading
    const handleCanPlay = () => {
      setVideoLoaded(true);
      
      // Set full screen size for video once loaded
      if (videoWrapperRef.current) {
        videoWrapperRef.current.style.width = '100%';
        videoWrapperRef.current.style.height = '100%';
      }
      
      // DO NOT auto-play here - let handleSplashComplete control playback
      // Video is ready, trigger fade-in effect
      setTimeout(() => setFadeIn(true), 100);
    };
    
    // Add event listeners
    video.addEventListener('error', handleVideoError);
    video.addEventListener('canplay', handleCanPlay);
    
    // Set initial size and position
    if (isMobile && videoWrapperRef.current) {
      videoWrapperRef.current.style.width = '100%';
      videoWrapperRef.current.style.height = '100%';
    }
    
    // Extended safety timeout for video loading - give more time for webm files
    const loadTimeout = setTimeout(() => {
      if (!videoLoaded) {
        setVideoError(true);
        setTimeout(() => setFadeIn(true), 100);
      }
    }, 8000);
    
    return () => {
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('canplay', handleCanPlay);
      clearTimeout(loadTimeout);
    };
  }, [videoLoaded, isMobile]);

  // CDN video URLs - globally distributed and fast
  const mobileVideoPath = CDN_CONFIG.getHomeVideoUrl('mobile');
  const desktopVideoPath = CDN_CONFIG.getHomeVideoUrl('desktop');
  const firstFramePath = "";

  return (
    <ReactLenis root>
      <div className="page home">
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <div 
          ref={videoWrapperRef}
          className={`video-wrapper ${videoError ? 'video-error' : ''} ${fadeIn ? 'fade-in' : ''}`}
          style={{ 
            width: '100%', 
            height: '100%',
            display: showSplash ? 'none' : 'block' // Completely hidden during splash
          }}
        >
          {!videoError ? (
            <video 
              ref={videoRef}
              className="home-video"
              poster={firstFramePath}
              muted
              loop 
              playsInline
              preload="auto"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
            >
              <source src={isMobile ? mobileVideoPath : desktopVideoPath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="video-fallback">
              <img 
                src={firstFramePath} 
                alt="VZBL Background" 
                className="fallback-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </div>
    </ReactLenis>
  );
};

const HomeWithTransition = Transition(Home);
export default HomeWithTransition;
