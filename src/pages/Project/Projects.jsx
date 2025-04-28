import React, { useEffect, useRef, useState } from "react";
import "./Projects.css";
import Transition from "../../components/Transition/Transition";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import projectsData from "../../data/projectsData.json";
import { handleOverlay } from "./../../utils/overlayManager";
import ReactLenis from "lenis/react";
import ImageSlider from "../../components/Carousel/ImageSlider";

// Debug log to check if this file is being loaded correctly
console.log("Projects.jsx loaded, projectsData:", Object.keys(projectsData));

const Projects = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringEye, setIsHoveringEye] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const seeMoreRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const textRefs = useRef([useRef(null), useRef(null), useRef(null)]);
  const counterRef = useRef(null);
  const previewRef = useRef(null);
  const videoRef = useRef(null);

  // Define categories with capitalization as requested
  const categories = ["BRANDING", "MARKETING", "ADVERTISING"];
  
  // Client images for the slider
  const clientImages = [
    "/project/Asset 1.webp",
    "/project/Asset 3.webp",
    "/project/Asset 4.webp",
    "/project/Asset 5.webp",
    "/project/Asset 6.webp",
    "/project/Asset 7.webp",
    "/project/Asset 8.webp",
    "/project/Asset 9.webp",
    "/project/Asset 10.webp",
    "/project/Asset 11.webp",
    "/project/Asset 12.webp",
    "/project/Asset 13.webp"
  ];
  
  useEffect(() => {
    document.title = "Projects | VZBL";
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  const handleNext = () => {
    if (currentIndex < categories.length - 1 && !isAnimating) {
      setIsAnimating(true);
      animateTextTransition(currentIndex, currentIndex + 1, 'next');
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      animateTextTransition(currentIndex, currentIndex - 1, 'prev');
      setCurrentIndex(prev => prev - 1);
    }
  };

  const animateTextTransition = (fromIndex, toIndex, direction) => {    
    // Get all text elements
    const fromText = textRefs.current[fromIndex].current;
    const toText = textRefs.current[toIndex].current;
    const thirdIndex = 3 - fromIndex - toIndex; // Get the index of the third text element
    const thirdText = textRefs.current[thirdIndex]?.current;
    
    if (direction === 'next') {
      // Current text exits to top
      gsap.to(fromText, {
        y: -100,
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power3.out"
      });
      
      // Next text comes to center
      gsap.to(toText, { 
        y: 0, 
        opacity: 1,
        scale: 1, 
        duration: 0.5,
        ease: "power3.out",
        visibility: 'visible'
      });
      
      // Third text moves below
      if (thirdText) {
        gsap.to(thirdText, {
          y: 100,
          opacity: 0.3,
          scale: 0.9,
          duration: 0.5,
          ease: "power3.out",
          visibility: 'visible'
        });
      }
    } else {
      // Current text exits to bottom
      gsap.to(fromText, {
        y: 100,
        opacity: 0.3,
        scale: 0.9,
        duration: 0.5,
        ease: "power3.out"
      });
      
      // Previous text comes to center
      gsap.to(toText, { 
        y: 0, 
        opacity: 1,
        scale: 1, 
        duration: 0.5,
        ease: "power3.out",
        visibility: 'visible'
      });
      
      // Third text moves
      if (thirdText) {
        gsap.to(thirdText, {
          y: -100,
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "power3.out",
          visibility: 'visible'
        });
      }
    }
    
    // Update counter
    gsap.to(counterRef.current.querySelector("span:first-child"), {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        counterRef.current.querySelector("span:first-child").textContent = (toIndex + 1);
        gsap.to(counterRef.current.querySelector("span:first-child"), {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    
    // End animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleCategoryClick = (category) => {
    if (!isAnimating) {
      // Format the category for the URL
      let urlCategory = category.toLowerCase().replace(" ", "-");
      
      // Navigate to all-projects with current category
      navigate(`/all-projects/${urlCategory}`);
    }
  };

  const handlePreviewClick = () => {
    const currentCategory = categories[currentIndex];
    console.log("handlePreviewClick - currentCategory:", currentCategory);
    
    if (currentCategory) {
      // Format the category for the URL
      let urlCategory = currentCategory.toLowerCase().replace(" ", "-");
      
      // Navigate to all-projects with current category
      navigate(`/all-projects/${urlCategory}`);
    } else {
      console.error("Cannot navigate - missing category:", { currentCategory });
    }
  };

  const handleEyeMouseEnter = () => {
    // Make sure element is visible before animation starts
    if (seeMoreRef.current) {
      seeMoreRef.current.style.display = 'block';
    }
    
    setIsHoveringEye(true);
    gsap.fromTo(seeMoreRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
  };

  const handleEyeMouseLeave = () => {
    setIsHoveringEye(false);
    gsap.to(seeMoreRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "back.in(1.7)",
      onComplete: () => {
        if (!isHoveringEye) {
          seeMoreRef.current.style.display = 'none';
        }
      }
    });
  };

  useEffect(() => {
    // Set initial states for UI elements
    gsap.set([counterRef.current], {
      opacity: 0
    });

    // Wait a short delay to ensure transition has completed
    setTimeout(() => {
      // Animate the video background
      gsap.to(videoRef.current, {
        filter: "blur(100px)",
        duration: 1,
        ease: "power2.inOut"
      });
      
      gsap.set(prevBtnRef.current, { 
        y: -50, 
        visibility: "visible",
        opacity: 0
      });
      
      gsap.set(nextBtnRef.current, { 
        y: 50, 
        visibility: "visible",
        opacity: 0
      });
      
      gsap.set(counterRef.current, { 
        y: 30, 
        visibility: "visible" 
      });
      
      gsap.set(previewRef.current, { 
        scale: 0, 
        visibility: "visible" 
      });

      // Initialize text elements - same for mobile and desktop
      textRefs.current.forEach((ref, index) => {
        if (index === 0) {
          // Current category (centered)
          gsap.set(ref.current, { 
            y: 0, 
            opacity: 1,
            scale: 1,
            visibility: "visible"
          });
        } else if (index === 1) {
          // Next category (below)
          gsap.set(ref.current, { 
            y: 100,
            opacity: 0.3,
            scale: 0.9,
            visibility: "visible"
          });
        } else {
          // Previous category (above)
          gsap.set(ref.current, { 
            y: -100,
            opacity: 0,
            scale: 0.8,
            visibility: "visible"
          });
        }
      });

      // Animate elements in
      const tl = gsap.timeline();
      
      tl.to(prevBtnRef.current, {
        y: 0,
        opacity: 0.7,
        duration: 0.5,
        ease: "power2.out"
      }, "+=0.2")
      .to(nextBtnRef.current, {
        y: 0,
        opacity: 0.7,
        duration: 0.5, 
        ease: "power2.out"
      }, "-=0.3")
      .to(previewRef.current, {
        scale: 1,
        opacity: 0.7,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, "-=0.3")
      .to(counterRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3");
    }, 200);
    
    // Clean up animations on unmount
    return () => {
      gsap.killTweensOf([
        prevBtnRef.current,
        nextBtnRef.current,
        counterRef.current,
        previewRef.current,
        videoRef.current,
        ...textRefs.current.map(ref => ref.current)
      ]);
    };
  }, []);

  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  return (
    <ReactLenis root>
      <div className="project-container">
        <div className="video-background">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="home/vid.webm" type="video/webm" />
          </video>
        </div>
        
        <div className="project-content">
          <div className="project-navigation left-nav">
            <button
              ref={prevBtnRef}
              className="nav-button prev"
              onClick={handlePrev}
              style={{ opacity: currentIndex === 0 ? 0.3 : 0.7 }}
              disabled={currentIndex === 0}
            >
              <svg width="28" height="16" viewBox="0 0 28 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 14L14 2L26 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              ref={nextBtnRef}
              className="nav-button next"
              onClick={handleNext}
              style={{ opacity: currentIndex === categories.length - 1 ? 0.3 : 0.7 }}
              disabled={currentIndex === categories.length - 1}
            >
              <svg width="28" height="16" viewBox="0 0 28 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L14 14L26 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="text-container">
            {categories.map((category, index) => (
              <div 
                key={index}
                ref={textRefs.current[index]} 
                className={`category-text ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
                style={{ 
                  cursor: 'pointer',
                  visibility: isMobile && index !== currentIndex && index !== (currentIndex + 1) % categories.length ? 'hidden' : 'visible' 
                }}
              >
                {category}
              </div>
            ))}
          </div>

          <div className="project-navigation right-nav">
            <button
              ref={previewRef}
              className="nav-button eye-button"
              onClick={handlePreviewClick}
              onMouseEnter={handleEyeMouseEnter}
              onMouseLeave={handleEyeMouseLeave}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5.25C4.5 5.25 1.5 12 1.5 12C1.5 12 4.5 18.75 12 18.75C19.5 18.75 22.5 12 22.5 12C22.5 12 19.5 5.25 12 5.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div ref={counterRef} className="project-counter">
              <span>1</span>
              <span>/</span>
              <span>3</span>
            </div>
          </div>
        </div>
        
        <ImageSlider assets={clientImages} />

        <div ref={seeMoreRef} className="see-more-text">SEE ALL</div>
      </div>
    </ReactLenis>
  );
};

export default Transition(Projects);
