import React, { useState, useEffect, useRef, Component } from 'react';
import Lenis from 'lenis';
import Transition from '../../components/Transition/Transition';
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import SplitType from 'split-type';
import './About.css';
import MobileAbout from './MobileAbout'; // Import the mobile component
import { handleOverlay } from "./../../utils/overlayManager";

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
  const lenisRef = useRef(null);
  const titleRef = useRef(null);
  const asteriskRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  
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
  
  const images = Array.from({ length: 13 }, (_, i) => `/about/${i + 1}.webp`);

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
      console.error("Error preloading images:", error);
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
  }, [images.length]);

  useEffect(() => {
    document.title = "About Us | VZBL";
  }, []);

  // Set window width and check device type on initial render and window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobileOrTablet(detectMobileOrTablet());
    };
    
    // Set initial window width and device type
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
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
        // Split text for animation
        const titleSplit = new SplitType(titleRef.current, { types: 'chars' });
        const subtitleSplit = new SplitType(subtitleRef.current, { types: 'chars' });
        const descriptionSplit = new SplitType(descriptionRef.current, { types: 'lines' });
        
        // Set initial states
        if (titleSplit.chars && subtitleSplit.chars && descriptionSplit.lines) {
          gsap.set([titleSplit.chars, subtitleSplit.chars, descriptionSplit.lines], {
            y: '100%',
            opacity: 0
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
              ease: customEase
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
  }, [isReady, isMobileOrTablet]);

  // Effect for desktop horizontal scrolling setup
  useEffect(() => {
    if (isMobileOrTablet || !containerRef.current || !pageRef.current) return;
    
    // Calculate total width precisely - no extra space between sections
    const sectionWidth = window.innerWidth;
    const totalWidth = sectionWidth * images.length;
    
    // Desktop horizontal scroll setup - set exact width
    containerRef.current.style.width = `${totalWidth}px`;
    
    // Force the sections to be exactly viewport width
    const sections = document.querySelectorAll('.about-section');
    if (sections && sections.length > 0) {
      sections.forEach(section => {
        if (section) {
          section.style.width = `${sectionWidth}px`;
          section.style.margin = '0';
          section.style.display = 'block';
        }
      });
    }
    
    // Setup pageRef for horizontal scrolling
    if (pageRef.current) {
      pageRef.current.style.overflowX = 'scroll';
      pageRef.current.style.overflowY = 'hidden';
      pageRef.current.style.width = '100vw';
      pageRef.current.style.height = '100vh';
    }
    
    // Initialize Lenis with optimized settings
    try {
      // Destroy existing instance if it exists
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      
      lenisRef.current = new Lenis({
        wrapper: pageRef.current,
        content: containerRef.current,
        duration: 0.6, // Very responsive
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Optimized ease
        orientation: 'horizontal',
        gestureOrientation: 'horizontal',
        smoothWheel: true,
        wheelMultiplier: 3.0, // Increased from 0.8 to 3.0 for much higher sensitivity
        smoothTouch: true,
        touchMultiplier: 2.0, // Increased from 0.8 to 2.0 for better touch response
        infinite: false,
      });
      
      // Set up RAF loop
      function raf(time) {
        if (lenisRef.current) {
          lenisRef.current.raf(time);
        }
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      
      // Manual scroll update - separate from Lenis render loop
      const updateScrollPosition = () => {
        if (pageRef.current) {
          setScrollPosition(pageRef.current.scrollLeft);
          requestAnimationFrame(updateScrollPosition);
        }
      };
      requestAnimationFrame(updateScrollPosition);
      
    } catch (error) {
      console.error("Error initializing Lenis:", error);
    }
    
    // Custom wheel handler for enhanced control - necessary for some browsers
    const handleWheel = (e) => {
      if (!pageRef.current || !lenisRef.current) return;
      
      e.preventDefault();
      
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const normalizedDelta = delta * 2.5; // Increased from 0.5 to 2.5 - much more sensitive
      
      lenisRef.current.scrollTo(pageRef.current.scrollLeft + normalizedDelta, {
        immediate: false,
        duration: 0.5,
      });
    };
    
    // Optimized touch handling
    let touchStartX = 0;
    let touchStartTime = 0;
    let lastTouchX = 0;
    let velocity = 0;
    
    const handleTouchStart = (e) => {
      if (!pageRef.current || !lenisRef.current) return;
      
      touchStartX = e.touches[0].clientX;
      lastTouchX = touchStartX;
      touchStartTime = Date.now();
      velocity = 0;
      
      // Disable Lenis while touching
      lenisRef.current.stop();
    };
    
    const handleTouchMove = (e) => {
      if (!pageRef.current || !lenisRef.current) return;
      
      const touchX = e.touches[0].clientX;
      const deltaX = lastTouchX - touchX;
      const now = Date.now();
      const elapsed = now - touchStartTime;
      
      if (elapsed > 0) {
        velocity = deltaX / elapsed; // pixels per ms
      }
      
      if (Math.abs(deltaX) > 1) {
        if (pageRef.current) {
          pageRef.current.scrollLeft += deltaX;
          e.preventDefault();
        }
        
        lastTouchX = touchX;
        touchStartTime = now;
      }
    };
    
    const handleTouchEnd = (e) => {
      if (!pageRef.current || !lenisRef.current) return;
      
      // Apply momentum based on final velocity
      const momentum = velocity * 300; // Adjust this multiplier for momentum effect
      
      lenisRef.current.start();
      
      if (Math.abs(momentum) > 1) {
        lenisRef.current.scrollTo(pageRef.current.scrollLeft + momentum, {
          duration: 1.2,
          easing: (t) => 1 - Math.pow(1 - t, 3), // Ease out cubic
        });
      }
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
      
      const newSectionWidth = newWidth;
      const newTotalWidth = newSectionWidth * images.length;
      
      // Update container width
      containerRef.current.style.width = `${newTotalWidth}px`;
      
      // Update all section widths
      const sections = document.querySelectorAll('.about-section');
      if (sections && sections.length > 0) {
        sections.forEach(section => {
          if (section) {
            section.style.width = `${newSectionWidth}px`;
          }
        });
      }
      
      // Reset Lenis after resize
      if (lenisRef.current) {
        lenisRef.current.resize();
      }
    }, 150);
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      
      if (pageRef.current) {
        pageRef.current.removeEventListener('wheel', handleWheel);
        pageRef.current.removeEventListener('touchstart', handleTouchStart);
        pageRef.current.removeEventListener('touchmove', handleTouchMove);
        pageRef.current.removeEventListener('touchend', handleTouchEnd);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [images.length, isMobileOrTablet]);

  // Effect for scroll-triggered animations - optimize with batch updates
  useEffect(() => {
    if (isMobileOrTablet || !windowWidth) return;
    
    // Batch GSAP animations for better performance
    gsap.set([], {}); // Start a GSAP batch
    
    // Desktop scroll animations
    const triggerStart = windowWidth * 0.5;
    const triggerEnd = windowWidth * 1.2;
    
    if (scrollPosition >= triggerStart && scrollPosition <= triggerEnd) {
      // Calculate progress from 0 to 1 based on scroll position
      const progress = (scrollPosition - triggerStart) / (triggerEnd - triggerStart);
      
      // Animate headings with optimized GSAP properties
      if (aboutLeftRef.current && aboutRightRef.current) {
        gsap.to(aboutLeftRef.current, {
          x: 0,
          opacity: Math.min(progress * 2, 1),
          duration: 0.4, // Increased for smoother transitions
          ease: "power2.out", // Better easing
          overwrite: "auto" // More efficient overwrite
        });
        
        gsap.to(aboutRightRef.current, {
          x: 0,
          opacity: Math.min(progress * 2, 1),
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
      
      // Animate paragraphs with optimized stagger
      if (aboutTextsRef.current.length > 0) {
        const validTexts = aboutTextsRef.current.filter(ref => ref);
        if (validTexts.length > 0) {
          validTexts.forEach((textRef, index) => {
            if (!textRef) return;
            
            // Stagger the animations based on index
            const delayedProgress = progress - (index * 0.1);
            const opacity = Math.max(0, Math.min(delayedProgress * 3, 1));
            
            gsap.to(textRef, {
              y: delayedProgress > 0 ? Math.max(30 * (1 - delayedProgress * 2), 0) : 30,
              opacity: opacity,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto"
            });
          });
        }
      }
    } else if (scrollPosition < triggerStart) {
      // Reset animations when scrolling back - batch for performance
      if (aboutLeftRef.current && aboutRightRef.current) {
        gsap.to([aboutLeftRef.current, aboutRightRef.current], {
          opacity: 0,
          x: (index) => index === 0 ? -50 : 50,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
      
      if (aboutTextsRef.current.length > 0) {
        const validTexts = aboutTextsRef.current.filter(ref => ref);
        if (validTexts.length > 0) {
          gsap.to(validTexts, {
            opacity: 0,
            y: 30,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      }
    }
    
    // Optimize image animations with less frequent updates
    imageRefs.current.forEach((imageRef, index) => {
      // Skip the first image as it's not scroll-triggered
      if (!imageRef?.current || index === 0) return;
      
      // Calculate when image should be in view, based on window width
      const imageTriggerStart = windowWidth * (index - 0.3);
      const imageTriggerEnd = windowWidth * (index + 0.7);
      
      // Check if image is in view
      if (scrollPosition >= imageTriggerStart && scrollPosition <= imageTriggerEnd) {
        const imageProgress = (scrollPosition - imageTriggerStart) / (imageTriggerEnd - imageTriggerStart);
        
        // Apply subtle animation effects to the image with better performance
        gsap.to(imageRef.current, {
          scale: 1 + Math.sin(imageProgress * Math.PI) * 0.05, // Subtle scale effect
          duration: 0.5,
          ease: "power1.out",
          overwrite: "auto"
        });
      } else {
        // Reset image when out of view
        gsap.to(imageRef.current, {
          scale: 1,
          duration: 0.4,
          ease: "power1.out",
          overwrite: "auto"
        });
      }
    });
  }, [scrollPosition, windowWidth, imagesLoaded, isMobileOrTablet]);

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

  // If on mobile/tablet, render the mobile version
  if (isMobileOrTablet) {
    return <MobileAbout images={images} />;
  }

  // Desktop version
  return (
    <div ref={pageRef} className={`about-page ${isReady ? 'is-ready' : ''}`}>
      <div ref={containerRef} className="about-container">
        {images.map((src, index) => (
          <section 
            key={index} 
            className="about-section"
            style={{
              width: '100vw',
              height: '100vh',
              position: 'relative',
              overflow: 'hidden',
              margin: 0,
              padding: 0
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
