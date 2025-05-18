import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Transition from '../../components/Transition/Transition';
import { handleOverlay } from "../../utils/overlayManager";
import projectsData from "../../data/projectsData.json";
import './SingleProject.css';
import SingleProjectMobile from "./SingleProjectMobile";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Add debounce function for better performance
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const SingleProject = () => {
  const { category, projectName } = useParams();
  const location = useLocation();
  // Add navigate for navigation functionality
  const navigate = useNavigate();
  
  // State variables
  const [project, setProject] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Refs
  const containerRef = useRef(null);
  const pageRef = useRef(null);
  
  // Custom smooth scrolling refs
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const scrollRafRef = useRef(null);
  const isScrollingRef = useRef(false);
  const lastTouchX = useRef(0);
  const touchStartX = useRef(0);
  
  // Store indicator click handlers to properly remove them
  const indicatorHandlersRef = useRef([]);
  
  // Debug log to check routing
  console.log("SingleProject loaded with category:", category, "projectName:", projectName, "from path:", location.pathname);

  // Mobile detection function
  const detectMobileOrTablet = () => {
    const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || window.innerWidth <= 1024;
  };

  // Handle overlay immediately on mount
  useEffect(() => {
    // First make sure any existing overlay is removed
    const overlayElement = document.querySelector('.overlay');
    if (overlayElement) {
      overlayElement.style.display = 'none';
      overlayElement.style.opacity = '0';
    }
    
    // Then call handleOverlay with a small delay
    setTimeout(() => {
      handleOverlay();
    }, 100);
    
    return () => {
      handleOverlay();
    };
  }, []);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const handleResize = debounce(() => {
      const wasMobile = isMobileOrTablet;
      const isMobileNow = detectMobileOrTablet();
      
      if (wasMobile !== isMobileNow) {
        // View type is changing (mobile to desktop or desktop to mobile)
        setIsMobileOrTablet(isMobileNow);
        
        // Reset state for clean transition
        if (!isMobileNow && project) {
          // We're switching from mobile to desktop
          setTimeout(() => {
            if (pageRef.current) {
              pageRef.current.scrollLeft = 0;
              setCurrentSection(0);
            }
            // Force re-render with a state update
            setIsReady(false);
            setTimeout(() => setIsReady(true), 50);
          }, 100);
        }
      } else {
        // Just a regular resize, update state
        setIsMobileOrTablet(isMobileNow);
      }
    }, 300);
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileOrTablet, project]);

  // Set page title and background color
  useEffect(() => {
    if (project) {
      document.title = `${project.title} | VZBL`;
      
      // Add class to body for CSS scoping
      document.body.classList.add('single-project-page-active');
      
      // Apply background color from project data if available
      const bgColor = project.backgroundColor || '#000000';
      document.body.style.backgroundColor = bgColor;
      
      // Also set HTML background to match for smooth scrolling
      document.documentElement.style.backgroundColor = bgColor;
      
      // For text contrast, determine if background is dark or light
      const rgb = hexToRgb(bgColor);
      if (rgb) {
        // Simple luminance formula (perceived brightness)
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        
        if (luminance < 0.5) {
          // Dark background, use light text
          document.body.classList.add('dark-background');
          document.body.classList.remove('light-background');
        } else {
          // Light background, use dark text
          document.body.classList.add('light-background');
          document.body.classList.remove('dark-background');
        }
      }
      
      // Clean up function
      return () => {
        document.body.classList.remove('single-project-page-active');
        document.body.classList.remove('dark-background');
        document.body.classList.remove('light-background');
        document.body.style.backgroundColor = '';
        
        // Force reset overflow properties
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.backgroundColor = '';
        
        // Clean up any remaining GSAP animations
        if (gsap.globalTimeline) {
          const animations = gsap.globalTimeline.getChildren();
          animations.forEach(animation => animation.kill());
        }
      };
    }
  }, [project]);

  // Helper function to convert hex color to RGB
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Find the project data based on URL parameters
  useEffect(() => {
    const findProject = () => {
      // Format category name to match projectsData keys
      let formattedCategory = category.replace(/-/g, " ");
      
      // Map URL categories to data keys
      const categoryMap = {
        "branding": "BRANDING",
        "marketing": "Marketing",
        "advertising": "Advertising",
        "advertisement": "Advertising"
      };
      
      // Use the map if it exists
      if (categoryMap[formattedCategory.toLowerCase()]) {
        formattedCategory = categoryMap[formattedCategory.toLowerCase()];
      }
      
      // Get projects from the category
      let categoryProjects = [];
      
      if (projectsData[formattedCategory]) {
        categoryProjects = projectsData[formattedCategory];
      } else if (projectsData[formattedCategory.toUpperCase()]) {
        categoryProjects = projectsData[formattedCategory.toUpperCase()];
      } else if (projectsData[formattedCategory.toLowerCase()]) {
        categoryProjects = projectsData[formattedCategory.toLowerCase()];
      }
      
      if (!categoryProjects.length) {
        console.error(`Category not found: ${formattedCategory}`);
        return null;
      }
      
      // Find the project by name
      const foundProject = categoryProjects.find(
        p => p.title.toLowerCase().replace(/ /g, '-') === projectName.toLowerCase()
      );
      
      if (!foundProject) {
        console.error(`Project not found: ${projectName} in category ${formattedCategory}`);
      }
      
      return foundProject || null;
    };
    
    const projectData = findProject();
    console.log("Found project data:", projectData);
    
    if (projectData) {
      setProject(projectData);
      
      // Set isReady with a slight delay to ensure transitions work
      setTimeout(() => {
        setIsReady(true);
      }, 300);
    }
  }, [category, projectName]);

  // Add this after the project data is set
  useEffect(() => {
    if (project && isReady && pageRef.current) {
      // Force scroll to first slide on initial load
      pageRef.current.scrollLeft = 0;
      setCurrentSection(0);
      
      // Ensure indicators are updated
      setTimeout(updateIndicatorStyles, 50);
      
      // Fix the gap issue by explicitly setting panel 4 position and style
      const sections = document.querySelectorAll('.panel');
      if (sections.length >= 4) {
        // Apply styling to ALL panels from 3 onwards to prevent gaps
        for (let i = 3; i < sections.length; i++) {
          const panel = sections[i];
          if (panel) {
            // Apply the same positioning style as panel 3
            panel.style.position = 'absolute';
            panel.style.left = `${i * window.innerWidth}px`;
            panel.style.width = `${window.innerWidth}px`;
            panel.style.height = '100vh';
            panel.style.margin = '0';
            panel.style.padding = '0';
            panel.style.overflow = 'hidden';
            panel.style.backgroundColor = '#000';
            panel.style.zIndex = `${40 - (i - 2)}`; // Decreasing z-index for stacking
            
            // Ensure each image container fills its panel
            const imageContainer = panel.querySelector('.image-container');
            if (imageContainer) {
              imageContainer.style.width = '100%';
              imageContainer.style.height = '100%';
              imageContainer.style.margin = '0';
              imageContainer.style.padding = '0';
              imageContainer.style.overflow = 'hidden';
              imageContainer.style.display = 'flex';
              imageContainer.style.justifyContent = 'center';
              imageContainer.style.alignItems = 'center';
            }
            
            // Ensure each image fills its container
            const img = panel.querySelector('img');
            if (img) {
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.objectFit = 'cover';
              img.style.margin = '0';
              img.style.padding = '0';
              img.style.display = 'block';
            }
          }
        }
      }
    }
  }, [project, isReady]);

  // Add a cleanup effect for GSAP when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any remaining GSAP animations
      if (gsap.globalTimeline) {
        const animations = gsap.globalTimeline.getChildren();
        animations.forEach(animation => animation.kill());
      }

      // Kill all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Kill any remaining animation frames
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  // Effect to fix panel positioning and remove gaps
  useEffect(() => {
    if (isReady && project && containerRef.current) {
      const panels = document.querySelectorAll('.panel');
      if (!panels.length) return;

      // Reset panel positions after videos load
      const resetPanelPositions = () => {
        let currentLeft = 0;
        panels.forEach((panel, index) => {
          // Set absolute positioning
          panel.style.position = 'absolute';
          panel.style.left = `${currentLeft}px`;
          panel.style.top = '0';
          
          // For video panels, let them naturally size
          const hasVideo = panel.querySelector('video');
          if (hasVideo) {
            // For video panels, ensure the container is properly sized
            const vidContainer = panel.querySelector('.video-container-single-project');
            if (vidContainer) {
              vidContainer.style.width = 'auto';
              vidContainer.style.height = 'auto';
              vidContainer.style.minHeight = '100%';
            }
          }
          
          // Get the panel width (important for proper spacing)
          const panelWidth = panel.offsetWidth || window.innerWidth;
          
          // Update left position for the next panel
          currentLeft += panelWidth;
        });
        
        // Update container width to accommodate all panels
        if (containerRef.current) {
          containerRef.current.style.width = `${currentLeft}px`;
        }
      };
      
      // Initial positioning
      resetPanelPositions();
      
      // Wait for videos to load then reposition panels
      const videos = document.querySelectorAll('video');
      let loadedVideos = 0;
      const totalVideos = videos.length;
      
      const checkAllVideosLoaded = () => {
        loadedVideos++;
        if (loadedVideos === totalVideos) {
          // All videos loaded, reset positions
          resetPanelPositions();
        }
      };
      
      if (totalVideos > 0) {
        videos.forEach(video => {
          if (video.readyState >= 3) { // HAVE_FUTURE_DATA or greater
            checkAllVideosLoaded();
          } else {
            video.addEventListener('loadeddata', checkAllVideosLoaded);
          }
        });
      }
      
      // Also reset on window resize
      const handleResize = debounce(() => {
        resetPanelPositions();
      }, 200);
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        videos.forEach(video => {
          video.removeEventListener('loadeddata', checkAllVideosLoaded);
        });
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isReady, project]);

  // Update smoothScrollTo function for improved performance
  const smoothScrollTo = (targetX) => {
    if (!pageRef.current || !project?.projectContent?.sections) return;
    
    // Calculate max scroll position
    const sectionWidth = window.innerWidth;
    const maxScroll = sectionWidth * (project.projectContent.sections.length - 1);
    
    // Strictly enforce limits with Math.min/max
    const boundedTarget = Math.min(Math.max(0, targetX), maxScroll);
    targetScrollRef.current = boundedTarget;
    
    // If animation is already running, just update the target
    if (isScrollingRef.current) return;
    
    // Set scrolling state
    isScrollingRef.current = true;
    
    // Detect if user is on macOS
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    
    // Start smooth scroll animation with improved easing
    const animateScroll = () => {
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
      
      // Improved easing factor for smoother but faster scrolling
      // Mac-specific easing for better touchpad feel
      let easeFactor;
      if (isMac) {
        // For Mac, use adaptive easing based on distance
        // This provides more precision for small movements and speed for large ones
        const distanceAbs = Math.abs(distance);
        if (distanceAbs > sectionWidth * 0.7) {
          // Large distance (page transitions) - faster easing
          easeFactor = 0.25; // Increased from 0.12 for faster scrolling
        } else if (distanceAbs > sectionWidth * 0.2) {
          // Medium distance - moderate easing
          easeFactor = 0.22; // Increased from 0.1 for faster scrolling
        } else {
          // Small distance - more precise easing
          easeFactor = 0.18; // Increased from 0.085 for faster scrolling
        }
      } else {
        // Windows/Linux standard easing
        easeFactor = 0.15; // Increased from 0.08 for faster movement
      }
      
      // Apply bounded scroll position with extra checks
      const move = distance * easeFactor;
      const newScrollLeft = currentScrollRef.current + move;
      
      // Extra boundary protection
      if (newScrollLeft < 0) {
        pageRef.current.scrollLeft = 0;
      } else if (newScrollLeft > maxScroll) {
        pageRef.current.scrollLeft = maxScroll;
      } else {
        pageRef.current.scrollLeft = newScrollLeft;
      }
      
      // Continue animation with requestAnimationFrame for smoother performance
      scrollRafRef.current = requestAnimationFrame(animateScroll);
    };
    
    // Start animation
    scrollRafRef.current = requestAnimationFrame(animateScroll);
  };

  // About.jsx-style smooth scroll and overlay effect
  useEffect(() => {
    if (isMobileOrTablet || !project?.projectContent?.sections) return;
    const sectionWidth = window.innerWidth;
    const panels = document.querySelectorAll('.panel');
    if (!panels.length) return;

    // Set up absolute positioning for overlay effect
    panels.forEach((panel, index) => {
      panel.style.position = 'absolute';
      panel.style.left = `${index * sectionWidth}px`;
      panel.style.top = '0';
      panel.style.width = `${sectionWidth}px`;
      
      // Set z-index to create proper layering
      if (index === 0) {
        panel.style.zIndex = '10'; // First panel
      } else if (index === 1) {
        panel.style.zIndex = '40'; // Text panel
      } else {
        // All panels after text panel should move together
        // Decreasing z-index for proper stacking
        panel.style.zIndex = `${40 - (index - 1)}`;
      }
      
      // Apply transition properties to all panels for smooth movement
      panel.style.transition = 'transform 0.2s ease-out';
      panel.style.willChange = 'transform';
      
      // Make sure images in all panels fill properly
      const imageContainer = panel.querySelector('.image-container');
      if (imageContainer) {
        imageContainer.style.width = '100%';
        imageContainer.style.height = '100%';
        imageContainer.style.margin = '0';
        imageContainer.style.padding = '0';
        imageContainer.style.overflow = 'hidden';
        imageContainer.style.display = 'flex';
        imageContainer.style.justifyContent = 'center';
        imageContainer.style.alignItems = 'center';
      }
      
      // Make sure images fill their containers
      const img = panel.querySelector('img');
      if (img) {
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.margin = '0';
        img.style.padding = '0';
        img.style.display = 'block';
      }
    });

    // Animation loop for overlay effect with ultra-smooth transitions
    const animateOverlay = () => {
      // Update current scroll position for precise animations
      currentScrollRef.current = pageRef.current?.scrollLeft || 0;
      
      // Get panels for animation
      const panels = document.querySelectorAll('.panel');
      if (!panels.length) return;
      
      const secondPanel = panels[1]; // Text panel
      
      // Calculate how far we've scrolled as a percentage of section width
      const scrollProgress = Math.min(1, currentScrollRef.current / (sectionWidth * 0.95));
      
      // Apply multiple easing curves for more natural movement
      // Combination of cubic and sine curves creates ultra-smooth motion
      const easeInCubic = scrollProgress * scrollProgress * scrollProgress;
      const easeInOutSine = -(Math.cos(Math.PI * scrollProgress) - 1) / 2;
      
      // Combine ease curves for final effect - optimized ratio for smoother transition
      const combinedEase = easeInCubic * 0.25 + easeInOutSine * 0.75;
      
      // Calculate movement amount for text panel (second panel)
      const textPanelMoveAmount = -Math.min(combinedEase * sectionWidth * 0.55, sectionWidth * 0.55);
      
      // Use direct DOM manipulation instead of GSAP for better performance
      // This reduces the overhead of GSAP for simple transform operations
      if (secondPanel) {
        secondPanel.style.transform = `translateX(${textPanelMoveAmount}px)`;
      }
      
      // Move ALL image panels (third and beyond) together with the text panel
      for (let i = 2; i < panels.length; i++) {
        const panel = panels[i];
        if (panel) {
          // Direct DOM manipulation for performance
          panel.style.transform = `translateX(${textPanelMoveAmount}px)`;
        }
      }
      
      // Continue animation loop - use high priority requestAnimationFrame
      // for smoother animation, especially during scrolling
      scrollRafRef.current = requestAnimationFrame(animateOverlay);
    };
    scrollRafRef.current = requestAnimationFrame(animateOverlay);

    // Wheel event handler with enhanced momentum for smooth scrolling
    const handleWheel = (e) => {
      if (!pageRef.current || !project?.projectContent?.sections) return;
      
      e.preventDefault();
      
      // Get current scroll position and timestamp for velocity tracking
      currentScrollRef.current = pageRef.current.scrollLeft;
      const now = Date.now();
      
      // Detect if user is on macOS for touchpad-specific optimizations
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      
      // Create or update wheel tracking for momentum calculation
      if (!window.wheelTracking) {
        window.wheelTracking = {
          lastEvent: now,
          lastDelta: 0,
          momentum: 0,
          isMac: isMac
        };
      }
      
      // Adapt scaling based on deltaMode for consistent behavior
      let deltaPixels;
      if (e.deltaMode === 1) { // Line mode
        deltaPixels = e.deltaY * 35; // Increased for faster scrolling
      } else if (e.deltaMode === 2) { // Page mode
        deltaPixels = e.deltaY * window.innerHeight * 0.7;
      } else { // Pixel mode (most common)
        // Mac-specific handling for smoother touchpad scrolling
        if (isMac) {
          // For Mac touchpads, we need gentler acceleration but better precision
          // Also check if this is likely a Magic Trackpad/built-in touchpad vs. regular mouse
          const isLikelyTouchpad = Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) <= 10;
          
          if (isLikelyTouchpad) {
            // For Mac touchpads, apply more consistent scaling and smoother damping
            deltaPixels = e.deltaY * 6.5; // Increased from 2.5 for faster scrolling
            
            // Also check horizontal scroll component for diagonal gestures
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.8) {
              // This is likely a diagonal gesture, soften the vertical component
              deltaPixels *= 0.8; // Increased from 0.7 for more response
            }
          } else {
            // Probably a mouse on Mac, use standard scaling
            deltaPixels = e.deltaY * 5.0; // Increased from 2.8 for faster scrolling
          }
        } else {
          // Windows/Linux standard handling
          deltaPixels = e.deltaY * 4.0; // Increased from 3.0 for faster scrolling
        }
      }
      
      // Calculate time since last wheel event to detect continuous scrolling
      const timeDelta = now - window.wheelTracking.lastEvent;
      const isContinuousScroll = timeDelta < (isMac ? 80 : 150); // Shorter window for Mac
      
      // Apply acceleration based on continuous scrolling
      let finalDelta;
      
      if (isContinuousScroll) {
        // For continuous movements, gradually build momentum
        // Direction changes should have immediate effect though
        const sameDirection = Math.sign(deltaPixels) === Math.sign(window.wheelTracking.lastDelta);
        
        if (sameDirection) {
          // Continuous scroll in same direction - build momentum gradually
          // Mac-specific momentum tuning for touchpads
          const momentumMultiplier = isMac ? 1.8 : 1.2; // Increased from 0.9 for Mac
          const momentumRetention = isMac ? 0.85 : 0.85; // Increased from 0.75 for Mac
          
          // Limit maximum momentum gain for predictable behavior
          const momentumGain = Math.min(
            Math.abs(deltaPixels) * momentumMultiplier,
            Math.abs(window.wheelTracking.momentum) * (isMac ? 0.5 : 0.4) // Increased from 0.3 for Mac
          );
          
          // Update momentum with new input (smooth acceleration)
          window.wheelTracking.momentum = 
            window.wheelTracking.momentum * momentumRetention +
            Math.sign(deltaPixels) * momentumGain;
        } else {
          // Direction change - respond quickly but with controlled initial speed
          window.wheelTracking.momentum = deltaPixels * (isMac ? 0.6 : 0.8);
        }
      } else {
        // New scroll event after pause - start with modest momentum
        window.wheelTracking.momentum = deltaPixels * (isMac ? 0.5 : 0.6);
      }
      
      // Apply the momentum with a multiplier for desired speed
      // Use a different multiplier for Mac touchpads
      finalDelta = window.wheelTracking.momentum * (isMac ? 2.5 : 1.5); // Increased from 1.3 for Mac
      
      // Update tracking values for next event
      window.wheelTracking.lastEvent = now;
      window.wheelTracking.lastDelta = deltaPixels;
      
      // Calculate target position with bounds checking
      const sectionWidth = window.innerWidth;
      const maxScroll = sectionWidth * (project.projectContent.sections.length - 1);
      const targetPos = Math.min(Math.max(0, currentScrollRef.current + finalDelta), maxScroll);
      
      // Apply the smooth scrolling
      smoothScrollTo(targetPos);
    };
    
    // Add event listeners with optimized options for performance
    if (pageRef.current) {
      // Add wheel handler
      pageRef.current.addEventListener('wheel', handleWheel, { passive: false });
      
      // Add touch handlers for better mobile performance
      pageRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
      pageRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
      pageRef.current.addEventListener('touchend', handleTouchEnd);
      
      // Apply styles for improved scrolling performance
      pageRef.current.style.overflowX = 'auto';
      pageRef.current.style.WebkitOverflowScrolling = 'touch'; // Helps with iOS smoothness
      
      // Apply GPU acceleration for smoother scrolling
      pageRef.current.style.transform = 'translateZ(0)';
      pageRef.current.style.backfaceVisibility = 'hidden';
      pageRef.current.style.perspective = '1000';
    }

    // Cleanup function
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      
      if (pageRef.current) {
        pageRef.current.removeEventListener('wheel', handleWheel);
        pageRef.current.removeEventListener('touchstart', handleTouchStart);
        pageRef.current.removeEventListener('touchmove', handleTouchMove);
        pageRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isMobileOrTablet, project]);

  // Add a function to update indicator styles
  const updateIndicatorStyles = () => {
    document.querySelectorAll('.scroll-indicator').forEach((indicator, index) => {
      if (index === currentSection) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  };

  // Update the updateCurrentSection function to call this function
  const updateCurrentSection = () => {
    if (!pageRef.current || !project?.projectContent?.sections) return;
    
    const sectionWidth = window.innerWidth;
    const scrollPosition = pageRef.current.scrollLeft;
    
    // Special case for first slide - use a threshold to ensure the first slide is properly detected
    if (scrollPosition < sectionWidth * 0.4) {
      if (currentSection !== 0) {
        setCurrentSection(0);
        
        // Update background color based on current section
        const currentSectionData = project.projectContent.sections[0];
        const bgColor = currentSectionData?.backgroundColor || project.backgroundColor || '#000000';
        document.body.style.backgroundColor = bgColor;
        document.documentElement.style.backgroundColor = bgColor;
        
        setTimeout(updateIndicatorStyles, 10);
      }
      return;
    }
    
    const newSection = Math.round(scrollPosition / sectionWidth);
    
    if (newSection !== currentSection && newSection >= 0 && newSection < project.projectContent.sections.length) {
      setCurrentSection(newSection);
      
      // Update background color based on new section
      const newSectionData = project.projectContent.sections[newSection];
      const bgColor = newSectionData?.backgroundColor || project.backgroundColor || '#000000';
      document.body.style.backgroundColor = bgColor;
      document.documentElement.style.backgroundColor = bgColor;
      
      setTimeout(updateIndicatorStyles, 10);
    }
  };

  // Effect for desktop horizontal scrolling setup
  useEffect(() => {
    if (isMobileOrTablet || !project || !project.projectContent || !containerRef.current || !pageRef.current) return;
    
    // Calculate total width precisely
    const sectionWidth = window.innerWidth;
    const sectionCount = project.projectContent.sections.length;
    const totalWidth = sectionWidth * sectionCount;
    
    // Set container width
    containerRef.current.style.width = `${totalWidth}px`;
    
    // Get all panels
    const sections = document.querySelectorAll('.panel');
    
    // Style each section for horizontal layout
    if (sections && sections.length > 0) {
      sections.forEach((section, index) => {
        if (section) {
          // Set width and positioning
          section.style.width = `${sectionWidth}px`;
          section.style.margin = '0';
          section.style.position = 'absolute';
          section.style.left = `${index * sectionWidth}px`;
          section.style.top = '0';
          section.style.height = '100%'; // Ensure full height
          section.style.backgroundColor = '#000'; // Ensure background color
          
          // Add specific fix for panel 3 and 4 (where the gap appears)
          if (index === 3) {
            section.style.left = `${3 * sectionWidth}px`; // Force correct position
            section.style.zIndex = 40; // Higher z-index
            section.style.margin = '0';
            section.style.padding = '0';
            // Set overflow to hidden to prevent potential gaps
            section.style.overflow = 'hidden';
            
            // Force this panel's image container to fill completely
            const imageContainer = section.querySelector('.image-container');
            if (imageContainer) {
              imageContainer.style.width = '100%';
              imageContainer.style.height = '100%';
              imageContainer.style.margin = '0';
              imageContainer.style.padding = '0';
              imageContainer.style.overflow = 'hidden';
              imageContainer.style.backgroundColor = '#000';
            }
            
            // Force the image to fill its container
            const img = section.querySelector('img');
            if (img) {
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.objectFit = 'cover';
              img.style.margin = '0';
              img.style.padding = '0';
              img.style.display = 'block';
            }
          }
          
          // Set z-index to create proper layering with more gradual progression
          // This helps prevent sudden overlapping issues
          if (index === 0) {
            section.style.zIndex = 10; // First panel (background)
          } else if (index === 1) {
            section.style.zIndex = 20; // Second panel (text)
          } else if (index === 2) {
            section.style.zIndex = 20; // Third panel (first image) - same as text
          } else if (index === 3) {
            section.style.zIndex = 40; // Fourth panel (second image) - higher for no gap
          } else {
            section.style.zIndex = 40 + (index - 3); // Fifth and beyond with incremental z-index
          }
        }
      });
    }
  }, [project, isMobileOrTablet]);

  // Add a useEffect to update indicators when currentSection changes
  useEffect(() => {
    updateIndicatorStyles();
  }, [currentSection]);

  // Touch events with enhanced physics-based momentum
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    lastTouchX.current = e.touches[0].clientX;
    
    // Detect if user is on macOS
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    
    // Initialize touch tracking for physics-based scrolling
    window.touchTracking = {
      positions: [], // Track position history for velocity calculation
      startTime: Date.now(),
      lastTime: Date.now(),
      velocity: 0, // Track velocity for smoother deceleration
      isMac: isMac, // Store platform info
      // Detect if this is likely a trackpad two-finger gesture on Mac
      isTrackpadGesture: isMac && e.touches.length === 2 && Math.abs(e.touches[0].clientX - e.touches[1].clientX) < 50
    };
    
    // Add initial position
    window.touchTracking.positions.push({
      x: touchStartX.current,
      time: window.touchTracking.startTime
    });
    
    // Cancel any ongoing animations for immediate response
    if (scrollRafRef.current) {
      cancelAnimationFrame(scrollRafRef.current);
      isScrollingRef.current = false;
    }
    
    // Prevent default to stop browser navigation
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!pageRef.current || !project?.projectContent?.sections) return;
    
    const touchX = e.touches[0].clientX;
    const deltaX = lastTouchX.current - touchX;
    const now = Date.now();
    
    // Track position for velocity calculation (limit to 5 most recent)
    window.touchTracking.positions.unshift({ x: touchX, time: now });
    if (window.touchTracking.positions.length > 5) {
      window.touchTracking.positions.pop();
    }
    
    // Calculate a smoothed version of the delta to avoid jitter
    let smoothedDelta = deltaX;
    if (window.touchTracking.positions.length >= 3) {
      // Average recent movement for smoother response
      const recentDeltas = [];
      for (let i = 1; i < Math.min(3, window.touchTracking.positions.length); i++) {
        const older = window.touchTracking.positions[i];
        const newer = window.touchTracking.positions[i-1];
        const posDelta = older.x - newer.x;
        recentDeltas.push(posDelta);
      }
      
      // Calculate weighted average (favor most recent)
      let totalWeight = 0;
      let weightedSum = 0;
      for (let i = 0; i < recentDeltas.length; i++) {
        const weight = recentDeltas.length - i;
        weightedSum += recentDeltas[i] * weight;
        totalWeight += weight;
      }
      
      // Use weighted average for smoother feel
      smoothedDelta = totalWeight > 0 ? weightedSum / totalWeight : deltaX;
    }
    
    const sectionWidth = window.innerWidth;
    const maxScroll = sectionWidth * (project.projectContent.sections.length - 1);
    
    // Apply with sensitivity optimized for the device/input method
    let scrollMultiplier = 3.5; // Base multiplier
    
    // Adjust for Mac trackpad if detected
    if (window.touchTracking.isMac) {
      // For Mac trackpads, we need more precise control
      if (window.touchTracking.isTrackpadGesture) {
        // Two-finger gesture on Mac trackpad - high precision mode
        scrollMultiplier = 2.0;
        
        // For trackpad gestures, also introduce a small threshold to filter out tiny movements
        if (Math.abs(smoothedDelta) < 0.7) {
          smoothedDelta = 0;
        }
      } else {
        // Regular touch on Mac - slightly lower multiplier for better control
        scrollMultiplier = 3.0;
      }
    }
    
    const newScrollLeft = Math.min(Math.max(0, pageRef.current.scrollLeft + smoothedDelta * scrollMultiplier), maxScroll);
    
    // Update scroll position directly for touch movement
    pageRef.current.scrollLeft = newScrollLeft;
    
    // Calculate current velocity for momentum
    if (window.touchTracking.positions.length >= 2) {
      const newest = window.touchTracking.positions[0];
      const older = window.touchTracking.positions[window.touchTracking.positions.length - 1];
      const timeSpan = newest.time - older.time;
      if (timeSpan > 0) {
        window.touchTracking.velocity = (older.x - newest.x) / timeSpan;
      }
    }
    
    // Update tracking
    lastTouchX.current = touchX;
    window.touchTracking.lastTime = now;
    currentScrollRef.current = pageRef.current.scrollLeft;
    targetScrollRef.current = currentScrollRef.current;
    
    updateCurrentSection();
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!pageRef.current || !window.touchTracking || window.touchTracking.positions.length < 2) return;
    
    // Get platform info from saved tracking
    const isMac = window.touchTracking.isMac;
    const isTrackpadGesture = window.touchTracking.isTrackpadGesture;
    
    // Use stored velocity for more consistent momentum
    const velocity = window.touchTracking.velocity;
    
    // Apply momentum based on velocity
    if (Math.abs(velocity) > 0.1) { // Minimum velocity threshold
      const sectionWidth = window.innerWidth;
      const maxScroll = sectionWidth * (project.projectContent.sections.length - 1);
      
      // Calculate momentum with enhanced physics, tuned for the device
      let velocityFactor;
      
      if (isMac) {
        if (isTrackpadGesture) {
          // For Mac trackpad two-finger gestures - more controlled momentum
          velocityFactor = Math.min(3.0, Math.abs(velocity) * 10); // Increased from 1.8 and 6
        } else {
          // Regular touch on Mac
          velocityFactor = Math.min(3.5, Math.abs(velocity) * 12); // Increased from 2.2 and 7
        }
      } else {
        // Non-Mac devices - standard momentum calculation
        velocityFactor = Math.min(2.5, Math.abs(velocity) * 8);
      }
      
      // Calculate base momentum, adjusted for device type
      const momentumMultiplier = isMac ? (isTrackpadGesture ? 1.2 : 1.4) : 0.7; // Increased from 0.55/0.65 for Mac
      const baseMomentum = Math.sign(velocity) * (velocityFactor * sectionWidth * momentumMultiplier);
      
      // Add momentum to current position with bounds checking
      const targetPosition = Math.max(0, Math.min(
        currentScrollRef.current + baseMomentum,
        maxScroll
      ));
      
      // Apply smooth scrolling with the calculated momentum
      smoothScrollTo(targetPosition);
    }
  };

  // Function to handle navigation back to projects
  const handleBackToProjects = () => {
    document.body.style.backgroundColor = '';
    document.documentElement.style.backgroundColor = '';
    
    // Remove classes immediately
    document.body.classList.remove('dark-background');
    document.body.classList.remove('light-background');
    document.body.classList.remove('single-project-page-active');
    
    // Navigate to the specific category page with correct URL pattern
    navigate(`/all-projects/${category}`);
  };

  // Return loading state if no project found
  if (!project) {
    return (
      <div className="project-loading">
        <h2>Loading project...</h2>
      </div>
    );
  }

  // Render mobile version for mobile/tablet devices
  if (isMobileOrTablet) {
    return <SingleProjectMobile project={project} />;
  }

  // Main render for desktop
  return (
    <>
      {/* Back to Projects button - moved outside container to ensure it's always visible */}
      <button 
        className="back-to-projects-btn" 
        onClick={handleBackToProjects}
        aria-label="Back to projects"
      >
        <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 1L1 10L10 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 10H29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div 
        ref={pageRef} 
        className={`single-project-page ${isReady ? 'is-ready' : ''}`}
        style={{ backgroundColor: '#000' }}
      >
        <div ref={containerRef} className="single-project-container">
          {project.projectContent && project.projectContent.sections && project.projectContent.sections.map((section, index) => (
            <div 
              key={index}
              className={`panel${index === 0 ? ' first-panel' : ''}${index === 1 ? ' second-panel' : ''}${index === 2 ? ' third-panel' : ''}`}
              style={{ backgroundColor: section.backgroundColor || '#000' }}
              data-section-type={section.type}
            >
              {/* Handle both media and Video types */}
              {(section.type === 'media' || section.type === 'Video') && (
                <>
                  {section.type === "Video" || (section.media && (section.media.endsWith('.mp4') || section.media.endsWith('.webm'))) ? (
                    <div className="video-container-single-project">
                      <video 
                        src={section.media}
                        alt={section.alt || `Project section ${index + 1}`}
                        className="single-project-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100vh',
                          width: 'auto',
                          height: 'auto',
                          margin: '0 auto',
                          display: 'block',
                          objectFit: 'contain'
                        }}
                        onLoadedMetadata={(e) => {
                          // Detect if video is portrait or landscape
                          const video = e.target;
                          const isPortrait = video.videoHeight > video.videoWidth;
                          const aspectRatio = video.videoWidth / video.videoHeight;
                          
                          // Get relevant parent elements
                          const videoContainer = video.closest('.video-container-single-project');
                          const panel = video.closest('.panel');
                          
                          if (isPortrait) {
                            // For portrait videos
                            video.setAttribute('style', 'portrait: true; max-height: 100vh !important; width: auto !important; height: auto !important; object-fit: contain !important; margin: 0 auto !important;');
                            video.setAttribute('data-orientation', 'portrait');
                            
                            if (panel) {
                              // Adjust panel to fit the video
                              panel.style.width = 'auto';
                              panel.style.minWidth = '100vw';
                              panel.style.display = 'flex';
                              panel.style.justifyContent = 'center';
                              panel.style.alignItems = 'center';
                              panel.style.backgroundColor = 'transparent';
                            }
                            
                            if (videoContainer) {
                              // Adjust container to match video
                              videoContainer.style.width = 'auto';
                              videoContainer.style.height = 'auto';
                              videoContainer.style.backgroundColor = 'transparent';
                            }
                          } else {
                            // For landscape videos
                            video.setAttribute('style', 'max-width: 100% !important; max-height: 100vh !important; width: auto !important; height: auto !important; object-fit: contain !important; margin: 0 auto !important;');
                            video.setAttribute('data-orientation', 'landscape');
                            
                            if (panel) {
                              // For landscape, we still want it to fit well in the viewport
                              panel.style.width = '100vw';
                              panel.style.height = '100vh';
                              panel.style.backgroundColor = 'transparent';
                            }
                            
                            if (videoContainer) {
                              // For landscape, container should fill panel width
                              videoContainer.style.width = '100%';
                              videoContainer.style.height = '100%';
                            }
                          }
                          
                          // Force browser to recalculate layout
                          setTimeout(() => {
                            if (panel) panel.style.display = 'flex';
                          }, 50);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="image-container">
                      <img 
                        src={section.media || section.imageName} 
                        alt={section.alt || `Project section ${index + 1}`} 
                        className="single-project-image"
                        onLoad={(e) => {
                          // Adjust container size to match image's natural dimensions
                          const img = e.target;
                          const container = img.parentElement;
                          const panel = container.parentElement;
                          
                          if (img && container) {
                            // Use the image's natural dimensions
                            const imgWidth = img.naturalWidth;
                            const imgHeight = img.naturalHeight;
                            
                            // Set container width/height to match image dimensions
                            if (imgWidth && imgHeight) {
                              // Calculate aspect ratio
                              const imgRatio = imgWidth / imgHeight;
                              const viewportHeight = window.innerHeight;
                              const viewportWidth = window.innerWidth;
                              
                              // Make sure images always fill the panel completely
                              img.style.width = '100%';
                              img.style.height = '100%';
                              img.style.objectFit = 'cover';
                              
                              // Make container fill the panel
                              container.style.width = '100%';
                              container.style.height = '100%';
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </>
              )}
              {section.type === 'text' && (
                <div className="text-content" style={{ 
                  backgroundColor: section.backgroundColor || project.backgroundColor || '#090909',
                  color: section.textColor || '#FFFFFF'
                }}>
                  <div className="main-text">
                    {section.slogan && <h2 className="panel-main-title">{section.slogan}</h2>}
                    {section.subTitle && <h3 className="panel-sub-title">{section.subTitle}</h3>}
                  </div>
                  <div className="paragraphs">
                    {section.text && (
                      Array.isArray(section.text) ? 
                      section.text.map((paragraph, i) => (
                        <p key={i} className="panel-paragraph">{paragraph}</p>
                      )) : 
                      <p className="panel-paragraph">{section.text}</p>
                    )}
                  </div>
                  <div className="bottom-info">
                    <div className="info-row label-row">
                      {section.fieldName && (
                        <div className="field-info">
                          <span className="label">Field Name</span>
                        </div>
                      )}
                      {section.services && (
                        <div className="services-info">
                          <span className="label">SERVICE</span>
                        </div>
                      )}
                    </div>
                    <div className="info-row value-row">
                      {section.fieldName && (
                        <div className="field-info">
                          <span className="value">{section.fieldName}</span>
                        </div>
                      )}
                      {section.services && (
                        <div className="services-info">
                          <span className="value">{section.services}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {section.type === 'text-section' && (
                <div className="text-section-content" style={{ 
                  backgroundColor: section.backgroundColor || project.backgroundColor || '#000000',
                  color: section.textColor || '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  padding: '0 20%',
                  textAlign: 'center'
                }}>
                  <div className="centered-text">
                    {section.text && (
                      Array.isArray(section.text) ? 
                      section.text.map((paragraph, i) => (
                        <p key={i} className="text-section-paragraph" style={{
                          maxWidth: '600px',
                          margin: i === 0 ? '0 auto' : '20px auto 0',
                          lineHeight: '1.5',
                          letterSpacing: '0.05em'
                        }}>
                          {paragraph}
                        </p>
                      )) : 
                      <p className="text-section-paragraph" style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.5',
                        letterSpacing: '0.05em'
                      }}>
                        {section.text}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const SingleProjectPage = Transition(SingleProject);
export default SingleProjectPage;