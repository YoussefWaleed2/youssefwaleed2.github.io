import React, { useRef, useEffect, useState } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ assets }) => {
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  
  // Detect device types
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const android = /Android/i.test(navigator.userAgent);
    
    setIsIOS(iOS);
    setIsAndroid(android);
    
    // Apply CSS variables for safe area insets
    document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom, 0px)');
    
    // Fix slider positioning on all mobile devices
    if ((iOS || android) && containerRef.current) {
      // Force hardware acceleration and positioning
      containerRef.current.style.position = 'fixed';
      containerRef.current.style.bottom = '0';
      containerRef.current.style.left = '0';
      containerRef.current.style.right = '0';
      containerRef.current.style.zIndex = '100';
      containerRef.current.style.height = '50px';
      containerRef.current.style.transform = 'translateZ(0)';
      containerRef.current.style.webkitTransform = 'translateZ(0)';
      containerRef.current.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      
      if (iOS) {
        containerRef.current.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
      }
    }
  }, []);
  
  // Apply animation fixes for all devices
  useEffect(() => {
    if (!sliderRef.current) return;
    
    // Apply animation properties directly
    sliderRef.current.style.transform = 'translateZ(0)';
    sliderRef.current.style.webkitTransform = 'translateZ(0)';
    sliderRef.current.style.willChange = 'transform';
    sliderRef.current.style.animation = 'slide 40s linear infinite';
    sliderRef.current.style.webkitAnimation = 'slide 40s linear infinite';
    sliderRef.current.style.animationPlayState = 'running';
    sliderRef.current.style.webkitAnimationPlayState = 'running';
    
    // Create a style element to force animation on all mobile devices
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes slide {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @-webkit-keyframes slide {
        0% { -webkit-transform: translateX(0); }
        100% { -webkit-transform: translateX(-50%); }
      }
      .image-slider {
        animation: slide 40s linear infinite !important;
        -webkit-animation: slide 40s linear infinite !important;
        animation-play-state: running !important;
        -webkit-animation-play-state: running !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Reset and restart animation periodically to ensure it's running
    const animationInterval = setInterval(() => {
      if (sliderRef.current) {
        // Force repaint
        sliderRef.current.style.animationName = 'none';
        sliderRef.current.style.webkitAnimationName = 'none';
        
        // Trigger reflow
        void sliderRef.current.offsetWidth;
        
        // Restart animation
        sliderRef.current.style.animationName = 'slide';
        sliderRef.current.style.webkitAnimationName = 'slide';
        sliderRef.current.style.animationPlayState = 'running';
        sliderRef.current.style.webkitAnimationPlayState = 'running';
      }
    }, 5000); // Check every 5 seconds
    
    // Force repaints immediately and after a delay
    const forceRepaint = () => {
      if (sliderRef.current) {
        sliderRef.current.style.display = 'none';
        void sliderRef.current.offsetHeight;
        sliderRef.current.style.display = 'flex';
      }
    };
    
    // Apply once and then again after content loaded
    forceRepaint();
    setTimeout(forceRepaint, 1000);
    
    // Clean up
    return () => {
      document.head.removeChild(styleElement);
      clearInterval(animationInterval);
    };
  }, [isIOS, isAndroid]);

  // We need only one sequence with AND MORE... at the end
  const sliderItems = [
    ...assets,
    "more-text" // Special marker for the "AND MORE..." text
  ];

  // iOS styling overrides
  const containerStyle = isIOS ? {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    top: 'auto',
    transform: 'translateZ(0)',
    WebkitTransform: 'translateZ(0)',
    height: '50px',
    zIndex: 100,
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  } : isAndroid ? {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    top: 'auto',
    transform: 'translateZ(0)',
    WebkitTransform: 'translateZ(0)',
    height: '50px',
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  } : {};

  return (
    <div ref={containerRef} className="image-slider-container" style={containerStyle}>
      <div ref={sliderRef} className="image-slider">
        {/* First copy of sequence */}
        {sliderItems.map((item, index) => (
          item === "more-text" ? (
            <span key={`more-text-1`} className="slider-more-text">AND MORE...</span>
          ) : (
            <img 
              key={`slider-1-${index}`}
              src={item} 
              alt={`Slider asset ${index + 1}`} 
              className="slider-image"
              loading="eager"
            />
          )
        ))}
        
        {/* Second copy of sequence to ensure seamless looping */}
        {sliderItems.map((item, index) => (
          item === "more-text" ? (
            <span key={`more-text-2`} className="slider-more-text">AND MORE...</span>
          ) : (
            <img 
              key={`slider-2-${index}`}
              src={item} 
              alt={`Slider asset ${index + 1}`} 
              className="slider-image"
              loading="eager"
            />
          )
        ))}
      </div>
    </div>
  );
};

export default ImageSlider; 