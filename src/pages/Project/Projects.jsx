import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import "./Projects.css";
import Transition from "../../components/Transition/Transition";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import projectsData from "../../data/projectsData.json";
import { handleOverlay } from "./../../utils/overlayManager";
import ReactLenis from "lenis/react";
import ImageSlider from "../../components/Carousel/ImageSlider";


const Projects = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const textRefs = useRef([useRef(null), useRef(null), useRef(null)]);

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
    
    // Set initial opacity
    setTimeout(() => {
      resetTextOpacity(currentIndex);
    }, 200);
    
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

  // Enhanced opacity reset function for consistent appearance across all devices
  const resetTextOpacity = (activeIndex) => {
    textRefs.current.forEach((ref, index) => {
      if (!ref.current) return;
      
      if (index === activeIndex) {
        // Active text (center)
        gsap.set(ref.current, {
          opacity: 1,
          scale: 1,
          y: 0
        });
        ref.current.style.opacity = "1";
      } else if (index === (activeIndex + 1) % categories.length) {
        // Next text (below)
        gsap.set(ref.current, {
          opacity: 0.3,
          scale: 0.9,
          y: 70
        });
        ref.current.style.opacity = "0.3";
      } else if (index === (activeIndex - 1 + categories.length) % categories.length) {
        // Previous text (above)
        gsap.set(ref.current, {
          opacity: 0.3,
          scale: 0.8,
          y: -70
        });
        ref.current.style.opacity = "0.3";
      } else {
        // Other text items
        gsap.set(ref.current, {
          opacity: 0.2,
          scale: 0.7,
          y: index < activeIndex ? -70 : 70
        });
        ref.current.style.opacity = "0.2";
      }
    });
  };

  // Enhanced handleCategoryClick with forced opacity reset
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

  // Modified animation function with direct style manipulation for mobile
  const animateTextTransition = (fromIndex, toIndex, direction) => {    
    // Get all text elements
    const fromText = textRefs.current[fromIndex].current;
    const toText = textRefs.current[toIndex].current;
    const thirdIndex = 3 - fromIndex - toIndex; // Get the index of the third text element
    const thirdText = textRefs.current[thirdIndex]?.current;
    
    if (direction === 'next') {
      // Current text exits to top
      gsap.to(fromText, {
        y: -70,
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power3.out"
      });
      fromText.style.opacity = "0";
      
      // Next text comes to center
      gsap.to(toText, { 
        y: 0, 
        opacity: 1,
        scale: 1, 
        duration: 0.5,
        ease: "power3.out",
        visibility: 'visible'
      });
      toText.style.opacity = "1";
      
      // Third text moves below
      if (thirdText) {
        gsap.to(thirdText, {
          y: 70,
          opacity: 0.3,
          scale: 0.9,
          duration: 0.5,
          ease: "power3.out",
          visibility: 'visible'
        });
        thirdText.style.opacity = "0.3";
      }
    } else {
      // Current text exits to bottom
      gsap.to(fromText, {
        y: 70,
        opacity: 0.3,
        scale: 0.9,
        duration: 0.5,
        ease: "power3.out"
      });
      fromText.style.opacity = "0.3";
      
      // Previous text comes to center
      gsap.to(toText, { 
        y: 0, 
        opacity: 1,
        scale: 1, 
        duration: 0.5,
        ease: "power3.out",
        visibility: 'visible'
      });
      toText.style.opacity = "1";
      
      // Third text moves above
      if (thirdText) {
        gsap.to(thirdText, {
          y: -70,
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "power3.out",
          visibility: 'visible'
        });
        thirdText.style.opacity = "0";
      }
    }
    
    // End animation state
    setTimeout(() => {
      setIsAnimating(false);
      resetTextOpacity(toIndex);
    }, 500);
  };

  useEffect(() => {
    // Set initial states for UI elements
    gsap.set([prevBtnRef.current, nextBtnRef.current], {
      opacity: 0
    });

    // Store ref values to use in cleanup
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
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
            y: 70, // Reduced from 100
            opacity: 0.3,
            scale: 0.9,
            visibility: "visible"
          });
        } else {
          // Previous category (above)
          gsap.set(ref.current, { 
            y: -70, // Reduced from -100
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
      }, "-=0.3");
    }, 200);
    
    // Clean up animations on unmount
    return () => {
      gsap.killTweensOf([
        prevBtn,
        nextBtn,
        ...textRefElements
      ]);
    };
  }, []);

  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  // Add a wheel event handler for touchpad/mouse scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      // Don't process if animation is already in progress
      if (isAnimating) return;
      
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
      if (timeout) return;
      timeout = setTimeout(() => {
        handleWheel(e);
        timeout = null;
      }, 400); // Reduced from 500 for more responsive scrolling
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

  // Add effect for mobile text opacity - make animations consistent across all devices
  useEffect(() => {
    // Update all text elements with the same animations regardless of device
    textRefs.current.forEach((ref, index) => {
      if (!ref.current) return;
      
      // Force calculation of the correct positions, handling circular wrapping properly
      const isCurrentItem = index === currentIndex;
      const isNextItem = index === (currentIndex + 1) % categories.length;
      const isPrevItem = index === (currentIndex - 1 + categories.length) % categories.length;
      
      // Set active class for correct CSS targeting
      if (isCurrentItem) {
        ref.current.classList.add('active');
      } else {
        ref.current.classList.remove('active');
      }
      
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
        // Set direct style for mobile
        ref.current.style.opacity = "1";
      } else if (isNextItem) {
        // Text below (medium opacity) - REDUCE vertical gap
        gsap.to(ref.current, {
          opacity: 0.3, // Consistent partial opacity
          scale: 0.9,
          y: 70, // Reduced from 100
          duration: 0.4,
          ease: "power2.out",
          visibility: "visible"
        });
        // Set direct style for mobile
        ref.current.style.opacity = "0.3";
      } else if (isPrevItem) {
        // Text above (medium opacity) - REDUCE vertical gap
        gsap.to(ref.current, {
          opacity: 0.3, // Consistent partial opacity
          scale: 0.8,
          y: -70, // Reduced from -100
          duration: 0.4,
          ease: "power2.out",
          visibility: "visible"
        });
        // Set direct style for mobile
        ref.current.style.opacity = "0.3";
      } else {
        // Other text items (slight visibility) - REDUCE vertical gap
        gsap.to(ref.current, {
          opacity: 0.2, // Keep very low opacity for other items
          scale: 0.7,
          y: index < currentIndex ? -70 : 70, // Reduced from -100/100
          duration: 0.4,
          ease: "power2.out",
          visibility: "visible"
        });
        // Set direct style for mobile
        ref.current.style.opacity = "0.2";
      }
    });
    
    // Make sure navigation buttons are properly visible on all devices
    if (prevBtnRef.current && nextBtnRef.current) {
      gsap.to([prevBtnRef.current, nextBtnRef.current], {
        opacity: 0.7,
        duration: 0.3
      });
    }
  }, [currentIndex, categories.length, isMobile, categories]);

  // Add touch swipe detection for mobile with same behavior as desktop
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    const minSwipeDistance = 30; // Smaller minimum distance for more responsive swiping
    const maxTapDuration = 300; // Maximum duration for a tap in milliseconds
    let isTouchScrolling = false;
    
    // Prevent page scrolling only when interacting with the selector
    const preventPageScroll = (e) => {
      // Check if we're interacting with the selector
      if (e.target.closest('.text-container') || e.target.closest('.project-navigation')) {
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
      if (verticalDistance > horizontalDistance * 1.2 && verticalDistance > 10) {
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
      
      // If we're scrolling the container, process as a swipe
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
    if (textContainer) {
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
            {/* Empty div to maintain layout balance */}
          </div>
        </div>
        <div className="image-slider-bootstrap-wrapper">
          <ImageSlider assets={clientImages} />
        </div>
      </div>
    </ReactLenis>
  );
};

const ProjectsPage = Transition(Projects);
export default ProjectsPage;
