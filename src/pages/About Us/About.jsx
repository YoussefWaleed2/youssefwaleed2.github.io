import React, { useState, useEffect, useRef, Component, useCallback } from 'react';
import Transition from '../../components/Transition/Transition';
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import SplitType from 'split-type';
import './About.css';
import MobileAbout from './MobileAbout'; // Import the mobile component
import { handleOverlay } from "./../../utils/overlayManager";
import { togglePersonBackground } from '../../utils/personDetection';

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
    console.error("Error in About component:", error, errorInfo);
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
  const [setScrollPosition] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const images = Array.from({ length: 13 }, (_, i) => `/about/${i + 1}.webp`);

  // Preload images function to improve performance
  const preloadImages = useCallback(async () => {
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
      console.error("Error preloading images:", error);
      setImagesLoaded(Array(images.length).fill(true)); // Fallback
    }
  }, [images, setImagesLoaded]);

  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  // Initialize image refs arrays and start preloading
  useEffect(() => {
    imageRefs.current = Array(images.length).fill().map(() => React.createRef());
    setImagesLoaded(Array(images.length).fill(false));
    preloadImages(); // Start preloading immediately
  }, [images.length, preloadImages]);

  useEffect(() => {
    document.title = "About Us | VZBL";
  }, []);

  // Set window width and check device type on initial render and window resize
  useEffect(() => {
    const handleResize = () => {
      // Add resizing class to body during resize
      document.body.classList.add('resizing');
      
      // Check previous state versus current state
      const wasMobileOrTablet = isMobileOrTablet;
      const currentMobileOrTablet = detectMobileOrTablet();
      
      // Set window width and check device type
      setWindowWidth(window.innerWidth);
      setIsMobileOrTablet(currentMobileOrTablet);
      
      // If switching from mobile to desktop, reload the page
      if (wasMobileOrTablet && !currentMobileOrTablet) {
        window.location.reload();
      }
      
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
  }, [isMobileOrTablet]);

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
        console.error("Error in text animation:", error);
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
  const _smoothScrollTo = (targetX) => {
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
    
    // Smooth scrolling with improved edge behavior
    const boundedSmoothScrollTo = (targetPosition, duration = 500) => {
      if (!pageRef.current) return;
      
      // Ensure we don't scroll beyond bounds
      const boundedTarget = Math.max(0, Math.min(targetPosition, maxScrollPosition));
      
      const startPosition = pageRef.current.scrollLeft;
      const distance = boundedTarget - startPosition;
      let startTime = null;
      
      const animateScroll = (currentTime) => {
        if (!pageRef.current) return; // Safety check
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function for smoother motion
        const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
        const newPosition = startPosition + distance * easeProgress;
        
        pageRef.current.scrollLeft = newPosition;
        
        if (timeElapsed < duration) {
          scrollRafRef.current = requestAnimationFrame(animateScroll);
        }
      };
      
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      
      scrollRafRef.current = requestAnimationFrame(animateScroll);
    };

    // Wheel event handler for custom smooth scrolling
    const handleWheel = (e) => {
      e.preventDefault();
      
      if (!pageRef.current) return;
      
      // Get current scroll position
      const currentScroll = pageRef.current.scrollLeft;
      
      // Calculate smooth scroll target based on wheel delta
      // Use a more responsive scrolling distance calculation
      const scrollMultiplier = 2.5; // Increased multiplier for more responsive scrolling
      const newPosition = currentScroll + (e.deltaY * scrollMultiplier);
      
      // Ensure scrolling stays within bounds
      const boundedPosition = Math.max(0, Math.min(newPosition, maxScrollPosition));
      
      // Use smooth scrolling with shorter duration for more responsive feel
      boundedSmoothScrollTo(boundedPosition, 300);
    };

    // Touch handling for better mobile experience
    let touchStartX = 0;
    let lastTouchX = 0;
    let touchVelocity = 0;
    
    const handleTouchStart = (e) => {
      if (!pageRef.current) return;
      
      touchStartX = e.touches[0].clientX;
      lastTouchX = touchStartX;
      
      // Cancel any ongoing animation
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
    
    const handleTouchMove = (e) => {
      if (!pageRef.current) return;
      
      const currentX = e.touches[0].clientX;
      const deltaX = lastTouchX - currentX;
      
      // Update velocity for momentum scrolling
      touchVelocity = deltaX;
      
      // Scroll directly for immediate feedback
      if (pageRef.current) {
        pageRef.current.scrollLeft += deltaX;
        
        // Ensure we stay within bounds
        if (pageRef.current.scrollLeft <= 0) {
          pageRef.current.scrollLeft = 0;
        } else if (pageRef.current.scrollLeft >= maxScrollPosition) {
          pageRef.current.scrollLeft = maxScrollPosition;
        }
      }
      
      lastTouchX = currentX;
    };
    
    const handleTouchEnd = () => {
      if (!pageRef.current) return;
      
      // Apply momentum scrolling based on final velocity
      const momentumDistance = touchVelocity * 10; // Adjust for desired momentum effect
      const targetPosition = pageRef.current.scrollLeft + momentumDistance;
      
      // Use smooth scrolling for the momentum effect
      boundedSmoothScrollTo(targetPosition, 500);
    };

    // Add wheel event listener for custom scrolling
    if (pageRef.current) {
      const currentPageRef = pageRef.current;
      currentPageRef.addEventListener('wheel', handleWheel, { passive: false });
      currentPageRef.addEventListener('touchstart', handleTouchStart, { passive: false });
      currentPageRef.addEventListener('touchmove', handleTouchMove, { passive: false });
      currentPageRef.addEventListener('touchend', handleTouchEnd);
    
      // Clean up event listeners when component unmounts
      return () => {
        currentPageRef.removeEventListener('wheel', handleWheel);
        currentPageRef.removeEventListener('touchstart', handleTouchStart);
        currentPageRef.removeEventListener('touchmove', handleTouchMove);
        currentPageRef.removeEventListener('touchend', handleTouchEnd);
        
        if (scrollRafRef.current) {
          cancelAnimationFrame(scrollRafRef.current);
        }
      };
    }
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
    const newImagesLoaded = [...imagesLoaded];
    newImagesLoaded[index] = true;
    setImagesLoaded(newImagesLoaded);
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
  const [currentSection, _setCurrentSection] = useState(0);
  
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
  }, [currentSection, isMobileOrTablet, peopleImageSections]);

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
                onLoad={() => handleImageLoad(index)}
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
