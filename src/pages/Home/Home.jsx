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
  const [isLoading, setIsLoading] = useState(true);

  // Preload essential resources
  useEffect(() => {
    // Preload video with proper attributes
    const preloadVideo = () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = isMobile ? "home/Home Mobile vid.webm" : "home/vid.webm";
      link.type = 'video/webm';
      document.head.appendChild(link);
    };

    // Preload splash screen assets
    const preloadSplashAssets = () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = 'home/poster.jpg';
      document.head.appendChild(link);
    };

    // Preload navigation assets
    const preloadNavAssets = () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = '/nav.css';
      document.head.appendChild(link);
    };

    // Execute preloading
    preloadVideo();
    preloadSplashAssets();
    preloadNavAssets();

    // Set initial loading state
    setIsLoading(true);
  }, [isMobile]);

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
    // Only hide splash if video is loaded
    if (isVideoLoaded) {
      try {
        sessionStorage.setItem('hasSeenSplash', 'true');
      } catch (error) {
        console.error("Error setting sessionStorage:", error);
      }
      setShowSplash(false);
      handleOverlay();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      video.play().catch(console.error);
      
      // If splash screen is already complete, hide it
      if (!showSplash) {
        handleSplashComplete();
      }
    };

    // Set video attributes for better performance
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('preload', 'auto');
    video.setAttribute('loading', 'eager');

    video.addEventListener('loadeddata', handleLoadedData);
    
    // Preload video
    if (video.readyState >= 3) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [isMobile]); // Re-run when isMobile changes to update video source

  return (
    <ReactLenis root>
      <div className="page home">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
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
            loading="eager"
            style={{ 
              opacity: isVideoLoaded ? 1 : 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
