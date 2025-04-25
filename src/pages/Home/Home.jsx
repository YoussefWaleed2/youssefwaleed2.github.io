import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import SplashScreen from "../../components/SplashScreen/SplashScreen";
import ReactLenis from "lenis/react";
import Transition from "../../components/Transition/Transition";
import { shouldShowSplash , handleOverlay } from "./../../utils/overlayManager";

const Home = () => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    handleOverlay();
  }, []);
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
    // Check if splash should be shown - don't call handleOverlay here
    setShowSplash(shouldShowSplash());
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem('hasSeenSplash', 'true');
    } catch (error) {
      console.error("Error setting sessionStorage:", error);
    }
    setShowSplash(false);
    // handleOverlay call is not needed here - the SplashScreen component
    // already handles its own animation exit
  };

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
  }, []);

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
            style={{ opacity: isVideoLoaded ? 1 : 0 }}
          />
        </div>
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
