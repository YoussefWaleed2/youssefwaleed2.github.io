import React, { useEffect, useRef, useState } from "react";
import "./Projects.css";
import Transition from "../../components/Transition/Transition";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import projectsData from "../../data/projectsData.json";
import { handleOverlay } from "./../../utils/overlayManager";
import ReactLenis from "lenis/react";

// Debug log to check if this file is being loaded correctly
console.log("Projects.jsx loaded, projectsData:", Object.keys(projectsData));

const Projects = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringEye, setIsHoveringEye] = useState(false);
  const seeMoreRef = useRef(null);
  const titleRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const imageRefs = useRef([useRef(null), useRef(0), useRef(null)]);
  const counterRef = useRef(null);
  const previewRef = useRef(null);
  const videoRef = useRef(null);

  const images = [
    "/project/Service-img-1.webp",
    "/project/Service-img-2.webp",
    "/project/Service-img-3.webp"
  ];
  useEffect(() => {
    document.title = "Projects | VZBL";
  }, []);
  const titles = ["BRANDING", "Marketing", "Advertising"];
  // Debug log to check if titles array is defined
  console.log("Titles in Projects.jsx:", titles);
  
  const handleNext = () => {
    if (currentIndex < images.length - 1 && !isAnimating) {
      setIsAnimating(true);
      animateTransition(currentIndex, currentIndex + 1, 'next');
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      animateTransition(currentIndex, currentIndex - 1, 'prev');
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Animate the title
  const animateTitle = (newTitle) => {
    const timeline = gsap.timeline();
    timeline
      .from(titleRef.current, {
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        opacity: 0,
        ease: "power3.inOut",
        onComplete: () => {
          titleRef.current.textContent = newTitle;
        }
      })
      .to(titleRef.current, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: "power3.out"
      });
  };

  const animateTransition = (fromIndex, toIndex, direction) => {
    const fromImage = imageRefs.current[fromIndex].current;
    const toImage = imageRefs.current[toIndex].current;
    
    const config = {
      rotations: [0, 5.405, -5.551],  // Different fixed rotations for each card
      yOffset: 500,             // Distance from bottom of screen
      duration: 0.6,            // Faster animation duration for next
      prevDuration: 0.3,        // Even faster duration for prev
      stackOffset: 30,          // Offset for stacked position
    };

    // Animate title with each transition
    animateTitle(titles[toIndex]);

    if (direction === 'next') {
      // Stack the current image without changing its rotation
      gsap.to(fromImage, {
        y: config.stackOffset,
        scale: 0.95,
        duration: config.duration,
        ease: "power2.inOut"
      });

      // Make next image visible before animation
      gsap.set(toImage, { 
        visibility: "visible",
        y: config.yOffset,
        rotation: config.rotations[toIndex],
        scale: 1,
        zIndex: 2
      });

      // Bring new image from bottom with rotation
      gsap.to(toImage, {
        y: 0,
        scale: 1,
        duration: config.duration,
        ease: "power3.out",
        onComplete: () => {
          setIsAnimating(false);
        }
      });
    } else {
      // Move current image to bottom
      gsap.to(fromImage, {
        y: config.yOffset,
        scale: 1,
        duration: config.prevDuration,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(fromImage, { visibility: "hidden" });
          setIsAnimating(false);
        }
      });

      // First, ensure the stacked image has the correct initial state
      gsap.set(toImage, {
        y: config.stackOffset,
        scale: 0.95,
        zIndex: 2
      });

      // Then animate only the position and scale
      gsap.to(toImage, {
        y: 0,
        scale: 1,
        duration: config.prevDuration,
        ease: "power2.inOut"
      });
    }
  };

  const handleCardMouseMove = (e, index) => {
    // Only apply effect if this is the current card
    if (index === currentIndex) {
      const card = imageRefs.current[index].current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 10; // max 10deg
      const rotateY = ((x - centerX) / centerX) * 10; // max 10deg

      gsap.to(card, {
        rotateX: -rotateX,
        rotateY: rotateY,
        scale: 1.06,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleCardMouseLeave = (index) => {
    // Only apply effect if this is the current card
    if (index === currentIndex) {
      const card = imageRefs.current[index].current;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out"
      });
    }
  };

  const handleCardMouseEnter = (e, index) => {
    // Only apply effect if this is the current card
    if (index === currentIndex) {
      const card = imageRefs.current[index].current;
      gsap.to(card, {
        scale: 1.06,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handlePreviewClick = () => {
    const currentTitle = titles[currentIndex];
    console.log("handlePreviewClick - currentTitle:", currentTitle);
    
    // Add safety checks
    if (currentTitle) {
      // Format the category for the URL
      let urlCategory = currentTitle.toLowerCase().replace(" ", "-");
      
      // Navigate to all-projects with current category
      navigate(`/all-projects/${urlCategory}`);
    } else {
      console.error("Cannot navigate - missing title:", { currentTitle });
    }
  };

  const handleEyeMouseMove = (e) => {
    // No longer need to track mouse movement
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
      ease: "back.in(1.7)", // Matching back.out but in reverse
      onComplete: () => {
        // Only hide the element after animation completes
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

      // Set initial transforms
      gsap.set(titleRef.current, { 
        y: -50, 
        visibility: "visible",
        opacity: 0
      });
      gsap.set(prevBtnRef.current, { 
        x: -50, 
        visibility: "visible",
        opacity: 0,
      });
      gsap.set(nextBtnRef.current, { 
        x: -50, 
        visibility: "visible",
        opacity: 0
      });
      gsap.set(counterRef.current, { y: 30, visibility: "visible" });
      gsap.set(previewRef.current, { scale: 0, visibility: "visible" });

      // Set initial states for all images
      imageRefs.current.forEach((ref, index) => {
        if (index === 0) {
          gsap.set(ref.current, { 
            y: 0, 
            visibility: "visible",
            zIndex: 2,
            scale: 1,
            rotation: 0,
          });
        } else {
          gsap.set(ref.current, { 
            y: 500,
            visibility: "hidden",
            zIndex: 1 - index,
            scale: 1,
            rotation: 0
          });
        }
      });

      const tl = gsap.timeline({
        defaults: { 
          ease: "power2.out",
          duration: 0.8
        }
      });

      // Initial animation
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        delay: 0.3, // Reduced from 0.8 to speed up after transition
        ease: "power3.out"
      })
      .to(prevBtnRef.current, {
        opacity: 0.3,
        x: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, "-=0.7")
      .to(nextBtnRef.current, {
        opacity: 0.7,
        x: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, "-=0.5")
      .fromTo(imageRefs.current[0].current,
        {
          y: 1000,
          scale: 1
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out"
        }, "-=0.2")
      .to(counterRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, "-=0.4")
      .to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.3");
    }, 100); // Short delay to let transition component work

  }, []);

  useEffect(() => {
    // Update button opacities based on current index
    if (currentIndex === 0) {
      gsap.to(prevBtnRef.current, {
        opacity: 0.3,
        duration: 0.4,
        delay: 1,
        ease: "power2.inOut"
      });
      gsap.to(nextBtnRef.current, {
        opacity: 0.7,
        duration: 0.4,
        delay: 1,
        ease: "power2.inOut"
      });
    } else if (currentIndex === images.length - 1) {
      gsap.to(prevBtnRef.current, {
        opacity: 0.7,
        duration: 0.1,
        ease: "power2.inOut"
      });
      gsap.to(nextBtnRef.current, {
        opacity: 0.3,
        duration: 0.1,
        ease: "power2.inOut"
      });
    } else {
      gsap.to([prevBtnRef.current, nextBtnRef.current], {
        opacity: 0.7,
        duration: 0,
        ease: "power2.inOut"
      });
    }
  }, [currentIndex, images.length]);

  // Handle overlay on mount and unmount
  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  return (
    <ReactLenis root options={{ duration: 1.2 }}>
      <div className="video-background">
        <video
          ref={videoRef}
          className="project-video"
          autoPlay
          muted
          loop
          playsInline
          src="/home/vid.webm"
        />
      </div>
      <div className="project-container">
        <h1 className="project-title" ref={titleRef}>{titles[currentIndex]}</h1>
        
        <div className="project-content">
          <div className="project-navigation">
            <button 
              className="nav-button prev" 
              ref={prevBtnRef} 
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
                <path d="M36.9998 67.8337C54.0286 67.8337 67.8332 54.0291 67.8332 37.0003C67.8332 19.9715 54.0286 6.16699 36.9998 6.16699C19.9711 6.16699 6.1665 19.9715 6.1665 37.0003C6.1665 54.0291 19.9711 67.8337 36.9998 67.8337Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M26.1157 33.1152L36.9999 43.9686L47.8841 33.1152" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="nav-button next" 
              ref={nextBtnRef} 
              onClick={handleNext}
              disabled={currentIndex === images.length - 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
                <path d="M36.9998 67.8337C54.0286 67.8337 67.8332 54.0291 67.8332 37.0003C67.8332 19.9715 54.0286 6.16699 36.9998 6.16699C19.9711 6.16699 6.1665 19.9715 6.1665 37.0003C6.1665 54.0291 19.9711 67.8337 36.9998 67.8337Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M26.1157 33.1152L36.9999 43.9686L47.8841 33.1152" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="project-image">
            {images.map((image, index) => (
              <div
                key={index}
                ref={imageRefs.current[index]}
                className="image-wrapper"
                onMouseMove={e => handleCardMouseMove(e, index)}
                onMouseLeave={() => handleCardMouseLeave(index)}
                onMouseEnter={e => handleCardMouseEnter(e, index)}
                onClick={handlePreviewClick}
                style={{ cursor: 'pointer' }}
              >
                <img src={image} alt={`Project ${index + 1}`} />
              </div>
            ))}
          </div>
          
          <div className="project-counter" ref={counterRef}>
            <span>{currentIndex + 1}</span>
            <span>/</span>
            <span>{images.length}</span>
            <div className="project-preview" ref={previewRef}>
              <button 
                className="nav-button preview-button"
                onClick={handlePreviewClick}
                onMouseMove={handleEyeMouseMove}
                onMouseEnter={handleEyeMouseEnter}
                onMouseLeave={handleEyeMouseLeave}
              >
                <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36.9998 67.8337C54.0286 67.8337 67.8332 54.0291 67.8332 37.0003C67.8332 19.9715 54.0286 6.16699 36.9998 6.16699C19.9711 6.16699 6.1665 19.9715 6.1665 37.0003C6.1665 54.0291 19.9711 67.8337 36.9998 67.8337Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M37 47.27C40.53 47.27 43.82 45.19 46.11 41.59C47.01 40.18 47.01 37.81 46.11 36.4C43.82 32.8 40.53 30.72 37 30.72C33.47 30.72 30.18 32.8 27.89 36.4C26.99 37.81 26.99 40.18 27.89 41.59C30.18 45.19 33.47 47.27 37 47.27Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M40.58 39C40.58 40.98 38.98 42.58 37 42.58C35.02 42.58 33.42 40.98 33.42 39C33.42 37.02 35.02 35.42 37 35.42C38.98 35.42 40.58 37.02 40.58 39Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span 
                  ref={seeMoreRef}
                  className="see-more-text"
                  style={{
                    opacity: isHoveringEye ? 1 : 0,
                    display: isHoveringEye ? 'block' : 'block' // Keep it visible during animation
                  }}
                >
                  SEE MORE
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
};

export default Transition(Projects);
