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
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const videoRefs = useRef({});

  // Debug log to check routing
  console.log("All-Projects loaded with category:", category, "from path:", location.pathname);
  
  // Check if mobile on component mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile) {
        // Force scroll to top when component mounts on mobile
        window.scrollTo(0, 0);
        
        // Add mobile class to body
        document.body.classList.add('mobile-view-active');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('mobile-view-active');
    };
  }, []);

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
    const categoryName = category ? category.replace("-", " ") : "All";
    document.title = `${categoryName} Projects | VZBL`;
  }, [category]);

  // Load projects data whenever category or location changes
  useEffect(() => {
    // Function to get projects based on category
    const getProjectsByCategory = () => {
      if (!category) return [];
      
      // Format category name to match projectsData keys
      let formattedCategory = category.replace(/-/g, " ");
      
      console.log("Processing category:", formattedCategory, "Available categories:", Object.keys(projectsData));
      
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
        console.log("Found exact match:", formattedCategory);
        return projectsData[formattedCategory];
      }
      
      // Try uppercase version as fallback
      if (projectsData[formattedCategory.toUpperCase()]) {
        console.log("Found uppercase match:", formattedCategory.toUpperCase());
        return projectsData[formattedCategory.toUpperCase()];
      }
      
      // Try lowercase version as fallback
      if (projectsData[formattedCategory.toLowerCase()]) {
        console.log("Found lowercase match:", formattedCategory.toLowerCase());
        return projectsData[formattedCategory.toLowerCase()];
      }
      
      console.warn(`Category not found: ${formattedCategory}`, "Available categories:", Object.keys(projectsData));
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
        scale: 0.95,
        rotation: 10,
      });
  
      // Animate the video background
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          filter: "blur(150px)",
          duration: 0.5,
          ease: "power3.inOut"
        });
      }
  
      // Create entrance animation sequence
      const tl = gsap.timeline();
  
      // First clip-path animation
      tl.to(".all-projects-container", {
        clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)",
        duration: 0.2,
        ease: "power2.inOut",
      })
      // Second clip-path animation
      .to(".all-projects-container", {
        clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
        duration: 0.2,
        ease: "power2.inOut"
      })
      // Final reveal animation
      .to(".all-projects-container", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        onStart: () => {
          // Animate title characters
          gsap.to(".category-title .char", {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.02,
            delay: 0.1,
            ease: "power2.out",
          });
        },onComplete: () =>{
          gsap.to("footer", {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          })
        }
      })
      // Animate project items
      .from(".project-grid .project-item", {
        y: 30,
        opacity: 0,
        stagger: 0.04,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.4")
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
        videoElement.play().catch(err => {
          console.log("Autoplay prevented:", err);
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

  return (
    <>
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