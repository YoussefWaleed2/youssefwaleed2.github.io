import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import ReactLenis from "lenis/react";
import Transition from '../../components/Transition/Transition';
import { handleOverlay } from "../../utils/overlayManager";
import projectsData from "../../data/projectsData.json";
import Footer from "../../components/Footer/Footer";
import './SingleProject.css';

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
  const pageRef = useRef(null);
  const titleRef = useRef(null);
  const imageRefs = useRef([]);
  
  // Smooth scrolling refs
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const scrollRafRef = useRef(null);
  const isScrollingRef = useRef(false);
  const lastTouchX = useRef(0);
  const touchStartX = useRef(0);
  
  // Velocity tracking for touch movement
  const velocityX = useRef(0);
  const lastTouchTime = useRef(Date.now());
  
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

  // Setup horizontal scrolling for desktop
  useEffect(() => {
    if (isMobileOrTablet || !project || !project.projectContent || !containerRef.current || !pageRef.current) return;
    
    // Register GSAP plugins
    gsap.registerPlugin(CustomEase);
    
    // Calculate total width precisely
    const sectionWidth = window.innerWidth;
    const sections = project.projectContent.sections || [];
    // Make sure we can see all sections by using a slightly larger width
    const totalWidth = sectionWidth * sections.length;
    
    // Set container width
    containerRef.current.style.width = `${totalWidth}px`;
    
    // Set page element styles
    pageRef.current.style.overflowX = 'auto';  // Changed from 'scroll' to 'auto' for smoother scrolling
    pageRef.current.style.overflowY = 'hidden';
    pageRef.current.style.width = '100vw';
    pageRef.current.style.height = '100vh';
    pageRef.current.style.scrollBehavior = 'auto';
    
    // Setup project sections
    const projectSections = document.querySelectorAll('.single-project-section');
    if (projectSections && projectSections.length > 0) {
      projectSections.forEach((section, index) => {
        if (section) {
          section.style.width = `${sectionWidth}px`;
          section.style.margin = '0';
          section.style.display = 'block';
          section.style.position = 'absolute';
          section.style.left = `${index * sectionWidth}px`;
          section.style.top = '0';
          section.style.zIndex = index + 10;
        }
      });
    }
    
    // Calculate maximum scroll position - add extra padding to ensure last images are reachable
    const maxScrollPosition = totalWidth;
    
    // Smoother wheel scrolling using GSAP
    const handleWheel = (e) => {
      if (!pageRef.current) return;
      
      e.preventDefault();
      
      // Get the delta and determine scroll amount
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      
      // Simple scroll amount calculation with gentle multiplier
      let scrollAmount = delta * 5.5;
      
      // Apply smooth scrolling with GSAP
      gsap.to(pageRef.current, {
        scrollLeft: pageRef.current.scrollLeft + scrollAmount,
        duration: 0.5,
        ease: "power1.out",
        overwrite: true
      });
      
      // Update current section based on scroll position
      const newSection = Math.floor(pageRef.current.scrollLeft / sectionWidth);
      if (newSection !== currentSection) {
        setCurrentSection(newSection);
      }
    };
    
    // Smoother touch handling
    const handleTouchStart = (e) => {
      if (!pageRef.current) return;
      touchStartX.current = e.touches[0].clientX;
      lastTouchX.current = touchStartX.current;
    };
    
    const handleTouchMove = (e) => {
      if (!pageRef.current) return;
      
      const touchX = e.touches[0].clientX;
      const deltaX = lastTouchX.current - touchX;
      
      // Use GSAP for smoother touch scrolling
      gsap.to(pageRef.current, {
        scrollLeft: pageRef.current.scrollLeft + deltaX * 1.2,
        duration: 0.2,
        ease: "power1.out",
        overwrite: true
      });
      
      e.preventDefault();
      lastTouchX.current = touchX;
      
      // Update current section based on scroll position
      const newSection = Math.floor(pageRef.current.scrollLeft / sectionWidth);
      if (newSection !== currentSection) {
        setCurrentSection(newSection);
      }
    };
    
    // Smoother keyboard navigation
    const handleKeyDown = (e) => {
      if (!pageRef.current) return;
      
      let scrollAmount = 0;
      
      // Handle arrow keys with smooth scrolling
      if (e.key === 'ArrowRight') {
        scrollAmount = 250;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        scrollAmount = -250;
        e.preventDefault();
      } else if (e.key === 'End') {
        // Navigate to last section
        scrollAmount = pageRef.current.scrollWidth - pageRef.current.scrollLeft;
        e.preventDefault();
      } else if (e.key === 'Home') {
        // Navigate to first section
        scrollAmount = -pageRef.current.scrollLeft;
        e.preventDefault();
      } else if (e.key === 'PageDown') {
        scrollAmount = window.innerWidth * 0.8;
        e.preventDefault();
      } else if (e.key === 'PageUp') {
        scrollAmount = -window.innerWidth * 0.8;
        e.preventDefault();
      }
      
      if (scrollAmount !== 0) {
        // Apply smooth scrolling with GSAP
        gsap.to(pageRef.current, {
          scrollLeft: pageRef.current.scrollLeft + scrollAmount,
          duration: 0.5,
          ease: "power1.out",
          overwrite: true
        });
      }
    };
    
    // Simple scroll handler without snapping
    const handleScroll = () => {
      if (!pageRef.current) return;
      
      // Calculate current section based on scroll position
      const newSection = Math.floor(pageRef.current.scrollLeft / sectionWidth);
      if (newSection !== currentSection) {
        setCurrentSection(newSection);
      }
    };
    
    // Add event listeners
    pageRef.current.addEventListener('wheel', handleWheel, { passive: false });
    pageRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
    pageRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    pageRef.current.addEventListener('keydown', handleKeyDown);
    pageRef.current.addEventListener('scroll', handleScroll, { passive: true });
    
    // Handle resize
    const handleResize = debounce(() => {
      const newWidth = window.innerWidth;
      
      // If transitioning to mobile, reload
      if (newWidth <= 1024) {
        window.location.reload();
        return;
      }
      
      // Recalculate dimensions
      if (!containerRef.current) return;
      
      const newSectionWidth = newWidth;
      const newTotalWidth = newSectionWidth * sections.length;
      
      // Update container width
      containerRef.current.style.width = `${newTotalWidth}px`;
      
      // Update all section widths and positions
      if (projectSections && projectSections.length > 0) {
        projectSections.forEach((section, idx) => {
          if (section) {
            section.style.width = `${newSectionWidth}px`;
            section.style.left = `${idx * newSectionWidth}px`;
            section.style.zIndex = idx + 10;
          }
        });
      }
    }, 150);
    
    window.addEventListener('resize', handleResize);
    
    // Initial animations
    const customEase = CustomEase.create("custom", ".87,0,.13,1");
    
    // Set initial state for sections
    gsap.set(".single-project-section", {
      opacity: 0
    });
    
    // Animate sections
    gsap.to(".single-project-section", {
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      delay: 0.5
    });
    
    // Cleanup
    return () => {
      if (pageRef.current) {
        pageRef.current.removeEventListener('wheel', handleWheel);
        pageRef.current.removeEventListener('touchstart', handleTouchStart);
        pageRef.current.removeEventListener('touchmove', handleTouchMove);
        pageRef.current.removeEventListener('keydown', handleKeyDown);
        pageRef.current.removeEventListener('scroll', handleScroll);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [project, isMobileOrTablet, currentSection]);

  // Navigation function back to all projects
  const goBackToProjects = () => {
    navigate(`/all-projects/${category}`);
  };

  // Set ready state
  useEffect(() => {
    setIsReady(true);
  }, []);

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
                <div className="mobile-project-text" style={{ backgroundColor: section.backgroundColor || 'rgba(30, 30, 30, 0.8)' }}>
                  {section.slogan && <h2 className="text-slogan">{section.slogan}</h2>}
                  <div className="text-content-wrapper">
                    <div className="text-left-column">
                      {section.fieldName && <div className="field-name">{section.fieldName}</div>}
                      {section.services && <div className="services">{section.services}</div>}
                    </div>
                    {section.text && <div className="text-right-column">{section.text}</div>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Footer />
      </div>
    );
  }

  // Main render for desktop
  return (
    <div 
      ref={pageRef} 
      className={`single-project-page ${isReady ? 'is-ready' : ''}`}
      tabIndex="0"
    >
      <div ref={containerRef} className="single-project-container">
        {project.projectContent && project.projectContent.sections.map((section, index) => (
          <div 
            key={index} 
            ref={el => imageRefs.current[index] = el} 
            className="single-project-section"
            style={{ backgroundColor: section.backgroundColor || '#000' }}
          >
            {section.type === 'media' && (
              <div className="single-project-image-container">
                <img 
                  src={section.media || section.imageName} 
                  alt={section.alt || `Project section ${index + 1}`} 
                  className="single-project-image"
                />
              </div>
            )}
            {section.type === 'text' && (
              <div className="single-project-text-section" style={{ backgroundColor: section.backgroundColor || '#000' }}>
                {section.slogan && <div className="text-slogan">{section.slogan}</div>}
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
};

const SingleProjectPage = Transition(SingleProject);
export default SingleProjectPage; 