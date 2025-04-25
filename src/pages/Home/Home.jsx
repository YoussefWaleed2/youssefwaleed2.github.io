import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import SplashScreen from "../../components/SplashScreen/SplashScreen";
import ReactLenis from "lenis/react";
import Transition from "../../components/Transition/Transition";
import { handleOverlay, shouldShowSplash } from "./../../utils/overlayManager";

const Home = () => {
  const videoRef = useRef(null);
  const [showSplash, setShowSplash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Set page title
  useEffect(() => {
    document.title = "VZBL";
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
    try {
      sessionStorage.setItem('hasSeenSplash', 'true');
    } catch (error) {
      console.error("Error setting sessionStorage:", error);
    }
    setShowSplash(false);
    handleOverlay();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start playing video as soon as possible
    video.play().catch(console.error);
    
    return () => {
      // Clean up
    };
  }, []);

  return (
    <ReactLenis root>
      <div className="page home">
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <div className="video-wrapper">
          <video 
            ref={videoRef}
            src={isMobile ? "home/Home Mobile vid.webm" : "home/vid.webm"}
            poster="home/poster.jpg"
            autoPlay 
            muted
            loop 
            playsInline
            preload="auto"
          />
        </div>
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
