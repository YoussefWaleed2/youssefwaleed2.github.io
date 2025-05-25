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
  
  // Debug log to check routing

  // Helper functions for media handling
  // Handle video loaded metadata
  const handleVideoLoaded = (e) => {
    // Detect if video is portrait or landscape
    const video = e.target;
    const isPortrait = video.videoHeight > video.videoWidth;
    
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
  };
  
  // Handle image load
  const handleImageLoad = (e) => {
    // Adjust container size to match image's natural dimensions
    const img = e.target;
    const container = img.parentElement;
    
    if (img && container) {
      // Use the image's natural dimensions
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      
      // Set container width/height to match image dimensions
      if (imgWidth && imgHeight) {
        // Make sure images always fill the panel completely
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        // Make container fill the panel
        container.style.width = '100%';
        container.style.height = '100%';
      }
    }
  };

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
        return null;
      }
      
      // Find the project by name
      const foundProject = categoryProjects.find(
        p => p.title.toLowerCase().replace(/ /g, '-') === projectName.toLowerCase()
      );
      
      if (!foundProject) {
        return null;
      }
      
      return foundProject || null;
    };
    
    const projectData = findProject();
    
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
        panels.forEach((panel) => {
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
      
      // More consistent easing factor for smoother scrolling
      // Uses a standardized approach that works well across devices
      let easeFactor;
      
      // Base the ease factor on distance to create more natural deceleration
      const distanceAbs = Math.abs(distance);
      
      if (distanceAbs > sectionWidth * 0.7) {
        // For long distances - moderate speed for consistent movement
        easeFactor = 0.12;
      } else if (distanceAbs > sectionWidth * 0.3) {
        // Medium distance - slightly gentler easing
        easeFactor = 0.10;
      } else {
        // Small distance - precise easing for final positioning
        easeFactor = 0.08;
      }
      
      // Apply bounded scroll position with smooth interpolation
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

  // Effect for desktop horizontal scrolling with improved touchpad handling
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
      } else if (index % 2 === 1) {
        // All odd-indexed panels (2nd, 4th, 6th, etc.) get higher z-index
        panel.style.zIndex = '40'; // Text panel
      } else {
        // All other panels should stack behind the text panels
        // Decreasing z-index for proper stacking
        panel.style.zIndex = `${30 - Math.floor(index / 2)}`;
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
      
      // Apply the transform to all odd-indexed panels (2nd, 4th, 6th, etc.)
      panels.forEach((panel, index) => {
        if (index % 2 === 1) {
          // Use direct DOM manipulation instead of GSAP for better performance
          panel.style.transform = `translateX(${textPanelMoveAmount}px)`;
          
          // Also move the next panel (if it exists) with the same transform
          // to maintain the overlay effect for image panels following each text panel
          if (panels[index + 1]) {
            panels[index + 1].style.transform = `translateX(${textPanelMoveAmount}px)`;
          }
        }
      });
      
      // Continue animation loop - use high priority requestAnimationFrame
      // for smoother animation, especially during scrolling
      scrollRafRef.current = requestAnimationFrame(animateOverlay);
    };
    scrollRafRef.current = requestAnimationFrame(animateOverlay);

    // Create a more advanced scroll manager with gesture queue
    const scrollManager = {
      // Core state
      isScrolling: false,
      targetX: 0,
      currentX: 0,
      gestureQueue: [],
      lastWheelTime: 0,
      
      // Animation frame reference
      rafId: null,
      
      // Platform detection
      isMac: /Mac|iPod|iPhone|iPad/.test(navigator.platform),
      
      // Momentum and velocity tracking
      velocity: 0,
      lastScrollX: 0,
      lastScrollTime: 0,
      
      // Advanced configuration
      options: {
        baseFriction: 0.89,  // Base deceleration rate (lower = faster stop)
        minMomentumValue: 0.1, // When to stop momentum scrolling
        maxVelocity: 80, // Maximum velocity cap to prevent extreme scrolling
        smoothing: 0.65, // How much to smooth changes in velocity (higher = smoother but less responsive)
        bounceStrength: 0.15, // How strong the bounce effect is at boundaries
        bounceThreshold: 300, // The distance from edge where bounce starts to be applied
      },
      
      // Queue a new scroll gesture request
      queueGesture(deltaX, deltaY, isTrackpad) {
        const now = Date.now();
        const timeSinceLastWheel = now - this.lastWheelTime;
        this.lastWheelTime = now;
        
        // Determine primary delta to use (horizontal or vertical)
        let delta = deltaY;
        
        // For Mac devices, prioritize horizontal gestures on trackpads
        if (this.isMac && isTrackpad && Math.abs(deltaX) > Math.abs(deltaY) * 0.5) {
          delta = deltaX;
        }
        
        // Scale deltas to reasonable values based on device and input type
        let scaledDelta;
        
        if (isTrackpad) {
          // For trackpad, use gentler scaling with better precision
          scaledDelta = this.isMac ? delta * 2.8 : delta * 2.4;
        } else {
          // For mouse wheels - stronger scaling
          scaledDelta = delta * 4.8;
        }
        
        // Calculate how much influence this gesture should have
        // If gestures are very close together, blend them more smoothly
        let influence = 1;
        if (timeSinceLastWheel < 150) {
          // For rapid gestures, blend more smoothly to prevent stopping
          influence = Math.min(1, 0.5 + (timeSinceLastWheel / 300));
        }
        
        // Calculate the precise target position with bounds checking
        const maxScrollX = (project.projectContent.sections.length - 1) * window.innerWidth;
        
        // Get current position for calculation
        const currentX = pageRef.current?.scrollLeft || 0;
        
        // Update velocity based on this gesture (with smoothing)
        if (this.lastScrollTime > 0) {
          const timeDelta = now - this.lastScrollTime;
          if (timeDelta > 0) {
            // Calculate raw velocity
            const instantVelocity = scaledDelta / (timeDelta / 16); // Normalize to per-frame velocity
            
            // Apply smoothing to velocity changes
            this.velocity = (this.velocity * this.options.smoothing) + 
                          (instantVelocity * (1 - this.options.smoothing));
            
            // Cap velocity to reasonable values
            this.velocity = Math.max(-this.options.maxVelocity, 
                              Math.min(this.options.maxVelocity, this.velocity));
          }
        }
        
        // Update last position and time for next velocity calculation
        this.lastScrollTime = now;
        
        // Calculate new target based on current position, delta, and momentum
        const newTarget = Math.max(0, Math.min(currentX + scaledDelta, maxScrollX));
        
        // Update target considering influence
        if (influence >= 1) {
          // Full influence - directly set target
          this.targetX = newTarget;
        } else {
          // Partial influence - blend with current target
          this.targetX = (this.targetX * (1 - influence)) + (newTarget * influence);
        }
        
        // Start animation loop if not already running
        if (!this.isScrolling) {
          this.isScrolling = true;
          this.animate();
        }
      },
      
      // Main animation loop - runs continuously while scrolling
      animate() {
        // Get current scroll position
        this.currentX = pageRef.current?.scrollLeft || 0;
        
        // Calculate distance to target
        const distanceToTarget = this.targetX - this.currentX;
        const absDistance = Math.abs(distanceToTarget);
        
        // Check if we need to apply bouncing at edges
        const maxScrollX = (project.projectContent.sections.length - 1) * window.innerWidth;
        let bounceEffect = 0;
        
        if (this.currentX <= 0 && distanceToTarget < 0) {
          // At left edge, trying to scroll more left
          bounceEffect = Math.abs(distanceToTarget) * this.options.bounceStrength;
        } else if (this.currentX >= maxScrollX && distanceToTarget > 0) {
          // At right edge, trying to scroll more right
          bounceEffect = -Math.abs(distanceToTarget) * this.options.bounceStrength;
        }
        
        // If we're very close to target and no momentum/bounce, snap to position and stop
        if (absDistance < 0.5 && Math.abs(this.velocity) < this.options.minMomentumValue && bounceEffect === 0) {
          pageRef.current.scrollLeft = this.targetX;
          
          // Check if there's no more scrolling to do
          if (this.gestureQueue.length === 0) {
            this.isScrolling = false;
            this.velocity = 0;
            updateCurrentSection();
            return; // Exit animation loop
          }
        }
        
        // Apply easing based on distance - smoother for larger distances
        let easeFactor;
        
        if (absDistance > window.innerWidth * 0.6) {
          easeFactor = 0.1; // Large distance - moderate speed
        } else if (absDistance > window.innerWidth * 0.3) {
          easeFactor = 0.09; // Medium distance
        } else {
          easeFactor = 0.08; // Small distance - more precise
        }
        
        // Calculate momentum and friction
        if (Math.abs(this.velocity) > this.options.minMomentumValue) {
          // Apply consistent deceleration
          this.velocity *= this.options.baseFriction;
          
          // If we're close to target, reduce velocity more quickly to prevent overshooting
          if (absDistance < window.innerWidth * 0.2) {
            this.velocity *= 0.9;
          }
          
          // Apply momentum to target position
          this.targetX += this.velocity;
          
          // Bound target to valid range
          this.targetX = Math.max(0, Math.min(this.targetX, maxScrollX));
        }
        
        // Calculate final move amount (includes regular easing + bouncing if needed)
        const move = (distanceToTarget * easeFactor) + bounceEffect;
        
        // Apply the scroll with bound checking
        if (pageRef.current) {
          pageRef.current.scrollLeft = Math.max(0, Math.min(this.currentX + move, maxScrollX));
        }
        
        // Update section indicator if needed
        updateCurrentSection();
        
        // Continue animation loop
        this.rafId = requestAnimationFrame(() => this.animate());
      },
      
      // Handle wheel event
      handleWheel(e) {
        e.preventDefault();
        
        // Detect if this is likely a trackpad
        const isTrackpad = Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) < 10 || e.deltaMode === 0;
        
        // Queue this gesture
        this.queueGesture(e.deltaX, e.deltaY, isTrackpad);
      },
      
      // Handle touch start
      handleTouchStart(e) {
        touchStartX.current = e.touches[0].clientX;
        lastTouchX.current = e.touches[0].clientX;
        
        // Reset velocity and gesture tracking
        this.velocity = 0;
        this.lastScrollTime = Date.now();
        this.lastScrollX = pageRef.current?.scrollLeft || 0;
        
        // Cancel any ongoing animations for immediate response
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
        }
        
        e.preventDefault();
      },
      
      // Handle touch move
      handleTouchMove(e) {
        const touchX = e.touches[0].clientX;
        const deltaX = lastTouchX.current - touchX;
        const now = Date.now();
        
        // Calculate instantaneous velocity
        const timeDelta = now - this.lastScrollTime;
        if (timeDelta > 0) {
          const instantVelocity = deltaX / (timeDelta / 16); // Normalize to per-frame velocity
          
          // Apply smoothing to velocity changes
          this.velocity = (this.velocity * 0.7) + (instantVelocity * 0.3);
        }
        
        // Update scroll position directly - mobile touch needs immediate feedback
        if (pageRef.current) {
          const maxScrollX = (project.projectContent.sections.length - 1) * window.innerWidth;
          const newScrollX = Math.max(0, Math.min(
            pageRef.current.scrollLeft + deltaX * 1.2, 
            maxScrollX
          ));
          
          pageRef.current.scrollLeft = newScrollX;
          this.targetX = newScrollX; // Set target to current position
        }
        
        // Update tracking
        lastTouchX.current = touchX;
        this.lastScrollTime = now;
        this.lastScrollX = pageRef.current?.scrollLeft || 0;
        
        updateCurrentSection();
        e.preventDefault();
      },
      
      // Handle touch end
      handleTouchEnd(e) {
        // Apply momentum based on final velocity
        if (Math.abs(this.velocity) > 0.5) {
          const momentumFactor = 12; // Strength of momentum
          
          // Calculate target based on velocity and cap it
          const maxScrollX = (project.projectContent.sections.length - 1) * window.innerWidth;
          const momentumDistance = this.velocity * momentumFactor;
          
          // Set new target position with momentum
          this.targetX = Math.max(0, Math.min(
            pageRef.current?.scrollLeft + momentumDistance,
            maxScrollX
          ));
          
          // Start animation if not already running
          if (!this.isScrolling) {
            this.isScrolling = true;
            this.animate();
          }
        }
      },
      
      // Clean up resources
      destroy() {
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
        }
      }
    };
    
    // Add event listeners with the new scroll manager
    if (pageRef.current) {
      // Add wheel handler
      const wheelHandler = (e) => scrollManager.handleWheel(e);
      pageRef.current.addEventListener('wheel', wheelHandler, { passive: false });
      
      // Add touch handlers
      const touchStartHandler = (e) => scrollManager.handleTouchStart(e);
      const touchMoveHandler = (e) => scrollManager.handleTouchMove(e);
      const touchEndHandler = (e) => scrollManager.handleTouchEnd(e);
      
      pageRef.current.addEventListener('touchstart', touchStartHandler, { passive: false });
      pageRef.current.addEventListener('touchmove', touchMoveHandler, { passive: false });
      pageRef.current.addEventListener('touchend', touchEndHandler);
      
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
      scrollManager.destroy();
      
      if (pageRef.current) {
        pageRef.current.removeEventListener('wheel', (e) => scrollManager.handleWheel(e));
        pageRef.current.removeEventListener('touchstart', (e) => scrollManager.handleTouchStart(e));
        pageRef.current.removeEventListener('touchmove', (e) => scrollManager.handleTouchMove(e));
        pageRef.current.removeEventListener('touchend', (e) => scrollManager.handleTouchEnd(e));
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
          
          // Set z-index to create proper layering with more gradual progression
          // Handle even-numbered panels after the first panel with special styling
          if (index === 0) {
            section.style.zIndex = 10; // First panel (background)
          } else if (index % 2 === 1) {
            // All odd-indexed panels (text panels - 2nd, 4th, 6th, etc.)
            section.style.zIndex = 40; // Higher z-index for text panels
            
            // Apply text panel specific styling if this is a text section
            if (section.querySelector('.text-content') || section.querySelector('.text-section-content')) {
              // For text sections, get background from projectsData.json
              const sectionData = project.projectContent.sections[index];
              section.style.backgroundColor = sectionData?.backgroundColor || project.backgroundColor || '#000';
              
              // Add any specific text panel styling here
              section.dataset.isPanelType = 'text';
            }
          } else {
            // Even-indexed panels after the first are typically image/media panels
            // Each one gets a decreasing z-index for proper stacking
            section.style.zIndex = 30 - Math.floor(index / 2);
            section.dataset.isPanelType = 'media';
            
            // Force proper styling for media panels
            const imageContainer = section.querySelector('.image-container');
            if (imageContainer) {
              imageContainer.style.width = '100%';
              imageContainer.style.height = '100%';
              imageContainer.style.margin = '0';
              imageContainer.style.padding = '0';
              imageContainer.style.overflow = 'hidden';
            }
          }
        }
      });
    }
  }, [project, isMobileOrTablet]);

  // Add a useEffect to update indicators when currentSection changes
  useEffect(() => {
    updateIndicatorStyles();
  }, [currentSection]);

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

  // Effect to set background color from data attributes
  useEffect(() => {
    if (!project || !isReady) return;
    
    // Find all elements with data-bg-color attribute
    const elementsWithBgColor = document.querySelectorAll('[data-bg-color]');
    
    // Apply the background color from the data attribute
    elementsWithBgColor.forEach(element => {
      const bgColor = element.getAttribute('data-bg-color');
      if (bgColor) {
        element.style.backgroundColor = bgColor;
        
        // If this is the main page container, also update body and documentElement
        if (element.classList.contains('single-project-page')) {
          document.body.style.backgroundColor = bgColor;
          document.documentElement.style.backgroundColor = bgColor;
        }
      }
    });
  }, [project, isReady, currentSection]);

  // Add this to the component before the return statement
  useEffect(() => {
    if (!project) return;
    
    // Function to apply colors to all elements
    const applyProjectColors = () => {
      // Get the project background color
      const projectBgColor = project.backgroundColor || '#000000';
      
      const allPanels = document.querySelectorAll('.panel');
      
      // First set all panels to the project background color
      allPanels.forEach((panel, index) => {
        // Determine the correct background color for this panel/section
        let bgColor = projectBgColor;
        
        // Check if we have section-specific color
        if (project.projectContent && 
            project.projectContent.sections && 
            index < project.projectContent.sections.length) {
          const sectionData = project.projectContent.sections[index];
          if (sectionData && sectionData.backgroundColor) {
            bgColor = sectionData.backgroundColor;
          }
        }
        
        // Apply directly to panel with !important
        panel.style.cssText += `background-color: ${bgColor} !important;`;
        
        // Apply to text content if this panel has it
        const textContent = panel.querySelector('.text-content, .text-section-content');
        if (textContent) {
          textContent.style.cssText = `background-color: ${bgColor} !important;`;
          
          // Adjust text color based on background lightness
          try {
            const rgb = hexToRgb(bgColor);
            if (rgb) {
              // Calculate brightness (0-255)
              const brightness = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
              
              // If background is light, use dark text; if dark, use light text
              if (brightness > 160) {
                // Light background - use dark text
                textContent.style.color = '#000000';
              } else {
                // Dark background - use light text
                textContent.style.color = '#FFFFFF';
              }
            }
          } catch (err) {
            // Default to white text
            textContent.style.color = '#FFFFFF';
          }
        }
      });
      
      // Also apply to main container
      const mainContainer = document.querySelector('.single-project-page');
      if (mainContainer) {
        mainContainer.style.cssText += `background-color: ${projectBgColor} !important;`;
      }
      
      // Apply to document body and HTML
      document.body.style.cssText += `background-color: ${projectBgColor} !important;`;
      document.documentElement.style.cssText += `background-color: ${projectBgColor} !important;`;
    };
    
    // Apply initially with a delay to ensure DOM is ready
    setTimeout(applyProjectColors, 800);
    
    // Also apply on scroll
    const handleScroll = debounce(() => {
      applyProjectColors();
    }, 200);
    
    // Add scroll event listener
    if (pageRef.current) {
      pageRef.current.addEventListener('scroll', handleScroll);
    }
    
    // Clean up
    return () => {
      if (pageRef.current) {
        pageRef.current.removeEventListener('scroll', handleScroll);
      }
    };
    
  }, [project, isReady]);

  // Return null if no project found
  if (!project) {
    return null;
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
        data-bg-color={
          project.backgroundColor || 
          (project.projectContent?.sections && project.projectContent.sections[0]?.backgroundColor) || 
          '#000'
        }
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
                        onLoadedMetadata={handleVideoLoaded}
                      />
                    </div>
                  ) : (
                    <div className="image-container">
                      <img 
                        src={section.media || section.imageName} 
                        alt={section.alt || `Project section ${index + 1}`} 
                        className="single-project-image"
                        onLoad={handleImageLoad}
                      />
                    </div>
                  )}
                </>
              )}
              {section.type === 'text' && (                <div                   className="text-content"                  data-bg-color={section.backgroundColor || project.backgroundColor || '#090909'}                  style={{                    color: section.textColor || '#FFFFFF'                  }}>
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
                    <div className="info-row">
                      {section.fieldName && (
                        <div className="field-info">
                          <span className="label">FIELD</span>
                          <span className="value">{section.fieldName}</span>
                        </div>
                      )}
                      {section.services && (
                        <div className="services-info">
                          <span className="label">SERVICE</span>
                          <span className="value">{section.services}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
                            {section.type === 'text-section' && (                <div                   className="text-section-content"                   data-bg-color={section.backgroundColor || project.backgroundColor || '#000000'}                  style={{                     color: section.textColor || '#FFFFFF',
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