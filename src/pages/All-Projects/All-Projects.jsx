import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./All-Projects.css";
import Footer from "../../components/Footer/Footer";
import ReactLenis from "lenis/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { handleOverlay } from "../../utils/overlayManager";
import projectsData from "../../data/projectsData.json";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Force mobile scrolling to work
if (typeof window !== 'undefined') {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  if (isMobile) {
    // Apply these styles immediately
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.overflowY = 'auto';
    document.body.style.height = 'auto';
    document.body.style.touchAction = 'auto';
    
    // Remove any scroll blockers
    const existingStyle = document.getElementById('scroll-fix');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'scroll-fix';
      style.innerHTML = `
        html, body { 
          overflow-y: auto !important; 
          height: auto !important;
          position: static !important;
          touch-action: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }
        .ReactLenis { overflow: visible !important; }
        .mobile-projects-view {
          min-height: 100vh;
          height: auto !important;
          position: relative !important;
          overflow-y: auto !important;
        }
        .mobile-projects-grid {
          height: auto !important;
          padding-bottom: 100px !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

const AllProjects = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedMediaCount, setLoadedMediaCount] = useState(0);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const videoRefs = useRef({});
  const projectRefs = useRef([]);

  // Debug log to check routing
  
  // Check if mobile on component mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile) {
        // Force scroll to top when component mounts on mobile, but only once
        if (!sessionStorage.getItem('hasScrolledToTop')) {
          window.scrollTo(0, 0);
          sessionStorage.setItem('hasScrolledToTop', 'true');
        }
        
        // Add mobile class to body
        document.body.classList.add('mobile-view-active');
        
        // Set overflow on body for mobile
        document.body.style.overflowY = 'auto';
        document.body.style.height = 'auto';
        document.documentElement.style.overflowY = 'auto';
        document.documentElement.style.height = 'auto';
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Add scroll prevention
    const handleScroll = () => {
      if (isScrolling) return;
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('mobile-view-active');
    };
  }, [isScrolling]);

  // Handle overlay on mount and unmount
  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  // Clear session storage when component unmounts
  useEffect(() => {
    return () => {
      // Clear session storage when navigating away from AllProjects
      sessionStorage.removeItem('currentProjects');
      sessionStorage.removeItem('currentProjectCategory');
    };
  }, []);

  // Set page title
  useEffect(() => {
    let pageTitle;
    switch (category?.toLowerCase()) {
      case 'branding':
        pageTitle = 'Branding';
        break;
      case 'marketing':
        pageTitle = 'Marketing';
        break;
      case 'advertising':
      case 'advertisement':
        pageTitle = 'Advertisement';
        break;
      default:
        pageTitle = category ? category.replace("-", " ") : "All";
    }
    document.title = `${pageTitle} | VZBL`;
  }, [category]);

  // Track media loading progress
  const handleMediaLoad = () => {
    setLoadedMediaCount(prev => {
      const newCount = prev + 1;
      // Check if all media is loaded
      if (newCount >= projects.length) {
        setImagesLoaded(true);
      }
      return newCount;
    });
  };

  // Reset loading state when projects change
  useEffect(() => {
    setImagesLoaded(false);
    setLoadedMediaCount(0);
  }, [projects]);

  // Animation function for project rows
  const animateProjectRows = () => {
    if (isMobile) return;

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Get columns per row based on screen size
    const getColumnsPerRow = () => {
      const width = window.innerWidth;
      if (width <= 768) return 2;
      if (width <= 1024) return 2;
      if (width <= 1439) return 3;
      return 3;
    };

    const columnsPerRow = getColumnsPerRow();
    const rows = [];
    
    // Group projects into rows
    for (let i = 0; i < projects.length; i += columnsPerRow) {
      rows.push(projects.slice(i, i + columnsPerRow));
    }

    // Projects are already hidden from the main useEffect - no need to set again

    // Animate each row with ScrollTrigger
    rows.forEach((row, rowIndex) => {
      const rowStart = rowIndex * columnsPerRow;
      const rowItems = [];
      
      for (let j = 0; j < row.length; j++) {
        const item = document.querySelector(`.project-item[data-index="${rowStart + j}"]`);
        if (item) rowItems.push(item);
      }

      if (rowItems.length > 0) {
        // Create timeline for this row
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rowItems[0],
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            fastScrollEnd: true,
            preventOverlaps: true,
          }
        });

        // Animate the row items with stagger - bottom to top reveal
        tl.to(rowItems, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        });
      }
    });

    // Initial row animation (first visible rows) - bottom to top
    setTimeout(() => {
      const firstRowItems = [];
      for (let i = 0; i < Math.min(columnsPerRow, projects.length); i++) {
        const item = document.querySelector(`.project-item[data-index="${i}"]`);
        if (item) firstRowItems.push(item);
      }
      
      if (firstRowItems.length > 0) {
        gsap.to(firstRowItems, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.6, // After container animation
          ease: "power2.out",
        });
      }
    }, 100);
  };

  // Load projects data whenever category or location changes
  useEffect(() => {
    // Function to get projects based on category
    const getProjectsByCategory = () => {
      if (!category) return [];
      
      // Format category name to match projectsData keys
      let formattedCategory = category.replace(/-/g, " ");
      
      
      // Map URL categories to data keys exactly as in Projects.jsx
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
      
      // Check if category exists in projectsData
      if (projectsData[formattedCategory]) {
        return projectsData[formattedCategory];
      }
      
      // Try uppercase version as fallback
      if (projectsData[formattedCategory.toUpperCase()]) {
        return projectsData[formattedCategory.toUpperCase()];
      }
      
      // Try lowercase version as fallback
      if (projectsData[formattedCategory.toLowerCase()]) {
        return projectsData[formattedCategory.toLowerCase()];
      }
      
      return [];
    };

    // Always fetch fresh data for the current category
    const projectsByCategory = getProjectsByCategory();
    setProjects(projectsByCategory);
  }, [category, location.pathname]);

  // Separate effect for animations that waits for images to load
  useEffect(() => {
    if (!projects.length) return;

    // Different animations based on device type
    if (isMobile) {
      // No animations on mobile, just show content
      gsap.set(".all-projects-container", { opacity: 1 });
      gsap.set(".category-title .char", { opacity: 1, y: 0 });
      gsap.set("footer", { opacity: 1 });
      setImagesLoaded(true); // Mobile doesn't need to wait
    } else {
      // For desktop, wait for images to load before starting animations
      if (imagesLoaded) {
        // Start animations for desktop after images are loaded
        const customEase = CustomEase.create("custom", ".87,0,.13,1");
    
        // Set initial states - IMMEDIATELY hide projects
        gsap.set([".all-projects-container", "footer"], {
          opacity: 0
        });
        
        // Hide all projects immediately
        gsap.set(".project-item", {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          opacity: 0,
          y: 20,
        });
        
        // Set initial styles for project info to enhance hover effects
        gsap.set(".project-info", {
          opacity: 0.8,
          y: 0
        });
    
        // Animate the video background
        if (videoRef.current) {
          gsap.to(videoRef.current, {
            filter: "blur(150px)",
            duration: 1,
            ease: "power2.inOut"
          });
        }
    
        // Simple fade in animation - no more flip effects
        const tl = gsap.timeline();
    
        // Simple container reveal
        tl.to(".all-projects-container", {
          opacity: 1,
          duration: 0.5,
          ease: customEase,
          onStart: () => {
            // Animate title characters
            gsap.to(".category-title .char", {
              y: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.03,
              delay: 0.2,
              ease: customEase,
            });
          },
          onComplete: () => {
            gsap.to("footer", {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out"
            });
            // Initialize project animations after container is ready
            setTimeout(animateProjectRows, 100);
          }
        });
      } else {
        // Images not loaded yet, set initial hidden state
        gsap.set([".all-projects-container", "footer"], {
          opacity: 0
        });
        
        gsap.set(".project-item", {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          opacity: 0,
          y: 20,
        });
      }
    }
  }, [projects, isMobile, imagesLoaded]);

  // Update project animations when window resizes
  useEffect(() => {
    if (!isMobile && projects.length > 0) {
      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobile, projects]);

  // Cleanup ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Split title into characters for animation
  const renderTitle = (title) => {
    return title.split("").map((char, index) => (
      <span key={index} className="char" style={{ opacity: 0, transform: "translateY(100%)" }}>
        {char}
      </span>
    ));
  };

  const handleVideoHover = (index, isHovering) => {
    const videoElement = videoRefs.current[index];
    const projectItem = document.querySelector(`.project-item[data-index="${index}"]`);
    const videoContainer = projectItem?.querySelector('.project-video-container');
    const projectInfo = projectItem?.querySelector('.project-info');
    const videoThumbnail = projectItem?.querySelector('.video-thumbnail');
    
    if (videoElement) {
      if (isHovering) {
        videoElement.currentTime = 0; // Reset video to beginning
        videoElement.play().catch(err => {
        });
        
        // Add hover animations
        if (videoContainer) {
          gsap.to(videoContainer, {
            scale: 1.02,
            duration: 0.6,
            ease: "power2.out"
          });
          
          // Add subtle glow effect
          gsap.to(videoContainer, {
            boxShadow: "0 0 30px rgba(255, 255, 255, 0.1)",
            duration: 0.6,
            ease: "power2.out"
          });
        }
        
        // Animate project info
        if (projectInfo) {
          gsap.to(projectInfo, {
            y: -5,
            duration: 0.6,
            ease: "power2.out"
          });
          
          // Brighten the text
          gsap.to(projectInfo, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
        // Fade out thumbnail when video plays
        if (videoThumbnail) {
          gsap.to(videoThumbnail, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
      } else {
        // Reset animations on mouse leave
        if (videoContainer) {
          gsap.to(videoContainer, {
            scale: 1,
            boxShadow: "0 0 0px rgba(255, 255, 255, 0)",
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
        if (projectInfo) {
          gsap.to(projectInfo, {
            y: 0,
            opacity: 0.9,
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
        // Show thumbnail again
        if (videoThumbnail) {
          gsap.to(videoThumbnail, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
        // Optional: pause when not hovering
        // videoElement.pause();
      }
    }
  };

  // Handle click on a project to navigate to its detail page
  const handleProjectClick = (project) => {
    const projectName = project.title.toLowerCase().replace(/ /g, '-');
    const categoryPath = category || 'all';
    
    // Navigate to the Single Project page
    navigate(`/all-projects/${categoryPath}/${projectName}`);
  };

  // Handle hover for image projects (non-video)
  const handleImageHover = (index, isHovering) => {
    const projectItem = document.querySelector(`.project-item[data-index="${index}"]`);
    const imageContainer = projectItem?.querySelector('.project-video-container');
    const projectInfo = projectItem?.querySelector('.project-info');
    const projectImage = projectItem?.querySelector('img.project-media'); // Only target img elements, not video elements
    
    // Make sure we only target image projects by checking if there's no video element
    const hasVideo = projectItem?.querySelector('video');
    if (hasVideo) return; // Exit early if this is actually a video project
    
    if (isHovering) {
      // Add hover animations for image projects only
      if (imageContainer) {
        gsap.to(imageContainer, {
          scale: 1.02,
          duration: 0.5,
          ease: "power2.out"
        });
        
        // Add subtle shadow
        gsap.to(imageContainer, {
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          duration: 0.5,
          ease: "power2.out"
        });
      }
      
      // Animate project info
      if (projectInfo) {
        gsap.to(projectInfo, {
          y: -3,
          duration: 0.5,
          ease: "power2.out"
        });
        
        gsap.to(projectInfo, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
      
      // Add slight brightness to image only
      if (projectImage && projectImage.tagName === 'IMG') {
        gsap.to(projectImage, {
          filter: "brightness(1.1)",
          duration: 0.5,
          ease: "power2.out"
        });
      }
      
    } else {
      // Reset animations on mouse leave
      if (imageContainer) {
        gsap.to(imageContainer, {
          scale: 1,
          boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
          duration: 0.4,
          ease: "power2.out"
        });
      }
      
      if (projectInfo) {
        gsap.to(projectInfo, {
          y: 0,
          opacity: 0.9,
          duration: 0.4,
          ease: "power2.out"
        });
      }
      
      if (projectImage && projectImage.tagName === 'IMG') {
        gsap.to(projectImage, {
          filter: "brightness(1)",
          duration: 0.4,
          ease: "power2.out"
        });
      }
    }
  };

  const renderMedia = (project, index) => {
    if (project.mediaType === 'video') {
      return (
        <div className="video-container">
          {project.thumbnail && (
            <img 
              className="video-thumbnail"
              src={project.thumbnail} 
              alt={`${project.title} thumbnail`}
              onLoad={handleMediaLoad}
              onError={handleMediaLoad}
            />
          )}
          <video
            className="project-media"
            ref={el => videoRefs.current[index] = el}
            muted
            loop
            playsInline
            preload="metadata"
            poster={project.thumbnail}
            onLoadedData={handleMediaLoad}
            onError={(e) => {
              console.error('Video loading error:', {
                error: e.target.error,
                src: project.media,
                networkState: e.target.networkState,
                readyState: e.target.readyState
              });
              handleMediaLoad();
            }}
          >
            <source src={project.media} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    return (
      <img 
        className="project-media"
        src={project.media} 
        alt={project.title}
        onLoad={handleMediaLoad}
        onError={handleMediaLoad}
      />
    );
  };

  // Handle back to Projects page navigation
  const handleBackToProjectsMain = () => {
    // Check if we came from services page by looking at browser history
    if (window.history.length > 1) {
      // Check if the document referrer contains 'services' or if we have a state indicating services
      const referrer = document.referrer;
      const fromServices = referrer.includes('/services') || location.state?.from === '/services';
      
      if (fromServices) {
        // Navigate back to services page
        navigate('/services');
        return;
      }
    }
    
    // Default: Navigate to main Projects page
    navigate('/projects');
  };

  return (
    <>
      {/* Back to Projects button - always visible */}
      <button 
        className="back-to-projects-main-btn" 
        onClick={handleBackToProjectsMain}
        aria-label="Back to main projects"
      >
        <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 1L1 10L10 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 10H29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {isMobile ? (
        <div className="mobile-projects-view">
          <div className="mobile-projects-content">
            <h1 className="mobile-category-title">
              {category ? category.replace("-", " ").toUpperCase() : "ALL PROJECTS"}
            </h1>
            
            <div className="mobile-projects-grid">
              {projects.map((project, index) => (
                <div 
                  key={index}
                  className="mobile-project-item"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="mobile-media-container">
                    {project.mediaType === 'video' ? (
                      <img src={project.thumbnail} alt={project.title} />
                    ) : (
                      <img src={project.media} alt={project.title} />
                    )}
                  </div>
                  <div className="mobile-project-info">
                    <div className="mobile-project-number">{(index + 1).toString().padStart(2, '0')}.</div>
                    <h3>{project.title.toUpperCase()}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <ReactLenis root>
          <div className="all-projects-container" ref={containerRef}>
            <h1 className="category-title" ref={titleRef}>
              {renderTitle(category ? category.replace("-", " ").toUpperCase() : "ALL")}
            </h1>
            <div className="project-grid">
              {projects.map((project, index) => (
                <div 
                  className="project-item"
                  key={index}
                  data-index={index}
                  ref={el => projectRefs.current[index] = el}
                  onClick={() => handleProjectClick(project)}
                >
                  <div 
                    className="project-video-container"
                    onMouseEnter={() => project.mediaType === 'video' ? handleVideoHover(index, true) : handleImageHover(index, true)}
                    onMouseLeave={() => project.mediaType === 'video' ? handleVideoHover(index, false) : handleImageHover(index, false)}
                  >
                    {renderMedia(project, index)}
                  </div>
                  <div className="project-info">
                    <div className="project-number">
                      {(index + 1).toString().padStart(2, '0')}.
                    </div>
                    <h3>{project.title.toUpperCase()}</h3>
                    {project.description && <p>{project.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </ReactLenis>
      )}
    </>
  );
};

export default AllProjects;