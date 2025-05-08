import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis';
import Transition from '../../components/Transition/Transition';
import { handleOverlay } from "../../utils/overlayManager";
import projectsData from "../../data/projectsData.json";
import './SingleProject.css';

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
  const navigate = useNavigate();
  
  // State variables
  const [project, setProject] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Refs
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const lenisRef = useRef(null);
  
  // Debug log to check routing
  console.log("SingleProject loaded with category:", category, "projectName:", projectName, "from path:", location.pathname);

  // Mobile detection function
  const detectMobileOrTablet = () => {
    const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || window.innerWidth <= 1024;
  };

  // Handle overlay on mount and unmount
  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobileOrTablet(detectMobileOrTablet());
    }, 300);
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    setProject(projectData);
  }, [category, projectName]);

  // Add a cleanup effect for GSAP ticker when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any remaining GSAP animations
      if (gsap.globalTimeline) {
        const animations = gsap.globalTimeline.getChildren();
        animations.forEach(animation => animation.kill());
      }

      // Kill all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Kill specific GSAP ticker callbacks related to this component
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  // Setup horizontal scrolling with GSAP and Lenis
  useEffect(() => {
    if (isMobileOrTablet || !project || !project.projectContent || !wrapperRef.current || !containerRef.current) return;
    
    // Set isReady immediately to show content
    setIsReady(true);
    
    // Kill any existing ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Get all panels
    let panels = gsap.utils.toArray(".panel");
    const panelsToAnimate = panels.slice(1);
    
    // Make sure panels are visible
    gsap.set(panels, { autoAlpha: 1 });

    // Calculate widths for scrolling
    const totalPanels = panels.length;
    const windowWidth = window.innerWidth;
    let containerWidth = (windowWidth * (totalPanels - 1)) - 480;
    
    // Add extra buffer to prevent reset issue
    containerWidth += windowWidth * 0.5;
    
    // Set container width
    gsap.set(containerRef.current, { width: containerWidth });
    
    // Calculate scroll length
    let scrollLength = containerWidth - windowWidth;
    gsap.set(wrapperRef.current, { height: scrollLength + "px" });
    
    // Initialize Lenis with scroll limits
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      wheelMultiplier: 0.8,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      lerp: 0.1,
      // Add edgeEasing for smoother behavior at edges
      edgeEasing: 0.2
    });
    
    // Store lenis reference for cleanup
    lenisRef.current = lenis;
    
    // Add scroll boundary check with smooth stopping
    lenis.on('scroll', ({ scroll }) => {
      // Handle scroll boundaries with softer limits
      if (scroll < 0) {
        // Prevent overscrolling at start, but use a softer approach
        lenis.scrollTo(0, { 
          immediate: false,
          duration: 0.5,
          lock: false // Don't completely lock scrolling
        });
      } else if (scroll > scrollLength) {
        // Prevent overscrolling at end, but use a softer approach
        lenis.scrollTo(scrollLength, { 
          immediate: false,
          duration: 0.5,
          lock: false // Don't completely lock scrolling
        });
      }
      
      ScrollTrigger.update();
    });
    
    // Connect GSAP ticker to Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
    
    // Create a timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: () => "+=" + scrollLength,
        scrub: 1.5,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true,
        onUpdate: self => {
          // Force render on every update to prevent jank
          if (containerRef.current) {
            const progress = self.progress;
            if (progress <= 0 || progress >= 1) {
              // When at extremes, make sure we don't reset
              return;
            }
          }
        }      }
    });
    
    // Add animations to the timeline with sequential timing
    tl
      .to(containerRef.current, {
        x: () => -scrollLength,
        ease: "none",
        duration: 3
      }, 0)
      .to(panelsToAnimate, {
        
x: "-100%",
        ease: "none",
        duration: 3
      }, 0);
    
    // Create initial animations for sections
    gsap.from(panels, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
    
    // Handle resize
    const handleResize = debounce(() => {
      // Check if device is now mobile
      if (detectMobileOrTablet()) {
        window.location.reload();
        return;
      }
      
      // Recalculate dimensions
      const newWidth = window.innerWidth;
      const newContainerWidth = (newWidth * (totalPanels - 1)) - 480;
      
      // Add extra buffer to prevent reset issue
      const bufferedWidth = newContainerWidth + (newWidth * 0.5);
      
      const newScrollLength = bufferedWidth - newWidth;
      
      // Update container dimensions
      gsap.set(containerRef.current, { width: bufferedWidth });
      gsap.set(wrapperRef.current, { height: newScrollLength + "px" });

      // Update ScrollTrigger
      ScrollTrigger.refresh();
    }, 150);
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (lenis) {
        lenis.destroy();
      }
    };
  }, [project, isMobileOrTablet, currentSection]);

  // Navigation function back to all projects
  const goBackToProjects = () => {
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
    return (
      <div className="mobile-single-project">
        <div className="mobile-project-content">
          {project.projectContent && project.projectContent.sections.map((section, index) => (
            <div key={index} className="mobile-project-section">
              {section.type === 'media' && (
                <img 
                  src={section.media || section.imageName} 
                  alt={section.alt || `Project section ${index + 1}`} 
                  className="mobile-project-image"
                />
              )}
              {section.type === 'text' && (
                <div className="mobile-project-text" style={{ 
                  backgroundColor: section.backgroundColor || 'rgba(30, 30, 30, 0.8)',
                  color: section.textColor || '#FFFFFF'
                }}>
                  {section.slogan && <h2 className="text-slogan">{section.slogan}</h2>}
                  <div className="text-content-wrapper">
                    <div className="text-left-column">
                      {section.fieldName && <div className="field-name">Field Name<br/>{section.fieldName}</div>}
                      {section.services && <div className="services">SERVICE<br/>{section.services}</div>}
                    </div>
                    {section.text && <div className="text-right-column">{section.text}</div>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main render for desktop
  return (
    <div 
      ref={wrapperRef} 
      className={`single-project-page ${isReady ? 'is-ready' : ''}`}
    >
      <div ref={containerRef} className="single-project-container">
        {project.projectContent && project.projectContent.sections.map((section, index) => (
          <div 
            key={index}
            className="panel"
            style={{ backgroundColor: section.backgroundColor || '#000' }}
          >
            {section.type === 'media' && (
              <img 
                src={section.media || section.imageName} 
                alt={section.alt || `Project section ${index + 1}`} 
                className="single-project-image"
              />
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
      
      {/* Scroll indicators */}
      <div className="scroll-indicators">
        {project.projectContent && project.projectContent.sections.map((_, index) => (
          <div 
            key={index} 
            className={`scroll-indicator ${currentSection === index ? 'active' : ''}`}
          />
        ))}
      </div>
      
      {/* Scroll instructions */}
      <div className="scroll-instructions">
        Scroll to navigate
      </div>
    </div>
  );
};

const SingleProjectPage = Transition(SingleProject);
export default SingleProjectPage;