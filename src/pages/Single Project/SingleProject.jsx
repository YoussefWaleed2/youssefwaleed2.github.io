import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
  // navigate is not used since navigation functions were removed
  // const navigate = useNavigate();
  
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

  // Set page title
  useEffect(() => {
    if (project) {
      document.title = `${project.title} | VZBL`;
    }
  }, [project]);

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

  // Update smoothScrollTo function to prevent scrolling past last panel
  const smoothScrollTo = (targetX) => {
    if (!pageRef.current || !project?.projectContent?.sections) return;
    
    // Calculate max scroll position
    const sectionWidth = window.innerWidth;
    const maxScroll = sectionWidth * (project.projectContent.sections.length - 1);
    
    // Strictly enforce limits with Math.min/max
    const boundedTarget = Math.min(Math.max(0, targetX), maxScroll);
    targetScrollRef.current = boundedTarget;
    
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;
    
    const animateScroll = () => {
      currentScrollRef.current = pageRef.current.scrollLeft;
      const distance = targetScrollRef.current - currentScrollRef.current;
      
      // Immediately stop if we're at the end and trying to go further
      if (currentScrollRef.current >= maxScroll && distance > 0) {
        isScrollingRef.current = false;
        pageRef.current.scrollLeft = maxScroll; // Force to max
        return;
      }
      
      // Immediately stop if we're at the beginning and trying to go back
      if (currentScrollRef.current <= 0 && distance < 0) {
        isScrollingRef.current = false;
        pageRef.current.scrollLeft = 0; // Force to start
        return;
      }
      
      if (Math.abs(distance) < 0.5) {
        // Snap exactly to target
        pageRef.current.scrollLeft = targetScrollRef.current;
        isScrollingRef.current = false;
        return;
      }
      
      const move = distance * 0.18;
      
      // Apply bounded scroll position with extra checks
      const newScrollLeft = currentScrollRef.current + move;
      
      // Extra boundary protection
      if (newScrollLeft < 0) {
        pageRef.current.scrollLeft = 0;
      } else if (newScrollLeft > maxScroll) {
        pageRef.current.scrollLeft = maxScroll;
      } else {
        pageRef.current.scrollLeft = newScrollLeft;
      }
      
      scrollRafRef.current = requestAnimationFrame(animateScroll);
    };
    
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
      panel.style.zIndex = index + 10;
      panel.style.transition = 'transform 0.2s ease-out';
      panel.style.willChange = 'transform';
    });

    // Animation loop for overlay effect
    const animateOverlay = () => {
      // Get panels starting from third
      const thirdAndBeyond = Array.from(panels).slice(2);
      const scrollPastSecond = Math.max(0, currentScrollRef.current - sectionWidth + 200);
      const moveAmount = -Math.min(scrollPastSecond * 0.7, sectionWidth * 0.7);
      gsap.to(thirdAndBeyond, {
        x: moveAmount,
        duration: 0.15,
        ease: 'power1.out',
        overwrite: true
      });
      scrollRafRef.current = requestAnimationFrame(animateOverlay);
    };
    scrollRafRef.current = requestAnimationFrame(animateOverlay);

    // Wheel event for smooth scroll
    const handleWheel = (e) => {
      if (!pageRef.current || !project?.projectContent?.sections) return;
      
      e.preventDefault();
      const delta = e.deltaY || e.deltaX;
      const sectionWidth = window.innerWidth;
      const maxScroll = sectionWidth * (project.projectContent.sections.length - 1);
      
      // Get current position and enforce bounds
      const currentPos = pageRef.current.scrollLeft;
      const targetPos = Math.min(Math.max(0, currentPos + delta), maxScroll);
      
      smoothScrollTo(targetPos);
    };
    pageRef.current.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      if (pageRef.current) pageRef.current.removeEventListener('wheel', handleWheel);
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
        setTimeout(updateIndicatorStyles, 10);
      }
      return;
    }
    
    const newSection = Math.round(scrollPosition / sectionWidth);
    
    if (newSection !== currentSection && newSection >= 0 && newSection < project.projectContent.sections.length) {
      setCurrentSection(newSection);
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
    
    // Set CSS variable for panel count
    document.documentElement.style.setProperty('--panel-count', sectionCount);

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
          section.style.zIndex = index + 10;
          
          // Add transform properties for hardware acceleration
          section.style.willChange = 'transform';
          section.style.transform = 'translateZ(0)';
          section.style.backfaceVisibility = 'hidden';
        }
      });
    }
    
    // Setup page ref for scrolling with hardware acceleration
    if (pageRef.current) {
      pageRef.current.style.overflowX = 'scroll';
      pageRef.current.style.overflowY = 'hidden';
      pageRef.current.style.width = '100vw';
      pageRef.current.style.height = '100vh';
      pageRef.current.style.scrollBehavior = 'auto';
      pageRef.current.style.scrollSnapType = 'none'; // Remove snap for smoother scrolling
      
      // Add hardware acceleration for better performance
      pageRef.current.style.willChange = 'scroll-position';
      pageRef.current.style.transform = 'translateZ(0)';
      pageRef.current.style.backfaceVisibility = 'hidden';
      
      // Force GPU acceleration
      pageRef.current.style.perspective = '1000px';
      pageRef.current.style.webkitOverflowScrolling = 'touch';
    }
    
    // Calculate max scroll position
    const maxScrollPosition = totalWidth - sectionWidth;
    
    // Wheel event handler with significantly increased speed
    const handleWheel = (e) => {
      if (!pageRef.current || !project?.projectContent?.sections) return;
      
      e.preventDefault();
      
      // Calculate new target scroll position with significantly increased multiplier
      const delta = (e.deltaY || e.deltaX) * 3.0; // 3x multiplier for much faster scrolling
      const newTarget = Math.max(0, Math.min(currentScrollRef.current + delta, maxScrollPosition));
      
      // Smooth scroll to the new position
      smoothScrollTo(newTarget);
    };
    
    // Touch events for mobile-like swipe on desktop with increased sensitivity
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      lastTouchX.current = e.touches[0].clientX;
      
      // Prevent default to stop browser navigation
      e.preventDefault();
    };
    
    const handleTouchMove = (e) => {
      if (!pageRef.current || !project?.projectContent?.sections) return;
      
      const touchX = e.touches[0].clientX;
      const deltaX = lastTouchX.current - touchX;
      const sectionWidth = window.innerWidth;
      const maxScroll = sectionWidth * (project.projectContent.sections.length - 1);
      
      // Update scroll position with bounds check
      const newScrollLeft = Math.min(Math.max(0, pageRef.current.scrollLeft + deltaX * 4.0), maxScroll);
      pageRef.current.scrollLeft = newScrollLeft;
      
      lastTouchX.current = touchX;
      currentScrollRef.current = pageRef.current.scrollLeft;
      targetScrollRef.current = pageRef.current.scrollLeft;
      
      updateCurrentSection();
      e.preventDefault();
    };
    
    const handleTouchEnd = (e) => {
      if (!pageRef.current) return;
      
      // Calculate if this was a swipe or tap
      const touchEndX = e.changedTouches[0].clientX;
      const totalDeltaX = touchStartX.current - touchEndX;
      
      // For small movements, snap to nearest section
      if (Math.abs(totalDeltaX) < 50) {
        const sectionWidth = window.innerWidth;
        const currentPos = pageRef.current.scrollLeft;
        const nearestSection = Math.round(currentPos / sectionWidth);
        
        // Smooth scroll to the nearest section
        smoothScrollTo(nearestSection * sectionWidth);
      } else {
        // For swipes, maintain momentum but ensure we end on a section boundary
        const direction = totalDeltaX > 0 ? 1 : -1;
        const sectionWidth = window.innerWidth;
        const currentPos = pageRef.current.scrollLeft;
        const currentSection = Math.floor(currentPos / sectionWidth);
        const targetSection = Math.max(0, Math.min(currentSection + direction, sectionCount - 1));
        
        // Smooth scroll to the target section
        smoothScrollTo(targetSection * sectionWidth);
      }
    };
    
    // Native scroll handler
    const handleScroll = () => {
      if (!pageRef.current || isScrollingRef.current) return;
      
      // Update reference values when user manually scrolls
      currentScrollRef.current = pageRef.current.scrollLeft;
      targetScrollRef.current = pageRef.current.scrollLeft;
      
      // Update current section
      updateCurrentSection();
    };

    // Handle click on scroll indicators
    const handleIndicatorClick = (index) => {
      const sectionWidth = window.innerWidth;
      smoothScrollTo(index * sectionWidth);
    };
    
    // Add event listeners to scroll indicators
    const indicators = document.querySelectorAll('.scroll-indicator');
    indicators.forEach((indicator, index) => {
      const handler = () => handleIndicatorClick(index);
      indicator.addEventListener('click', handler);
      indicatorHandlersRef.current.push(handler);
    });
    
    // Add event listeners
    if (pageRef.current) {
      pageRef.current.addEventListener('wheel', handleWheel, { passive: false });
      pageRef.current.addEventListener('scroll', handleScroll);
      pageRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
      pageRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
      pageRef.current.addEventListener('touchend', handleTouchEnd);
    }
    
    // Make sure all content is visible
    gsap.set('.panel', { opacity: 1, autoAlpha: 1 });
    
    // Initial update of current section
    updateCurrentSection();
    
    // Ensure we start at section 0 with proper active indicator
    if (pageRef.current && pageRef.current.scrollLeft < 10) {
      setCurrentSection(0);
      setTimeout(() => {
        pageRef.current.scrollLeft = 0;
      }, 50);
    }
    
    // Handle resize
    const handleResize = debounce(() => {
      // Check if device is now mobile
      const isMobileNow = detectMobileOrTablet();
      
      // If changing between desktop and mobile view, handle the transition
      if (isMobileNow !== isMobileOrTablet) {
        setIsMobileOrTablet(isMobileNow);
        return; // Let the component re-render with new state
      }
      
      // Only continue if we're in desktop view
      if (isMobileOrTablet) return;
      
      // Recalculate dimensions
      const newWidth = window.innerWidth;
      const newTotalWidth = newWidth * sectionCount;
      
      // Update container dimensions
      if (containerRef.current) {
        containerRef.current.style.width = `${newTotalWidth}px`;
      }
      
      // Update each section width
      sections.forEach((section, index) => {
        if (section) {
          section.style.width = `${newWidth}px`;
          section.style.left = `${index * newWidth}px`;
        }
      });
      
      // Update max scroll value
      const newMaxScroll = newTotalWidth - newWidth;
      
      // If current scroll is beyond the new max, adjust it
      if (pageRef.current && pageRef.current.scrollLeft > newMaxScroll) {
        pageRef.current.scrollLeft = newMaxScroll;
      }
      
      // Update current section after resize
      updateCurrentSection();
    }, 150);
    
    window.addEventListener('resize', handleResize);
    
    // Initial animations
    gsap.from('.panel', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        // Ensure all panels are visible after animation
        gsap.set('.panel', { clearProps: "all" });
      }
    });
    
    // Add a direct scroll event listener to prevent scrolling past bounds
    const enforceScrollBounds = () => {
      if (!pageRef.current || !project?.projectContent?.sections) return;
      
      const sectionWidth = window.innerWidth;
      const maxScroll = sectionWidth * (project.projectContent.sections.length - 1);
      
      // Simple direct correction if we go beyond limits
      if (pageRef.current.scrollLeft > maxScroll) {
        pageRef.current.scrollLeft = maxScroll;
      }
    };
    
    // Add both passive and non-passive listeners to ensure this always runs
    pageRef.current.addEventListener('scroll', enforceScrollBounds, { passive: true });
    pageRef.current.addEventListener('scroll', enforceScrollBounds, { passive: false });
    
    // Add keyboard navigation after touch events and scroll are set up
    const handleKeyDown = (e) => {
      // Handle left/right arrow keys
      if (e.key === 'ArrowLeft' && currentSection > 0) {
        smoothScrollTo((currentSection - 1) * sectionWidth);
      } else if (e.key === 'ArrowRight' && currentSection < project.projectContent.sections.length - 1) {
        smoothScrollTo((currentSection + 1) * sectionWidth);
      }
    };

    // Add keyboard listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      if (pageRef.current) {
        pageRef.current.removeEventListener('wheel', handleWheel);
        pageRef.current.removeEventListener('scroll', handleScroll);
        pageRef.current.removeEventListener('touchstart', handleTouchStart);
        pageRef.current.removeEventListener('touchmove', handleTouchMove);
        pageRef.current.removeEventListener('touchend', handleTouchEnd);
        
        // Remove scroll event listeners
        pageRef.current.removeEventListener('scroll', enforceScrollBounds, { passive: true });
        pageRef.current.removeEventListener('scroll', enforceScrollBounds, { passive: false });
      }
      
      // Remove indicator click listeners
      const indicators = document.querySelectorAll('.scroll-indicator');
      indicators.forEach((indicator, index) => {
        if (indicator && indicatorHandlersRef.current[index]) {
          indicator.removeEventListener('click', indicatorHandlersRef.current[index]);
        }
      });
      
      // Clear the handlers array
      indicatorHandlersRef.current = [];
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [project, isMobileOrTablet]);

  // Add a useEffect to update indicators when currentSection changes
  useEffect(() => {
    updateIndicatorStyles();
  }, [currentSection]);

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
    <div 
      ref={pageRef} 
      className={`single-project-page ${isReady ? 'is-ready' : ''}`}
    >
      <div ref={containerRef} className="single-project-container">
        {project.projectContent && project.projectContent.sections && project.projectContent.sections.map((section, index) => (
          <div 
            key={index}
            className={`panel${index === 0 ? ' first-panel' : ''}${index === 1 ? ' second-panel' : ''}${index === 2 ? ' third-panel' : ''}`}
            style={{ backgroundColor: section.backgroundColor || '#000' }}
          >
            {section.type === 'media' && (
              <div className="image-container">
                <img 
                  src={section.media || section.imageName} 
                  alt={section.alt || `Project section ${index + 1}`} 
                  className="single-project-image"
                />
              </div>
            )}
            {section.type === 'text' && (
              <div className="text-content" style={{ 
                backgroundColor: section.backgroundColor || '#090909',
                color: section.textColor || '#FFFFFF'
              }}>
                <div className="main-text">
                  {section.slogan && <h2 className="panel-main-title">{section.slogan}</h2>}
                  {section.subTitle && <h3 className="panel-sub-title">{section.subTitle}</h3>}
                </div>
                <div className="paragraphs">
                  {section.text && <p className="panel-paragraph">{section.text}</p>}
                </div>
                <div className="bottom-info">
                  {section.fieldName && (
                    <div className="field-info">
                      <span className="label">Field Name</span>
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
            )}
          </div>
        ))}
      </div>
      
      {/* Scroll instructions */}
      <div className="scroll-instructions">
        Scroll or use arrow keys to navigate
      </div>
    </div>
  );
};

const SingleProjectPage = Transition(SingleProject);
export default SingleProjectPage;