import React, { useState, useEffect, useRef } from 'react';
import Transition from '../../components/Transition/Transition';
import gsap from "gsap";
import Footer from '../../components/Footer/Footer';
import './MobileAbout.css';

const MobileAbout = ({ images = [] }) => {
  const contentRef = useRef(null);

  // Add viewport meta tag for proper mobile rendering
  useEffect(() => {
    // Check if viewport meta exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    // If not, create one
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.getElementsByTagName('head')[0].appendChild(viewportMeta);
    }
    
    // Set content attribute with width=device-width
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }, []);

  // Animation for page content
  useEffect(() => {
    if (contentRef.current) {
      try {
        // Force layout recalculation before animation
        document.body.offsetHeight;
        
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power2.out",
            onComplete: () => {
              // Add a class to the body to indicate the page is loaded
              document.body.classList.add('about-page-loaded');
            }
          }
        );
      } catch (error) {
        console.error("Animation error:", error);
        // Still mark as loaded even if animation fails
        document.body.classList.add('about-page-loaded');
      }
    }
  }, []);

  // Ensure proper page setup for direct navigation
  useEffect(() => {
    // Set a proper document title
    document.title = "About Us | VZBL";
    
    // Force scrolling to the top
    window.scrollTo(0, 0);
    
    // Add class to body for page-specific styling
    document.body.classList.add('about-page-active');
    
    return () => {
      // Clean up class when component unmounts
      document.body.classList.remove('about-page-active');
      document.body.classList.remove('about-page-loaded');
    };
  }, []);

  // Fallback image
  const defaultImage = "/about/1.webp";
  
  // Helper function to get image path
  const getImage = (index) => {
    return `/about/${index + 1}.webp`;
  };

  // Handle image errors
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <div className="mobile-about dark-theme">
      <div className="mobile-about-content" ref={contentRef}>
        {/* Header with logo */}
        <div className="mobile-header">
         
        </div>
        
        {/* About The Hand Section */}
        <section className="section about-hand-section">
          <div className="call-us-visible-container">
            <div className="call-us-visible-bg">
              <img src="/about/1.webp" alt="Background" className="bg-image" onError={handleImageError} />
            </div>
            <h1 className="call-us-visible-title">
              CALL US<br />VISIBLE<span className="asterisk">*</span>
            </h1>
            <p className="call-us-visible-subtitle">(VIZ.Ə.BƏL)</p>
          </div>
          
          <div className="content-block left-aligned">
            <p className="body-text">
              VZBL IS ALL ABOUT BEING SEEN. IT'S THE FREQUENCY AT WHICH YOUR BRAND SHOWS UP, WHETHER IN SEARCH RESULTS, ON SOCIAL MEDIA, THROUGH EMAIL, OR ACROSS OTHER MARKETING CHANNELS. IT'S ABOUT MAKING YOUR BRAND IMPOSSIBLE TO IGNORE, GRABBING ATTENTION, AND BUILDING AN IDENTITY THAT STICKS.
            </p>
          </div>
          
          <div className="section-title hand-title">
            <h2 className="heading-text">ABOUT</h2>
            <h2 className="heading-text script">The</h2>
            <h2 className="heading-text">HAND</h2>
          </div>
          
          <div className="about-hand-container">
            <div className="about-hand-bg">
              <img src="/about/4.webp" alt="Background" className="about-hand-bg-image" onError={handleImageError} />
            </div>
          </div>
          
          <div className="content-block hand-content">
            <p className="body-text">
            THE HAND IS MORE THAN A SYMBOL, IT PROMISES STRENGTH, CREATIVITY, AND UNITY. IT STANDS FOR OPENNESS AND THE ABILITY TO TRANSFORM IDEAS INTO ACTION. IT REFLECTS WHO    
  WE ARE AND WHAT WE STAND FOR

            </p>
          </div>
        </section>
        
        {/* Since 2017 Section */}
        <section className="section since-section">
          <div className="since-container">
            <h3 className="subheading">SINCE 2017</h3>
            <p className="body-text centered">
            A CREATIVE AGENCY BUILT TO DEFY
THE ORDINARY.

FROM BRANDING TO MEDIA PRODUCTION, WE DELIVER WORK THAT REVEALS THE UNSEEN.

OUR APPROACH IS SIMPLE: THINK BOLD, CREATE SMART, AND OWN THE SPOTLIGHT WITH EVERY PROJECT.
            </p>
          </div>
        </section>
        
        {/* The Team Section */}
        <section className="section team-section">
          <div className="section-title right-aligned">
            <h2 className="heading-text script">The</h2>
            <h2 className="heading-text">VISIONARY ////////MIND</h2>
          </div>
          
          <div className="team-gallery">
            <div className="team-image-box">
              <img src={getImage(7)} alt="VZBL Team" onError={handleImageError} />
            </div>
            <div className="team-image-box">
              <img src={getImage(8)} alt="VZBL Team" onError={handleImageError} />
            </div>
            <div className="team-image-box">
              <img src={getImage(9)} alt="VZBL Team" onError={handleImageError} />
            </div>
            <div className="team-image-box">
              <img src={getImage(10)} alt="VZBL Team" onError={handleImageError} />
            </div>
            <div className="team-image-box">
              <img src={getImage(11)} alt="VZBL Team" onError={handleImageError} />
            </div>
            <div className="team-image-box">
              <img src={getImage(12)} alt="VZBL Team" onError={handleImageError} />
            </div>
          </div>
        </section>
        
        {/* About The Founder Section */}
        <section className="section founder-section">
          <div className="section-title wide centered">
            <h2 className="heading-text">ABOUT</h2>
            <h2 className="heading-text script">The</h2>
            <h2 className="heading-text">FOUNDER</h2>
          </div>
          
          <div className="content-block centered-text">
            <p className="body-text centered">
            AHMED'S CURIOSITY IS HIS GREATEST STRENGTH. IT PUSHES HIM TO EXPLORE EVERY BRAND'S STORY AND UNCOVER WHAT OTHERS OFTEN OVERLOOK. HE LOOKS BEYOND THE SURFACE, FINDING HIDDEN INSIGHTS AND UNSPOKEN TRUTHS THAT HELP BRANDS CONNECT ON A DEEPER LEVEL. IT'S HIS ABILITY TO SEE WHAT'S UNSEEN THAT SETS HIM APART AND DRIVES HIS PASSION FOR MAKING BRANDS THAT TRULY STAND OUT.
            </p>
          </div>
          
          <div className="team-image-box founder-team-image centered-image">
            <img src={getImage(14)} alt="VZBL Founder" onError={handleImageError} />
          </div>
        </section>
        
        {/* Use the existing Footer component */}
        <Footer />
      </div>
    </div>
  );
};

// Export with Transition HOC with explicit settings
export default Transition(MobileAbout, {
  unmountDelay: 800,
  mountDelay: 300,
  appear: true,
}); 