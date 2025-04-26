import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./All-Projects.css";
import Footer from "../../components/Footer/Footer";
import Transition from "../../components/Transition/Transition";
import ReactLenis from "lenis/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { handleOverlay } from "../../utils/overlayManager";
import projectsData from "../../data/projectsData.json";

const AllProjects = () => {
  const { category } = useParams();
  const [projects, setProjects] = useState([]);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const videoRefs = useRef({});

  // Handle overlay on mount and unmount
  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  // Set page title
  useEffect(() => {
    const categoryName = category ? category.replace("-", " ") : "All";
    document.title = `${categoryName} Projects | VZBL`;
  }, [category]);

  useEffect(() => {
    // Function to get projects based on category
    const getProjectsByCategory = () => {
      if (!category) return [];
      
      // Format category name to match projectsData keys
      let formattedCategory = category.replace(/-/g, " ");
      
      // First letter uppercase for keys like "Branding", "Marketing"
      // Special case for "Marketing" and "Advertising" to match projectsData keys
      if (formattedCategory.toLowerCase() === "marketing") {
        formattedCategory = "Marketing";
      } else if (formattedCategory.toLowerCase() === "advertising") {
        formattedCategory = "Advertising";
      } else if (formattedCategory.toLowerCase() === "branding") {
        formattedCategory = "BRANDING";
      }
      
      // Check if category exists in projectsData
      if (projectsData[formattedCategory]) {
        return projectsData[formattedCategory];
      }
      
      // Try uppercase version as fallback
      if (projectsData[formattedCategory.toUpperCase()]) {
        return projectsData[formattedCategory.toUpperCase()];
      }
      
      console.warn(`Category not found: ${formattedCategory}`);
      return [];
    };

    // First try to get projects from sessionStorage if available
    const storedProjects = sessionStorage.getItem('currentProjects');
    
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      // Otherwise load directly from projectsData based on URL category
      const projectsByCategory = getProjectsByCategory();
      setProjects(projectsByCategory);
    }

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

  }, [category]);

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
    </>
  );
};

export default Transition(AllProjects); 