import React, { useRef, useEffect, useState } from "react";
import "./Contact.css";
import gsap from "gsap";

import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";

import ReactLenis from "lenis/react";

import Transition from "../../components/Transition/Transition";
import { handleOverlay } from "../../utils/overlayManager";
import { CDN_CONFIG } from "../../config/cdn";

const Contact = () => {
  const videoRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Get In Touch | VZBL";
  }, []);

  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  useEffect(() => {
    // Animate the video background (blur effect)
    if (videoWrapperRef.current) {
      gsap.to(videoWrapperRef.current, {
        filter: "blur(100px)",
        duration: 1,
        ease: "power2.inOut"
      });
    }
  }, []);

  // Video loading effect (like Home page)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add error handler for video
    const handleVideoError = () => {
      setVideoError(true);
      // Trigger fade-in for fallback
      setTimeout(() => setFadeIn(true), 100);
    };
    
    // Handle successful loading
    const handleCanPlay = () => {
      setVideoLoaded(true);
      // Video is ready, trigger fade-in effect
      setTimeout(() => setFadeIn(true), 100);
    };
    
    // Add event listeners
    video.addEventListener('error', handleVideoError);
    video.addEventListener('canplay', handleCanPlay);
    
    // Safety timeout for video loading
    const loadTimeout = setTimeout(() => {
      if (!videoLoaded) {
        setVideoError(true);
        setTimeout(() => setFadeIn(true), 100);
      }
    }, 5000);
    
    return () => {
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('canplay', handleCanPlay);
      clearTimeout(loadTimeout);
    };
  }, [videoLoaded]);

  return (
    <ReactLenis root>
      <div className="page contact">
        <div 
          ref={videoWrapperRef}
          className={`video-background ${videoError ? 'video-error' : ''} ${fadeIn ? 'fade-in' : ''}`}
        >
          {!videoError ? (
            <video
              ref={videoRef}
              className="background-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              src={CDN_CONFIG.getHomeVideoUrl('desktop')}
            />
          ) : (
            <div className="video-fallback" style={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#000' 
            }} />
          )}
        </div>
        <div className="contact-wrapper">
          <ContactForm />
        </div>
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(Contact);
