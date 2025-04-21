import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import Transition from '../../components/Transition/Transition';
import './About.css';

const About = () => {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const images = Array.from({ length: 13 }, (_, i) => `/about/${i + 1}.webp`);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set initial container width
    const totalWidth = window.innerWidth * images.length;
    containerRef.current.style.width = `${totalWidth}px`;

    // Handle resize
    const handleResize = () => {
      const newWidth = window.innerWidth * images.length;
      containerRef.current.style.width = `${newWidth}px`;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [images.length]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - wrapperRef.current.offsetLeft);
    setScrollLeft(wrapperRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - wrapperRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    wrapperRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    wrapperRef.current.scrollLeft += e.deltaY;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - wrapperRef.current.offsetLeft);
    setScrollLeft(wrapperRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - wrapperRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    wrapperRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className={`about-page ${isReady ? 'is-ready' : ''}`}>
      <div 
        ref={wrapperRef}
        className="horizontal-scroll-wrapper"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        <div ref={containerRef} className="about-container">
          {images.map((src, index) => (
            <section key={index} className="about-section">
              <img 
                src={src} 
                alt={`About section ${index + 1}`} 
                className="background-image"
              />
              <div className="about-content">
                {index === 0 && (
                  <div className="about-content">
                    <h1 className="main-title">
                      CALL US<br />VISIBLE<span className="asterisk">*</span>
                    </h1>
                    <p className="subtitle">(VIZ.Ə.BƏL)</p>
                    <p className="description">
                      VZBL IS ALL ABOUT BEING SEEN. IT'S THE FREQUENCY AT WHICH YOUR BRAND SHOWS UP, WHETHER IN SEARCH RESULTS, ON SOCIAL MEDIA, THROUGH EMAIL, OR ACROSS OTHER MARKETING CHANNELS. IT'S ABOUT MAKING YOUR BRAND IMPOSSIBLE TO IGNORE, GRABBING ATTENTION, AND BUILDING AN IDENTITY THAT STICKS.
                    </p>
                  </div>
                )}
                {index === 1 && (
                  <div className="about-split-layout">
                    <div className="about-left">
                      <h2 className="about-heading">/ ABOUT</h2>
                    </div>
                    <div className="about-text-container">
                      <p>A CREATIVE AGENCY BUILT TO DEFY
THE ORDINARY.</p>
                      <p>FROM BRANDING TO MEDIA
PRODUCTION, WE DELIVER WORK THAT
REVEALS THE UNSEEN.</p>
                      <p>OUR APPROACH IS SIMPLE: THINK
BOLD, CREATE SMART, AND OWN THE
SPOTLIGHT WITH EVERY PROJECT.</p>
                    </div>
                    <div className="about-right">
                      <h2 className="about-heading">US /</h2>
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transition(About);
