import React, { useRef } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ assets }) => {
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isIPhone15, setIsIPhone15] = useState(false);
  
  // Detect iOS and iPhone model
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);
    
    // Check for iPhone 15 specifically (430px width, 932px height, 3x pixel ratio)
    const iPhone15Check = iOS && 
      (window.screen.width === 430 || window.screen.height === 430) && 
      (window.screen.height === 932 || window.screen.width === 932) && 
      window.devicePixelRatio === 3;
    
    setIsIPhone15(iPhone15Check);
    
    if (iPhone15Check) {
      console.log("iPhone 15 detected - applying specific fixes");
      
      // Try to force proper positioning after page is fully loaded
      setTimeout(() => {
        const safeAreaBottom = getSafeAreaBottom();
        console.log("Safe area bottom:", safeAreaBottom);
        if (containerRef.current) {
          containerRef.current.style.position = 'fixed';
          containerRef.current.style.bottom = '0px';
          // Try using env() if supported
          containerRef.current.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
        }
      }, 500);
    }
  }, []);
  
  // Get safe area bottom inset
  const getSafeAreaBottom = () => {
    if (typeof window === 'undefined') return 0;
    
    // Try to get iOS safe area
    const computedStyle = window.getComputedStyle(document.documentElement);
    const safeAreaBottom = computedStyle.getPropertyValue('--safe-area-inset-bottom');
    if (safeAreaBottom) return parseInt(safeAreaBottom, 10);
    
    return 0;
  };
  
  // Fix for iOS devices
  useEffect(() => {
    if (!isIOS || !containerRef.current) return;
    
    // Force repaint to ensure visibility on iOS
    containerRef.current.style.display = 'none';
    
    // Force iOS to position the element correctly
    if (isIPhone15 && containerRef.current) {
      // Apply direct styles for iPhone 15
      const container = containerRef.current;
      container.style.position = 'fixed';
      container.style.bottom = '0';
      container.style.left = '0';
      container.style.right = '0';
      container.style.top = 'auto';
      container.style.transform = 'none';
      container.style.webkitTransform = 'none';
      container.style.zIndex = '9999';
      container.style.height = '60px';
      container.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
      
      // Add event listener to ensure it stays at the bottom even after scrolling
      const fixPosition = () => {
        if (containerRef.current) {
          containerRef.current.style.position = 'fixed';
          containerRef.current.style.bottom = '0';
          
          // Ensure it's visible on any page
          containerRef.current.style.zIndex = '9999';
          containerRef.current.style.width = '100%';
          containerRef.current.style.left = '0';
          containerRef.current.style.right = '0';
        }
      };
      
      window.addEventListener('scroll', fixPosition);
      window.addEventListener('resize', fixPosition);
      window.addEventListener('orientationchange', fixPosition);
      
      // Clean up event listeners
      return () => {
        window.removeEventListener('scroll', fixPosition);
        window.removeEventListener('resize', fixPosition);
        window.removeEventListener('orientationchange', fixPosition);
      };
    }
    
    // For all iOS devices
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.display = 'flex';
      }
      
      // Make sure animation is running
      if (sliderRef.current) {
        sliderRef.current.style.animationPlayState = 'running';
        sliderRef.current.style.webkitAnimationPlayState = 'running';
      }
      
      // Force repaint again after a slight delay
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.opacity = '0.99';
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.style.opacity = '1';
            }
          }, 50);
        }
      }, 100);
    }, 50);
  }, [isIOS, isIPhone15]);

  // We need only one sequence with AND MORE... at the end
  // The CSS animation will handle the looping
  const sliderItems = [
    ...assets,
    "more-text" // Special marker for the "AND MORE..." text
  ];

  return (
    <div className="image-slider-container">
      <div ref={sliderRef} className="image-slider">
        {/* First copy of sequence, starting with logos */}
        {sliderItems.map((item, index) => (
          item === "more-text" ? (
            <span key={`more-text-1`} className="slider-more-text">AND MORE...</span>
          ) : (
            <img 
              key={`slider-1-${index}`}
              src={item} 
              alt={`Slider asset ${index + 1}`} 
              className="slider-image"
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
            />
          )
        ))}
      </div>
    </div>
  );
};

export default ImageSlider; 