import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const textRefs = useRef([useRef(null), useRef(null), useRef(null)]);
  const counterRef = useRef(null);

  // Define categories with memoization to avoid recreation on each render
  const categories = useMemo(() => ["BRANDING", "MARKETING", "ADVERTISEMENT"], []);
  
  // Client images for the slider
  const clientImages = [
    "/project/Asset 1.webp",
    "/project/Asset 3.webp",
    "/project/Asset 4.webp",
    "/project/Asset 5.webp",
    "/project/Asset 7.webp",
    "/project/Asset 6.webp",
    "/project/Asset 13.webp",
    "/project/Asset 8.webp",
    "/project/Asset 12.webp",
    "/project/Asset 11.webp",
    "/project/Asset 10.webp",
    "/project/Asset 9.webp"
  ];
  
  useEffect(() => {
    document.title = "Projects | VZBL";
    
    // Add projects-page class to body
    document.body.classList.add('projects-page');
    
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
      
      // Remove projects-page class when component unmounts
      document.body.classList.remove('projects-page');
    };
  }, []);
  
  const handleNext = useCallback(() => {
    if (!isAnimating) {
      const nextIndex = (currentIndex + 1) % categories.length;
      setIsAnimating(true);
      animateTextTransition(currentIndex, nextIndex, 'next');
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, categories.length, isAnimating]);

  const handlePrev = useCallback(() => {
    if (!isAnimating) {
      const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
      setIsAnimating(true);
      animateTextTransition(currentIndex, prevIndex, 'prev');
      setCurrentIndex(prevIndex);
    }
  }, [currentIndex, categories.length, isAnimating]);

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
      let urlCategory = category.toLowerCase().replace(/ /g, "-");
      
      // Special case for advertising/advertisement
      if (urlCategory === "advertising") {
        urlCategory = "advertising";
      }
      
      // Navigate to all-projects with current category
      navigate(`/all-projects/${urlCategory}`);
    }
  };

  useEffect(() => {
    // Set initial states for UI elements
    gsap.set([counterRef.current], {
      opacity: 0
    });

    // Store ref values to use in cleanup
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
    const counter = counterRef.current;
    const textRefElements = textRefs.current.map(ref => ref.current);

    // Wait a short delay to ensure transition has completed
    setTimeout(() => {
      // Set initial states for UI elements
      gsap.set(prevBtn, { 
        y: -50, 
        visibility: "visible",
        opacity: 0
      });
      
      gsap.set(nextBtn, { 
        y: 50, 
        visibility: "visible",
        opacity: 0
      });
      
      gsap.set(counter, { 
        y: 30, 
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
      
      tl.to(prevBtn, {
        y: 0,
        opacity: 0.7,
        duration: 0.5,
        ease: "power2.out"
      }, "+=0.2")
      .to(nextBtn, {
        y: 0,
        opacity: 0.7,
        duration: 0.5, 
        ease: "power2.out"
      }, "-=0.3")
      .to(counter, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3");
    }, 200);
    
    // Clean up animations on unmount
    return () => {
      gsap.killTweensOf([
        prevBtn,
        nextBtn,
        counter,
        ...textRefElements
      ]);
    };
  }, []);

  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  // Add effect for mobile text opacity 
  useEffect(() => {
    if (isMobile) {
      // Update opacity for mobile when currentIndex changes
      textRefs.current.forEach((ref, index) => {
        // Force calculation of the correct positions, handling circular wrapping properly
        const isCurrentItem = index === currentIndex;
        const isNextItem = index === (currentIndex + 1) % categories.length;
        const isPrevItem = index === (currentIndex - 1 + categories.length) % categories.length;
        
        // Handle each position case
        if (isCurrentItem) {
          // Current text in center (full opacity)
          gsap.to(ref.current, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            visibility: "visible"
          });
        } else if (isNextItem) {
          // Text below (medium opacity)
          gsap.to(ref.current, {
            opacity: 0.5,
            scale: 0.9,
            y: 60,
            duration: 0.4,
            ease: "power2.out",
            visibility: "visible"
          });
        } else if (isPrevItem) {
          // Text above (medium opacity)
          gsap.to(ref.current, {
            opacity: 0.5,
            scale: 0.8,
            y: -60,
            duration: 0.4,
            ease: "power2.out",
            visibility: "visible"
          });
        } else {
          // Other text items (slight visibility)
          gsap.to(ref.current, {
            opacity: 0.2,
            scale: 0.7,
            y: index < currentIndex ? -90 : 90,
            duration: 0.4,
            ease: "power2.out",
            visibility: "visible"
          });
        }
      });
      
      // Make sure navigation buttons are properly visible on mobile
      if (prevBtnRef.current && nextBtnRef.current) {
        gsap.to([prevBtnRef.current, nextBtnRef.current], {
          opacity: 0.7,
          duration: 0.3
        });
      }
      
      // Debug
      console.log("Current category:", categories[currentIndex], "index:", currentIndex, 
                  "prev:", (currentIndex - 1 + categories.length) % categories.length,
                  "next:", (currentIndex + 1) % categories.length);
    }
  }, [isMobile, currentIndex, categories.length, categories]);

  // Add a wheel event handler for touchpad/mouse scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      // Don't process if animation is already in progress
      if (isAnimating) return;
      
      // Skip handling on mobile devices
      if (isMobile) return;
      
      // Determine scroll direction (positive = down, negative = up)
      const direction = e.deltaY > 0 ? 'next' : 'prev';
      
      if (direction === 'next') {
        // Move to next category, or loop back to first
        const nextIndex = (currentIndex + 1) % categories.length;
        setIsAnimating(true);
        animateTextTransition(currentIndex, nextIndex, 'next');
        setCurrentIndex(nextIndex);
      } else {
        // Move to previous category, or loop to last
        const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
        setIsAnimating(true);
        animateTextTransition(currentIndex, prevIndex, 'prev');
        setCurrentIndex(prevIndex);
      }
    };
    
    // Throttle function to prevent too many wheel events
    let timeout;
    const throttledWheel = (e) => {
      // Skip handling on mobile devices
      if (isMobile) return;
      
      if (timeout) return;
      timeout = setTimeout(() => {
        handleWheel(e);
        timeout = null;
      }, 500); // Adjust this delay to control scroll sensitivity
    };
    
    // Add the event listener to the text container
    const textContainer = document.querySelector('.text-container');
    if (textContainer) {
      textContainer.addEventListener('wheel', throttledWheel);
    }
    
    // Clean up
    return () => {
      if (textContainer) {
        textContainer.removeEventListener('wheel', throttledWheel);
      }
      clearTimeout(timeout);
    };
  }, [currentIndex, isAnimating, categories.length, isMobile]);

  // Add touch swipe detection for mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    const minSwipeDistance = 50; // Minimum distance for swipe detection
    const maxTapDuration = 300; // Maximum duration for a tap in milliseconds
    let isTouchScrolling = false;
    
    // Prevent page scrolling
    const preventPageScroll = (e) => {
      // Allow scrolling only within .text-container
      if (!e.target.closest('.text-container')) {
        e.preventDefault();
      }
    };
    
    // Add event listeners to prevent page scrolling
    document.addEventListener('touchmove', preventPageScroll, { passive: false });
    
    const handleTouchStart = (e) => {
      if (isAnimating) return;
      // Record start position and time
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      isTouchScrolling = false;
    };
    
    const handleTouchMove = (e) => {
      if (isAnimating) return;
      // Update end position
      touchEndY = e.touches[0].clientY;
      touchEndX = e.touches[0].clientX;
      
      // Determine if this is a vertical scroll
      const verticalDistance = Math.abs(touchEndY - touchStartY);
      const horizontalDistance = Math.abs(touchEndX - touchStartX);
      
      // If vertical movement is significantly greater than horizontal, mark as scrolling
      if (verticalDistance > horizontalDistance * 1.5 && verticalDistance > 10) {
        isTouchScrolling = true;
      }
    };
    
    const handleTouchEnd = (e) => {
      if (isAnimating) return;
      
      const touchDuration = Date.now() - touchStartTime;
      
      // If this was a tap/click on a category element, handle it as a click
      if (e.target.closest('.category-text') && !isTouchScrolling && touchDuration < maxTapDuration) {
        // This will be handled by the onClick handler, so just return
        return;
      }
      
      // If we're scrolling the container, don't process as a swipe
      if (isTouchScrolling) {
        const swipeDistance = touchStartY - touchEndY;
        
        // Only process if it's a significant swipe gesture
        if (Math.abs(swipeDistance) > minSwipeDistance) {
          if (swipeDistance > 0) {
            // Swipe up - go to next
            handleNext();
          } else {
            // Swipe down - go to previous
            handlePrev();
          }
        }
      }
    };
    
    const textContainer = document.querySelector('.text-container');
    if (textContainer && isMobile) {
      textContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
      textContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
      textContainer.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      if (textContainer) {
        textContainer.removeEventListener('touchstart', handleTouchStart);
        textContainer.removeEventListener('touchmove', handleTouchMove);
        textContainer.removeEventListener('touchend', handleTouchEnd);
      }
      document.removeEventListener('touchmove', preventPageScroll);
    };
  }, [isAnimating, isMobile, handleNext, handlePrev]);

  return (
    <ReactLenis root options={{ smooth: false, gestureOrientation: 'vertical', syncTouch: true }}>
      <div className="project-container">
        <div className="project-content">
          <div className="project-navigation left-nav">
            <button
              ref={prevBtnRef}
              className="nav-button prev"
              onClick={handlePrev}
              style={{ opacity: 0.7 }}
            >
              <svg width="28" height="16" viewBox="0 0 28 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 14L14 2L26 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              ref={nextBtnRef}
              className="nav-button next"
              onClick={handleNext}
              style={{ opacity: 0.7 }}
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
                className={`category-text ${index === currentIndex ? 'active' : ''}`}
                ref={textRefs.current[index]}
                onClick={() => handleCategoryClick(category)}
                data-category={category.toLowerCase()}
                style={{
                  cursor: "pointer",
                  pointerEvents: isAnimating ? "none" : "auto",
                }}
              >
                {category}
              </div>
            ))}
          </div>

          <div className="project-navigation right-nav">
            <div ref={counterRef} className="project-counter">
              <span>1</span>
              <span>/</span>
              <span>3</span>
            </div>
          </div>
        </div>
        
        <ImageSlider assets={clientImages} />
      </div>
    </ReactLenis>
  );
};

const ProjectsPage = Transition(Projects);
export default ProjectsPage;
