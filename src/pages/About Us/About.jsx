import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Transition from '../../components/Transition/Transition';
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import SplitType from 'split-type';
import './About.css';
import { handleOverlay } from '../../utils/overlayManager';

const About = () => {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);
  const pageRef = useRef(null);
  const lenisRef = useRef(null);
  const titleRef = useRef(null);
  const asteriskRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  
  // Refs for About section text
  const aboutLeftRef = useRef(null);
  const aboutRightRef = useRef(null);
  const aboutTextContainerRef = useRef(null);
  const aboutTextsRef = useRef([]);
  
  // Refs for images and skeleton loaders
  const imageRefs = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState([]);

  // Track scroll position to trigger animations
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  
  const images = Array.from({ length: 13 }, (_, i) => `/about/${i + 1}.webp`);
  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);
  // Initialize image refs arrays
  useEffect(() => {
    imageRefs.current = Array(images.length).fill().map(() => React.createRef());
    setImagesLoaded(Array(images.length).fill(false));
  }, [images.length]);

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(CustomEase);
    const customEase = CustomEase.create("custom", ".87,0,.13,1");

    // Initialize text animation
    if (titleRef.current && subtitleRef.current && descriptionRef.current && asteriskRef.current) {
      // Split text for animation
      const titleSplit = new SplitType(titleRef.current, { types: 'chars' });
      const subtitleSplit = new SplitType(subtitleRef.current, { types: 'chars' });
      const descriptionSplit = new SplitType(descriptionRef.current, { types: 'lines' });
      
      // Set initial states
      gsap.set([titleSplit.chars, subtitleSplit.chars, descriptionSplit.lines], {
        y: '100%',
        opacity: 0
      });
      
      gsap.set(asteriskRef.current, {
        y: '100%',
        opacity: 0
      });

      // Set initial state for first image
      if (imageRefs.current[0]?.current) {
        gsap.set(imageRefs.current[0].current, {
          scale: 1.2,
          opacity: 0.5,
          filter: "blur(10px)"
        });
      }

      // Animate title
      gsap.to(titleSplit.chars, {
        y: '0%',
        opacity: 1,
        duration: 1,
        stagger: 0.03,
        ease: customEase,
        delay: 1
      });
      
      // Animate the asterisk along with the last chars of the title
      gsap.to(asteriskRef.current, {
        y: '0%',
        opacity: 1,
        duration: 1,
        ease: customEase,
        delay: 0.5 
      });

      // Animate first image with title
      if (imageRefs.current[0]?.current) {
        gsap.to(imageRefs.current[0].current, {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: customEase,
          delay: 0.5 // Start with title animation
        });
      }

      // Animate subtitle
      gsap.to(subtitleSplit.chars, {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.02,
        ease: customEase,
        delay: 1.2
      });

      // Animate description
      gsap.to(descriptionSplit.lines, {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: customEase,
        delay: 1.5
      });
    }
    
    // Initialize about section text elements
    if (aboutLeftRef.current && aboutRightRef.current && aboutTextContainerRef.current) {
      // Set initial states for About section elements
      gsap.set([aboutLeftRef.current, aboutRightRef.current], {
        opacity: 0,
        x: (index) => index === 0 ? -50 : 50 // Left heading moves from left, right heading from right
      });
      
      // Handle text paragraphs
      if (aboutTextsRef.current.length > 0) {
        gsap.set(aboutTextsRef.current, {
          opacity: 0,
          y: 30
        });
      }
    }
    
    // Set initial state for images (except first one)
    imageRefs.current.forEach((ref, index) => {
      if (ref.current && index > 0) {
        gsap.set(ref.current, {
          scale: 1
        });
      }
    });
  }, [isReady]);

  useEffect(() => {
    if (!containerRef.current || !pageRef.current) return;
    
    // Set window width for calculations
    setWindowWidth(window.innerWidth);

    // Set initial container width to exactly match the number of sections
    const totalWidth = images.length;
    containerRef.current.style.width = `${totalWidth}px`;

    // Initialize Lenis with balanced settings for smoothness and responsiveness
    lenisRef.current = new Lenis({
      wrapper: pageRef.current,
      content: containerRef.current,
      duration: 1.2,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // Smoother easing
      orientation: 'horizontal',
      gestureOrientation: 'horizontal',
      smoothWheel: true,
      wheelMultiplier: 2.5,
      smoothTouch: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Direct wheel event handler to ensure horizontal scrolling
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY || e.deltaX;
      
      // Use Lenis for smooth scrolling if available
      if (lenisRef.current) {
        const targetScroll = pageRef.current.scrollLeft + delta * 6;
        lenisRef.current.scrollTo(targetScroll, {
          force: true,
          duration: 0.8,
          stagger: 0.05,
          easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
        });
      } else {
        pageRef.current.scrollLeft += delta * 2;
      }
    };
    
    // Track scroll position for animations
    const handleScrollUpdate = () => {
      if (pageRef.current) {
        setScrollPosition(pageRef.current.scrollLeft);
      }
    };

    // Animation frame with lerp for smoother scrolling
    function raf(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
      handleScrollUpdate();
    }
    requestAnimationFrame(raf);

    // Handle resize
    const handleResize = () => {
      // Exact width calculation to avoid gaps
      const newWidth = window.innerWidth * images.length;
      containerRef.current.style.width = `${newWidth}px`;
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    // Add wheel event listener with passive:false to allow preventing default
    pageRef.current.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      lenisRef.current?.destroy();
      window.removeEventListener('resize', handleResize);
      pageRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, [images.length]);
  
  // Effect for scroll-triggered animations
  useEffect(() => {
    if (!windowWidth) return;
    
    // Section 1 starts at windowWidth (after first section)
    // Animation should start when scrolling into view and complete by middle of section
    const triggerStart = windowWidth * 0.2; // Start when 20% into first section
    const triggerEnd = windowWidth * 1;   // End by middle of section 1
    
    if (scrollPosition >= triggerStart && scrollPosition <= triggerEnd) {
      // Calculate progress from 0 to 1 based on scroll position
      const progress = (scrollPosition - triggerStart) / (triggerEnd - triggerStart);
      
      // Animate headings
      if (aboutLeftRef.current && aboutRightRef.current) {
        gsap.to(aboutLeftRef.current, {
          x: 0,
          opacity: Math.min(progress * 2, 1),
          duration: 0.1,
          overwrite: true
        });
        
        gsap.to(aboutRightRef.current, {
          x: 0,
          opacity: Math.min(progress * 2, 1),
          duration: 0.1,
          overwrite: true
        });
      }
      
      // Animate paragraphs with stagger
      if (aboutTextsRef.current.length > 0) {
        aboutTextsRef.current.forEach((textRef, index) => {
          // Stagger the animations based on index
          const delayedProgress = progress - (index * 0.1);
          const opacity = Math.max(0, Math.min(delayedProgress * 3, 1));
          
          gsap.to(textRef, {
            y: delayedProgress > 0 ? Math.max(30 * (1 - delayedProgress * 2), 0) : 30,
            opacity: opacity,
            overwrite: true,
            duration: 0.1,
            stagger: 0.1,
          });
        });
      }
    } else if (scrollPosition < triggerStart) {
      // Reset animations when scrolling back
      if (aboutLeftRef.current && aboutRightRef.current) {
        gsap.to([aboutLeftRef.current, aboutRightRef.current], {
          opacity: 0,
          x: (index) => index === 0 ? -50 : 50,
          duration: 0.3,
          overwrite: true
        });
      }
      
      if (aboutTextsRef.current.length > 0) {
        gsap.to(aboutTextsRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.3,
          overwrite: true
        });
      }
    }
    
    // Animate images based on scroll position (skip the first image)
    imageRefs.current.forEach((imageRef, index) => {
      // Skip the first image as it's not scroll-triggered
      if (!imageRef.current || index === 0) return;
      
      // Calculate when image should be in view
      const imageTriggerStart = windowWidth * (index - 0.5);
      const imageTriggerEnd = windowWidth * (index + 0.5);
      
      // Check if image is in view
      if (scrollPosition >= imageTriggerStart && scrollPosition <= imageTriggerEnd) {
        const imageProgress = (scrollPosition - imageTriggerStart) / (imageTriggerEnd - imageTriggerStart);
        
        // Apply subtle animation effects to the image
        gsap.to(imageRef.current, {
          scale: 1 + Math.sin(imageProgress * Math.PI) * 0.05, // Subtle scale effect based on position
          filter: `brightness(${1 + imageProgress * 0.2})`,
          duration: 0.3,
          overwrite: true
        });
      } else {
        // Reset image when out of view
        gsap.to(imageRef.current, {
          scale: 1,
          filter: "brightness(1)",
          duration: 0.3,
          overwrite: true
        });
      }
    });
  }, [scrollPosition, windowWidth, imagesLoaded]);

  useEffect(() => {
    setIsReady(true);
  }, []);
  
  // Handle refs for about text paragraphs
  const setTextRef = (el, index) => {
    if (aboutTextsRef.current.length <= index) {
      aboutTextsRef.current[index] = el;
    } else {
      aboutTextsRef.current[index] = el;
    }
  };
  
  // Handle image load events
  const handleImageLoad = (index) => {
    const newImagesLoaded = [...imagesLoaded];
    newImagesLoaded[index] = true;
    setImagesLoaded(newImagesLoaded);
    
    // We're not animating opacity anymore - images should be visible by default
    if (index > 0 && imageRefs.current[index]?.current) {
      gsap.to(imageRefs.current[index].current, { 
        scale: 1,
        duration: 0.3
      });
    }
  };

  return (
    <div ref={pageRef} className={`about-page ${isReady ? 'is-ready' : ''}`}>
      <div ref={containerRef} className="about-container">
        {images.map((src, index) => (
          <section key={index} className="about-section">
            <div className="image-container">
              <img 
                ref={imageRefs.current[index]}
                src={src} 
                alt={`About section ${index + 1}`} 
                className="background-image"
                onLoad={() => handleImageLoad(index)}
                style={{ opacity: index === 0 ? 0.5 : 1 }} // All images visible except first one slightly faded
              />
            </div>
            <div className="about-content">
              {index === 0 && (
                <div className="about-content">
                  <h1 ref={titleRef} className="main-title">
                    CALL US<br />VISIBLE<span ref={asteriskRef} className="asterisk">*</span>
                  </h1>
                  <p ref={subtitleRef} className="subtitle">(VIZ.Ə.BƏL)</p>
                  <p ref={descriptionRef} className="description">
                    VZBL IS ALL ABOUT BEING SEEN. IT'S THE FREQUENCY AT WHICH YOUR BRAND SHOWS UP, WHETHER IN SEARCH RESULTS, ON SOCIAL MEDIA, THROUGH EMAIL, OR ACROSS OTHER MARKETING CHANNELS. IT'S ABOUT MAKING YOUR BRAND IMPOSSIBLE TO IGNORE, GRABBING ATTENTION, AND BUILDING AN IDENTITY THAT STICKS.
                  </p>
                </div>
              )}
              {index === 1 && (
                <div className="about-split-layout">
                  <div ref={aboutLeftRef} className="about-left">
                    <h2 className="about-heading">/ ABOUT</h2>
                  </div>
                  <div ref={aboutTextContainerRef} className="about-text-container">
                    <p ref={(el) => setTextRef(el, 0)} className="about-paragraph">A CREATIVE AGENCY BUILT TO DEFY THE ORDINARY.</p>
                    <p ref={(el) => setTextRef(el, 1)} className="about-paragraph">FROM BRANDING TO MEDIA PRODUCTION, WE DELIVER WORK THAT REVEALS THE UNSEEN.</p>
                    <p ref={(el) => setTextRef(el, 2)} className="about-paragraph">OUR APPROACH IS SIMPLE: THINK BOLD, CREATE SMART, AND OWN THE SPOTLIGHT WITH EVERY PROJECT.</p>
                  </div>
                  <div ref={aboutRightRef} className="about-right">
                    <h2 className="about-heading">US /</h2>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Transition(About);
