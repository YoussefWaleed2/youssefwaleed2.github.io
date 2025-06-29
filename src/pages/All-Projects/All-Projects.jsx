import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./All-Projects.css";
import Footer from "../../components/Footer/Footer";
import Transition from "../../components/Transition/Transition";
import ReactLenis from "lenis/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { handleOverlay } from "../../utils/overlayManager";
import projectsData from "../../data/projectsData.json";

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
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const videoRefs = useRef({});

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
    
    // Different animations based on device type
    if (isMobile) {
      // No animations on mobile
      gsap.set(".all-projects-container", { opacity: 1 });
      gsap.set(".category-title .char", { opacity: 1, y: 0 });
      gsap.set("footer", { opacity: 1 });
    } else {
      // Start animations for desktop
      const customEase = CustomEase.create("custom", ".87,0,.13,1");
  
      // Set initial states
      gsap.set([".all-projects-container", "footer"], {
        opacity: 0
      });
  
      gsap.set(".all-projects-container", {
        clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        scale: 0,
        rotation: 25,
      });
  
      // Animate the video background
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          filter: "blur(150px)",
          duration: 1,
          ease: "power2.inOut"
        });
      }
  
      // Create entrance animation sequence
      const tl = gsap.timeline();
  
      // First clip-path animation
      tl.to(".all-projects-container", {
        clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)",
        duration: 0,
        ease: customEase,
      })
      // Second clip-path animation
      .to(".all-projects-container", {
        clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
        duration: 0,
        ease: customEase
      })
      // Final reveal animation
      .to(".all-projects-container", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.5,
        ease: customEase,
        onStart: () => {
          // Animate title characters
          gsap.to(".category-title .char", {
            y: 0,
            opacity: 1,
            duration: 1.8,
            stagger: 0.05,
            delay: 0.5,
            ease: customEase,
          });
        },onComplete: () =>{
          gsap.to("footer", {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
          })
        }
      })
      // Animate project items
      .from(".project-grid .project-item", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5")
    }
  }, [category, location.pathname, isMobile]);

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
    if (videoElement) {
      if (isHovering) {
        videoElement.currentTime = 0; // Reset video to beginning
        videoElement.play().catch(err => {
        });
      } else {
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

  const renderMedia = (project, index) => {
    if (project.mediaType === 'video') {
      return (
        <div className="video-container">
          {project.thumbnail && (
            <img 
              className="video-thumbnail"
              src={project.thumbnail} 
              alt={`${project.title} thumbnail`}
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
            onError={(e) => {
              console.error('Video loading error:', {
                error: e.target.error,
                src: project.media,
                networkState: e.target.networkState,
                readyState: e.target.readyState
              });
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
                  style={{
                    '--delay': `${index * 0.1}s`
                  }}
                  onClick={() => handleProjectClick(project)}
                >
                  <div 
                    className="project-video-container"
                    onMouseEnter={() => handleVideoHover(index, true)}
                    onMouseLeave={() => handleVideoHover(index, false)}
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

const AllProjectsPage = Transition(AllProjects);
export default AllProjectsPage; 