import React, { useState, useEffect, useRef, Component } from 'react';
import Transition from '../../components/Transition/Transition';
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import SplitType from 'split-type';
import './About.css';
import MobileAbout from './MobileAbout'; // Import the mobile component
import { handleOverlay } from "./../../utils/overlayManager";
import { togglePersonBackground } from '../../utils/personDetection';

// Detect Safari browser for specific optimizations
const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// Detect MacBook specifically
const isMacBook = () => {
  return /Mac/i.test(navigator.userAgent) && !(/iPad|iPhone|iPod/.test(navigator.userAgent));
};

// Add debounce function for better performance
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Error Boundary component
class ErrorBoundary extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'white', background: 'black', minHeight: '100vh' }}>
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Mobile detection function
const detectMobileOrTablet = () => {
  const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || window.innerWidth <= 1024;
};

const About = () => {
  const [isReady, setIsReady] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [documentReady, setDocumentReady] = useState(false);
  const containerRef = useRef(null);
  const pageRef = useRef(null);
  const titleRef = useRef(null);
  const asteriskRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  
  // Custom smooth scrolling refs
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const scrollRafRef = useRef(null);
  const isScrollingRef = useRef(false);
  
  // Refs for About section text
  const aboutLeftRef = useRef(null);
  const aboutRightRef = useRef(null);
  const aboutTextContainerRef = useRef(null);
  const aboutTextsRef = useRef([]);
  
  // Refs for images and skeleton loaders
  const imageRefs = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState([]);

  // Track scroll position to trigger animations
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Create images array with conditional first image based on screen size
  const images = Array.from({ length: 13 }, (_, i) => {
    if (i === 0) {
      // Use full screen version for screens 1450px and above
      return windowWidth >= 1450 ? `/about/1 FullScreen.webp` : `/about/${i + 1}.webp`;
    }
    return `/about/${i + 1}.webp`;
  });

  // Preload images function to improve performance
  const preloadImages = async () => {
    try {
      const promises = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false); // Resolve even on error to continue
        });
      });
      
      const results = await Promise.all(promises);
      setImagesLoaded(results);
    } catch (error) {
      setImagesLoaded(Array(images.length).fill(true)); // Fallback
    }
  };

  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  // Initialize image refs arrays and start preloading
  useEffect(() => {
    imageRefs.current = Array(images.length).fill().map(() => React.createRef());
    setImagesLoaded(Array(images.length).fill(false));
    preloadImages(); // Start preloading immediately
  }, [images.length, windowWidth]); // Add windowWidth dependency to reload images when screen size changes

  useEffect(() => {
    document.title = "About Us | VZBL";
  }, []);

  // Set window width and check device type on initial render and window resize
  useEffect(() => {
    const handleResize = () => {
      // Add resizing class to body during resize
      document.body.classList.add('resizing');
      
      // Set window width and check device type
      setWindowWidth(window.innerWidth);
      setIsMobileOrTablet(detectMobileOrTablet());
      
      // Remove resizing class after a short delay
      setTimeout(() => {
        document.body.classList.remove('resizing');
      }, 300);
    };
    
    // Set initial window width and device type
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.classList.remove('resizing');
    };
  }, []);

  // All desktop-specific code in these useEffects will only run if !isMobileOrTablet
  // Effect for desktop GSAP animations
  useEffect(() => {
    if (isMobileOrTablet) return;
    
    // Register GSAP plugins
    gsap.registerPlugin(CustomEase);
    const customEase = CustomEase.create("custom", ".87,0,.13,1");

    // Initialize text animation
    if (titleRef.current && subtitleRef.current && descriptionRef.current && asteriskRef.current) {
      try {
        // Split text for animation with additional options to prevent spacing issues
        const titleSplit = new SplitType(titleRef.current, { 
          types: 'chars',
          tagName: 'span',
          charClass: 'title-char' // Custom class for targeting
        });
        const subtitleSplit = new SplitType(subtitleRef.current, { 
          types: 'chars',
          tagName: 'span' 
        });
        const descriptionSplit = new SplitType(descriptionRef.current, { 
          types: 'lines',
          tagName: 'span' 
        });
        
        // Set initial states
        if (titleSplit.chars && subtitleSplit.chars && descriptionSplit.lines) {
          gsap.set([titleSplit.chars, subtitleSplit.chars, descriptionSplit.lines], {
            y: '100%',
            opacity: 0
          });
          
          // Additional setup to prevent character spacing issues
          gsap.set(titleSplit.chars, {
            display: 'inline-block',
            margin: '0 -0.02em 0 0' // Slight negative margin to pull characters together
          });
        }
        
        gsap.set(asteriskRef.current, {
          y: '100%',
          opacity: 0
        });

        // Set initial state for first image
        if (imageRefs.current[0]?.current) {
          gsap.set(imageRefs.current[0].current, {
            scale: 1.2,
            opacity: 1,
            filter: "blur(5px)"
          });
        }

        // Fixed timing animations
        setTimeout(() => {
          // Animate title
          if (titleSplit.chars) {
            gsap.to(titleSplit.chars, {
              y: '0%',
              opacity: 1,
              duration: 1,
              stagger: 0.03,
              ease: customEase,
              onComplete: () => {
                // Ensure characters aren't clipped after animation completes
                gsap.set(titleSplit.chars, {
                  overflow: 'visible',
                  width: 'auto',
                  clearProps: 'overflow,width'
                });
                
                // Fix for S letter specifically
                if (titleRef.current) {
                  titleRef.current.style.overflow = 'visible';
                  titleRef.current.style.paddingRight = '30px';
                  titleRef.current.style.width = 'auto';
                  titleRef.current.style.maxWidth = '90%';
                }
              }
            });
          }
          
          // Animate the asterisk along with the last chars of the title
          if (asteriskRef.current) {
            gsap.to(asteriskRef.current, {
              y: '0%',
              opacity: 1,
              duration: 1,
              ease: customEase
            });
          }

          // Animate first image with title
          if (imageRefs.current[0]?.current) {
            gsap.to(imageRefs.current[0].current, {
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.5,
              ease: customEase
            });
          }

          // Animate subtitle
          if (subtitleSplit.chars) {
            gsap.to(subtitleSplit.chars, {
              y: '0%',
              opacity: 1,
              duration: 0.8,
              stagger: 0.02,
              ease: customEase,
              delay: 0.2
            });
          }

          // Animate description
          if (descriptionSplit.lines) {
            gsap.to(descriptionSplit.lines, {
              y: '0%',
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: customEase,
              delay: 0.5
            });
          }
        }, 300);
      } catch (error) {
      }
    }
    
    // Initialize about section text elements
    if (aboutLeftRef.current && aboutRightRef.current && aboutTextContainerRef.current) {
      gsap.set([aboutLeftRef.current, aboutRightRef.current], {
        opacity: 0,
        x: (index) => index === 0 ? -50 : 50
      });
      
      if (aboutTextsRef.current.length > 0) {
        const validTexts = aboutTextsRef.current.filter(ref => ref);
        if (validTexts.length > 0) {
          gsap.set(validTexts, {
            opacity: 0,
            y: 30
          });
        }
      }
    }
    
    // Set initial state for images (except first one)
    imageRefs.current.forEach((ref, index) => {
      if (ref?.current && index > 0) {
        gsap.set(ref.current, {
          scale: 1,
          opacity: 1
        });
      }
    });
    
    // Return cleanup function to reset styles when component unmounts
    return () => {
      // Reset all image styles on unmount
      imageRefs.current.forEach((ref) => {
        if (ref?.current) {
          gsap.set(ref.current, {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            clearProps: "all" // Clear all GSAP properties
          });
        }
      });
    };
  }, [isReady, isMobileOrTablet]);

  // Smooth scroll to function
  const smoothScrollTo = (targetX) => {
    if (!pageRef.current) return;
    
    // Set target scroll position
    targetScrollRef.current = targetX;
    
    // If animation is already running, just update the target
    if (isScrollingRef.current) return;
    
    // Set scrolling state
    isScrollingRef.current = true;
    
    // Start smooth scroll animation
    const animateScroll = () => {
      // Cancel any existing animation
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      
      // Current scroll position
      currentScrollRef.current = pageRef.current.scrollLeft;
      
      // Calculate distance to target
      const distance = targetScrollRef.current - currentScrollRef.current;
      
      // If we're close enough to target, snap to it and stop
      if (Math.abs(distance) < 0.5) {
        pageRef.current.scrollLeft = targetScrollRef.current;
        isScrollingRef.current = false;
        return;
      }
      
      // Ease toward target (reduced for smoother scrolling)
      const move = distance * 0.04; // Reduced from 0.1 for smoother movement
      
      // Update scroll position
      pageRef.current.scrollLeft += move;
      
      // Update tracking value for animations
      setScrollPosition(pageRef.current.scrollLeft);
      
      // Continue animation
      scrollRafRef.current = requestAnimationFrame(animateScroll);
    };
    
    // Start animation
    scrollRafRef.current = requestAnimationFrame(animateScroll);
  };

  // Add these at the top where the other refs are
  const lastTouchX = useRef(0);
  const touchStartX = useRef(0);

  // Remove any unused refs that may be causing conflicts
  const wheelAnimationRef = useRef(null);
  const isWheelAnimating = useRef(false);
  
  // Custom wheel handler with very simple, reliable scrolling
  const handleWheel = (e) => {
    if (!pageRef.current) return;
    
    e.preventDefault();
    
    // Get the delta and apply a multiplier
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    const scrollAmount = delta * 1.5;
    
    // Simply update the scroll position - basic approach that always works
    pageRef.current.scrollLeft += scrollAmount;
  };
  
  // Simple touch start handler
  const handleTouchStart = (e) => {
    if (!pageRef.current) return;
    
    // Just store the initial touch position
    touchStartX.current = e.touches[0].clientX;
    lastTouchX.current = touchStartX.current;
  };
  
  // Simple touch move handler
  const handleTouchMove = (e) => {
    if (!pageRef.current) return;
    
    const touchX = e.touches[0].clientX;
    const deltaX = lastTouchX.current - touchX;
    
    // Direct scrolling - most reliable approach
    pageRef.current.scrollLeft += deltaX;
    
    e.preventDefault();
    lastTouchX.current = touchX;
  };
  
  // Simple touch end handler
  const handleTouchEnd = (e) => {
    // No momentum or special handling - keep it simple
  };

  // Effect for desktop horizontal scrolling setup - with custom smooth scrolling
  useEffect(() => {
    if (isMobileOrTablet || !containerRef.current || !pageRef.current) return;
    
    // Calculate total width precisely - make it exactly match the content
    const sectionWidth = window.innerWidth;
    // Reduce width to exactly match the last image with no extra space
    const totalWidth = sectionWidth * (images.length - 0.7); // Greater reduction to eliminate black space
    
    // Desktop horizontal scroll setup - set exact width
    containerRef.current.style.width = `${totalWidth}px`;
    
    // Force the sections to be exactly viewport width plus overlap
    const sections = document.querySelectorAll('.about-section');
    if (sections && sections.length > 0) {
      sections.forEach((section, index) => {
        if (section) {
          // Make sections wider than viewport to prevent gaps when moving
          section.style.width = `${sectionWidth}px`;
          section.style.margin = '0';
          section.style.display = 'block';
          
          // Position sections with precise absolute positioning
          section.style.position = 'absolute';
          section.style.left = `${index * sectionWidth}px`;
          section.style.top = '0';
          
          // Set z-index for overlay effect - higher index = higher z-index
          // This ensures later sections will appear on top of earlier ones
          section.style.zIndex = index + 10;
        }
      });
    }
    
    // Setup pageRef for scrolling
    if (pageRef.current) {
      pageRef.current.style.overflowX = 'scroll';
      pageRef.current.style.overflowY = 'hidden';
      pageRef.current.style.width = '100vw';
      pageRef.current.style.height = '100vh';
      pageRef.current.style.scrollBehavior = 'auto'; // Required for custom smoothing
      
      // Set scroll snap for better alignment with each section
      pageRef.current.style.scrollSnapType = 'x mandatory';
    }

    // Calculate the maximum allowed scroll position (prevent scrolling beyond content)
    const maxScrollPosition = totalWidth - sectionWidth;

    // Create our own animation loop for smooth scrolling
    const smoothScrollAnimation = () => {
      requestAnimationFrame(smoothScrollAnimation);
      
      // If we're not actively smooth scrolling with wheel/touch,
      // still update based on native scroll position (for scrollbar dragging)
      if (!isScrollingRef.current && pageRef.current) {
        currentScrollRef.current = pageRef.current.scrollLeft;
        targetScrollRef.current = pageRef.current.scrollLeft;
        setScrollPosition(currentScrollRef.current);
      }
      
      // Get sections starting from third image (index 2)
      const thirdImageAndBeyond = Array.from(sections).slice(2);
      
      // Get trigger position (left edge of third image)
      const thirdImageSection = sections[2];
      
      // Calculate how much to move based on scroll position
      if (thirdImageSection) {
        // How far we've scrolled past the second image
        const scrollPastSecondImage = Math.max(0, currentScrollRef.current - sectionWidth + 200);
        
        // Calculate movement amount proportional to scroll
        const moveAmount = -Math.min(scrollPastSecondImage * 0.7, sectionWidth * 0.7);
        
        // Apply the same transform to third image and all subsequent images with faster transition
        gsap.to(thirdImageAndBeyond, {
          x: moveAmount,
          duration: 0.15,
          ease: "power1.out",
          overwrite: true
        });
      }
    };
    
    // Start the animation
    const animationFrameId = requestAnimationFrame(smoothScrollAnimation);
    
    // Modified smooth scroll function with bounds checking
    const boundedSmoothScrollTo = (targetX) => {
      // Clamp the target position to valid bounds
      const boundedTarget = Math.max(0, Math.min(targetX, maxScrollPosition));
      
      // Call the original smoothScrollTo with the bounded value
      smoothScrollTo(boundedTarget);
    };
    
    // Add direct scroll listener for scrollbar dragging
    const handleScroll = () => {
      if (!containerRef.current) return;

      // Calculate current section based on scroll position
      const scrollX = containerRef.current.scrollLeft;
      const sectionWidth = window.innerWidth;
      const newSection = Math.floor(scrollX / sectionWidth);
      
      // Update current section if changed
      if (newSection !== currentSection) {
        setCurrentSection(newSection);
      }
      
      // Existing scroll handling code...
      setScrollPosition(scrollX);
    };
    
    pageRef.current.addEventListener('scroll', handleScroll, { passive: true });
    
    // Custom wheel handler for smooth scrolling with improved edge behavior
    const handleWheel = (e) => {
      if (!pageRef.current) return;
      
      e.preventDefault();
      
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      // Reduce speed multiplier for smoother scrolling
      const normalizedDelta = delta * 1.8; // Reduced from 3.5 for smoother movement
      
      // Calculate the proposed new target
      const proposedTarget = targetScrollRef.current + normalizedDelta;
      
      // Special case for reaching bounds - respond more quickly at edges
      if (proposedTarget < 0 || proposedTarget > maxScrollPosition) {
        // We're trying to scroll beyond the bounds - apply immediate resistance
        // This creates a "bounce" feel at the edges with faster response
        const resistance = 0.3; // Lower = more resistance at edges
        const boundedDelta = normalizedDelta * resistance;
        
        // Apply with less easing for quicker response
        if (isScrollingRef.current) {
          // Cancel current animation for faster response at edges
          isScrollingRef.current = false;
          if (scrollRafRef.current) {
            cancelAnimationFrame(scrollRafRef.current);
          }
        }
        
        // Direct scroll with minimal easing at bounds
        boundedSmoothScrollTo(targetScrollRef.current + boundedDelta);
      } else {
        // Normal smooth scrolling within bounds
        boundedSmoothScrollTo(proposedTarget);
      }
    };
    
    // Smooth touch handling with improved edge response
    let touchStartX = 0;
    let lastTouchX = 0;
    let touchVelocity = 0;
    let lastTouchTime = 0;
    
    const handleTouchStart = (e) => {
      if (!pageRef.current) return;
      
      // Cancel any ongoing smooth scrolling
      isScrollingRef.current = false;
      
      touchStartX = e.touches[0].clientX;
      lastTouchX = touchStartX;
      lastTouchTime = Date.now();
      touchVelocity = 0;
    };
    
    const handleTouchMove = (e) => {
      if (!pageRef.current) return;
      
      const touchX = e.touches[0].clientX;
      const deltaX = lastTouchX - touchX;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTouchTime;
      
      // Calculate touch velocity for momentum
      if (timeDelta > 0) {
        touchVelocity = deltaX / timeDelta;
      }
      
      // Check if we're at the boundaries to add resistance
      const currentPos = pageRef.current.scrollLeft;
      let effectiveDelta = deltaX * 1.2;
      
      // Add resistance when trying to scroll past the edges
      if ((currentPos <= 0 && deltaX < 0) || (currentPos >= maxScrollPosition && deltaX > 0)) {
        effectiveDelta *= 0.3; // Significant resistance at edges
      }
      
      // Update target position directly
      targetScrollRef.current += effectiveDelta;
      
      // Apply immediately without easing during touch
      pageRef.current.scrollLeft += effectiveDelta;
      currentScrollRef.current = pageRef.current.scrollLeft;
      
      e.preventDefault();
      lastTouchX = touchX;
      lastTouchTime = currentTime;
    };
    
    const handleTouchEnd = (e) => {
      // Check if we're already at boundaries
      const currentPos = pageRef.current.scrollLeft;
      
      if (currentPos < 0) {
        // Snap back to start with animation
        boundedSmoothScrollTo(0);
        return;
      } else if (currentPos > maxScrollPosition) {
        // Snap back to end with animation
        boundedSmoothScrollTo(maxScrollPosition);
        return;
      }
      
      // Apply momentum based on final velocity, but check boundaries
      if (Math.abs(touchVelocity) > 0.1) {
        const momentum = touchVelocity * 100; // Adjust for stronger/weaker momentum
        boundedSmoothScrollTo(targetScrollRef.current + momentum);
      }
      
      touchVelocity = 0;
    };
    
    // Add event listeners
    pageRef.current.addEventListener('wheel', handleWheel, { passive: false });
    pageRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
    pageRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    pageRef.current.addEventListener('touchend', handleTouchEnd);
    
    // Handle resize with debouncing
    const handleResize = debounce(() => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      
      // If transitioning to mobile, reload
      if (newWidth <= 1024) {
        window.location.reload();
        return;
      }
      
      // Recalculate dimensions when window is resized
      if (!containerRef.current) return;
      
      // Fix for persisting blur effect on first image
      if (imageRefs.current[0]?.current) {
        // Kill any active animations on the image
        gsap.killTweensOf(imageRefs.current[0].current);
        
        // Apply direct style changes to remove blur
        imageRefs.current[0].current.style.filter = "blur(0px)";
        imageRefs.current[0].current.style.transform = "scale(1)";
        imageRefs.current[0].current.style.opacity = "1";
      }
      
      const newSectionWidth = newWidth;
      const newTotalWidth = newSectionWidth * (images.length - 0.3); // Same adjustment as initial setup
      
      // Update container width
      containerRef.current.style.width = `${newTotalWidth}px`;
      
      // Update all section widths and positions
      const sections = document.querySelectorAll('.about-section');
      if (sections && sections.length > 0) {
        sections.forEach((section, idx) => {
          if (section) {
            section.style.width = `${newSectionWidth}px`;
            section.style.left = `${idx * newSectionWidth}px`;
            
            // Maintain z-index for overlay effect
            section.style.zIndex = idx + 10;
          }
        });
      }
      
      // Reset transform on third image and beyond when resizing
      const thirdImageAndBeyond = Array.from(sections).slice(2);
      gsap.set(thirdImageAndBeyond, { x: 0 });
      
      // Reset scroll position tracking
      targetScrollRef.current = pageRef.current.scrollLeft;
      currentScrollRef.current = pageRef.current.scrollLeft;
    }, 150);
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      
      if (pageRef.current) {
        pageRef.current.removeEventListener('scroll', handleScroll);
        pageRef.current.removeEventListener('wheel', handleWheel);
        pageRef.current.removeEventListener('touchstart', handleTouchStart);
        pageRef.current.removeEventListener('touchmove', handleTouchMove);
        pageRef.current.removeEventListener('touchend', handleTouchEnd);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [images.length, isMobileOrTablet]);

  // Effect for static content display - no animations, just show content immediately
  useEffect(() => {
    if (isMobileOrTablet || !windowWidth) return;
    
    // Set all content visible immediately with no animations
    if (aboutLeftRef.current && aboutRightRef.current) {
      gsap.set([aboutLeftRef.current, aboutRightRef.current], {
        x: 0,
        opacity: 1,
        overwrite: true
      });
    }
    
    // Make all paragraphs visible immediately
    if (aboutTextsRef.current.length > 0) {
      const validTexts = aboutTextsRef.current.filter(ref => ref);
      if (validTexts.length > 0) {
        gsap.set(validTexts, {
          y: 0,
          opacity: 1,
          overwrite: true
        });
      }
    }
    
    // Set all images to visible with no scale effects
    imageRefs.current.forEach((imageRef) => {
      if (imageRef?.current) {
        gsap.set(imageRef.current, {
          scale: 1,
          opacity: 1,
          overwrite: true
        });
      }
    });
  }, [windowWidth, isMobileOrTablet]);

  useEffect(() => {
    setIsReady(true);
  }, []);
  
  // Handle refs for about text paragraphs
  const setTextRef = (el, index) => {
    if (aboutTextsRef.current.length <= index) {
      aboutTextsRef.current[index] = el;
    } else {
      aboutTextsRef.current[index] = el;
    }
  };
  
  // Handle image load events
  const handleImageLoad = (index) => {
    return () => {
      const newLoadedState = [...imagesLoaded];
      newLoadedState[index] = true;
      setImagesLoaded(newLoadedState);
      
      // Apply MacBook/Safari specific optimizations to the loaded image
      if (isMacBook() || isSafari()) {
        const imgElement = imageRefs.current[index]?.current;
        if (imgElement) {
          // Apply hardware acceleration
          imgElement.style.transform = "translateZ(0)";
          imgElement.style.backfaceVisibility = "hidden";
          
          // Optimize rendering on Retina displays
          if (window.devicePixelRatio >= 2) {
            imgElement.style.imageRendering = "-webkit-optimize-contrast";
          }
        }
      }
    };
  };

  // Make sure document is ready before any processing
  useEffect(() => {
    // For direct navigation, ensure document is fully loaded
    if (document.readyState === 'complete') {
      setDocumentReady(true);
    } else {
      const handleLoad = () => setDocumentReady(true);
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
  
  // Handle direct navigation by setting history state
  useEffect(() => {
    if (documentReady) {
      // Force scroll to top on direct navigation
      window.scrollTo(0, 0);
      
      // Set history state if needed for back navigation
      if (window.history.state === null) {
        window.history.replaceState({ page: 'about' }, 'About Us', window.location.href);
      }
    }
  }, [documentReady]);

  // Add specific effect to handle blur reset on window resize
  useEffect(() => {
    if (isMobileOrTablet) return;
    
    // Function to clear blur effect
    const clearBlurEffect = () => {
      // Immediately clear blur on first image
      if (imageRefs.current[0]?.current) {
        gsap.killTweensOf(imageRefs.current[0].current);
        imageRefs.current[0].current.style.filter = 'blur(0px)';
        imageRefs.current[0].current.style.transform = 'scale(1)';
      }
    };
    
    // Add direct resize listener for blur effect
    window.addEventListener('resize', clearBlurEffect);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', clearBlurEffect);
    };
  }, [isMobileOrTablet]);

  // Track section visibility for navbar styling
  const [currentSection, setCurrentSection] = useState(0);
  
  // List of sections with people - adjust these indices based on your content
  const peopleImageSections = [2, 3, 8, 10]; // Example: sections 2, 3, 8, 10 have people

  // Update navbar styling based on current section
  useEffect(() => {
    if (!isMobileOrTablet) {
      // Toggle person-bg class if the current section has people
      const hasPerson = peopleImageSections.includes(currentSection);
      togglePersonBackground(hasPerson);
    }
    
    return () => {
      // Clean up when component unmounts
      togglePersonBackground(false);
    };
  }, [currentSection, isMobileOrTablet]);

  // Add MacBook optimization useEffect
  useEffect(() => {
    if (isMobileOrTablet) return;
    
    // Apply specific optimizations for MacBook and Safari
    const isMac = isMacBook();
    const safari = isSafari();
    
    if (isMac || safari) {
      // Add class for CSS targeting
      document.body.classList.add(isMac ? 'is-macbook' : 'is-safari');
      
      // Reduce animation complexity
      gsap.defaults({
        ease: "power2.out", // Simpler easing function
        duration: isMac ? 0.4 : 0.6, // Shorter duration for MacBook
        overwrite: true // Prevent animation conflicts
      });
      
      // Apply GPU acceleration to main container
      if (containerRef.current) {
        containerRef.current.style.transform = "translateZ(0)";
        containerRef.current.style.willChange = "transform";
        containerRef.current.style.backfaceVisibility = "hidden";
      }
      
      // Optimize image loading strategy
      const optimizeImages = () => {
        document.querySelectorAll('.about-image').forEach(img => {
          img.loading = "lazy";
          img.decoding = "async";
          
          // For Safari/MacBook, limit resolution on initial load
          if (isMac || safari) {
            // Store original src
            const originalSrc = img.src;
            if (originalSrc && !img.dataset.optimized) {
              img.dataset.optimized = "true";
              img.dataset.originalSrc = originalSrc;
              
              // Only apply to large images
              if (img.naturalWidth > 1000) {
                // Will be replaced with full resolution when in viewport
                img.style.transform = "translateZ(0)";
              }
            }
          }
        });
      };
      
      // Run optimization
      optimizeImages();
      
      // Clean up
      return () => {
        document.body.classList.remove('is-macbook', 'is-safari');
      };
    }
  }, [isMobileOrTablet]);

  // If on mobile/tablet, render the mobile version
  if (isMobileOrTablet) {
    return <MobileAbout images={images} />;
  }

  // Desktop version
  return (
    <div ref={pageRef} className={`about-page ${isReady ? 'is-ready' : ''}`}>
      <div ref={containerRef} className="about-container" style={{ position: 'relative' }}>
        {images.map((src, index) => (
          <section 
            key={index} 
            className="about-section"
            style={{
              width: '100vw',
              height: '100vh',
              position: 'absolute', // Use absolute positioning
              left: `${index * 100}vw`, // Position based on index
              top: 0,
              overflow: 'hidden',
              margin: 0,
              padding: 0,
              zIndex: index + 10, // Higher z-index for later sections to ensure proper layering
              transform: 'translateX(0)', // Initial transform for GSAP to animate
              transition: 'transform 0.2s ease-out', // Faster transition
              backgroundColor: 'black', // Ensure background is black to match section transitions
              willChange: 'transform' // Optimize for animation performance
            }}
          >
            <div className="image-container" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}>
              <img 
                ref={imageRefs.current[index]}
                src={src} 
                alt={`About section ${index + 1}`} 
                className="background-image"
                onLoad={handleImageLoad(index)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  objectFit: 'cover',
                  display: 'block',
                  width: '100%',
                  height: '100%'
                }} 
              />
            </div>
            <div className="about-content" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 80px',
              boxSizing: 'border-box'
            }}>
              {index === 0 && (
                <div className="about-hero-content">
                  <h1 ref={titleRef} className="main-title">
                    CALL US<br />VISIBLE<span ref={asteriskRef} className="asterisk">*</span>
                  </h1>
                  <p ref={subtitleRef} className="subtitle">(VIZ.Ə.BƏL)</p>
                  <p ref={descriptionRef} className="description">
                    VZBL IS ALL ABOUT BEING SEEN. IT'S THE FREQUENCY AT WHICH YOUR BRAND SHOWS UP, WHETHER IN SEARCH RESULTS, ON SOCIAL MEDIA, THROUGH EMAIL, OR ACROSS OTHER MARKETING CHANNELS. IT'S ABOUT MAKING YOUR BRAND IMPOSSIBLE TO IGNORE, GRABBING ATTENTION, AND BUILDING AN IDENTITY THAT STICKS.
                  </p>
                </div>
              )}
              {index === 1 && (
                <div className="about-split-layout">
                  <div ref={aboutLeftRef} className="about-left">
                    <h2 className="about-heading">/ ABOUT</h2>
                  </div>
                  <div ref={aboutTextContainerRef} className="about-text-container">
                    <p ref={(el) => setTextRef(el, 0)} className="about-paragraph">A CREATIVE AGENCY BUILT TO DEFY THE ORDINARY.</p>
                    <p ref={(el) => setTextRef(el, 1)} className="about-paragraph">FROM BRANDING TO MEDIA PRODUCTION, WE DELIVER WORK THAT REVEALS THE UNSEEN.</p>
                    <p ref={(el) => setTextRef(el, 2)} className="about-paragraph">OUR APPROACH IS SIMPLE: THINK BOLD, CREATE SMART, AND OWN THE SPOTLIGHT WITH EVERY PROJECT.</p>
                  </div>
                  <div ref={aboutRightRef} className="about-right">
                    <h2 className="about-heading">US /</h2>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

// Wrap the component with the error boundary before applying the Transition HOC
const AboutWithErrorHandling = () => (
  <ErrorBoundary>
    <About />
  </ErrorBoundary>
);

export default Transition(AboutWithErrorHandling);
