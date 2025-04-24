import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import SplashScreen from "../../components/SplashScreen/SplashScreen";
import ReactLenis from "lenis/react";
import Transition from "../../components/Transition/Transition";
import { handleOverlay, shouldShowSplash } from "./../../utils/overlayManager";

const Home = () => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Check if we should show the splash screen
  useEffect(() => {
    // Force clear the splash screen on each page mount to handle navigation
    handleOverlay();
    
    // Check if splash should be shown
    setShowSplash(shouldShowSplash());
    
    // Add a cleanup function to force hide the overlay when unmounting
    return () => {
      handleOverlay();
    };
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setIsSplashComplete(true);
    try {
      sessionStorage.setItem('hasSeenSplash', 'true');
    } catch (error) {
      console.error("Error setting sessionStorage:", error);
    }
  };

  // Handle video loading and splash screen coordination
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      video.play().catch(console.error);
    };

    video.addEventListener('canplay', handleCanPlay);
    
    // Preload video
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isMobile]);

  // Handle final transition after both splash and video are ready
  useEffect(() => {
    if (isSplashComplete && isVideoLoaded) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowSplash(false);
        handleOverlay();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isSplashComplete, isVideoLoaded]);

  return (
    <ReactLenis root>
      <div className="page home">
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <div className="video-wrapper">
          {/* {!isVideoLoaded && (
            <div className="video-placeholder">
              <img src="home/poster.jpg" alt="Video Poster" />
            </div>
          )} */}
          <video 
            ref={videoRef}
            src={isMobile ? "home/Home Mobile vid.webm" : "home/vid.webm"}
            poster="home/poster.jpg"
            autoPlay 
            muted
            loop 
            playsInline
            preload="auto"
            style={{ 
              opacity: isVideoLoaded && isSplashComplete ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          />
        </div>
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
