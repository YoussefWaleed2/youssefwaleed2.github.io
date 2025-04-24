import React, { useState, useEffect, useRef } from 'react';
import Transition from '../../components/Transition/Transition';
import gsap from "gsap";
import Footer from '../../components/Footer/Footer';
import './MobileAbout.css';

const MobileAbout = ({ images = [] }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const contentRef = useRef(null);

  // Preload images
  useEffect(() => {
    if (!Array.isArray(images) || images.length === 0) {
      setIsLoaded(true);
      return;
    }

    const imagePromises = images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setIsLoaded(true);
      })
      .catch(error => {
        console.error("Error loading images:", error);
        setIsLoaded(true); // Continue anyway
      });
  }, [images]);

  // Animation for page content
  useEffect(() => {
    if (isLoaded && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [isLoaded]);

  // Fallback image
  const defaultImage = "/about/1.webp";
  
  // Helper function to safely get an image
  const getImage = (index) => {
    if (!Array.isArray(images) || images.length === 0) return defaultImage;
    return images[index] || images[0] || defaultImage;
  };

  return (
    <div className="mobile-about dark-theme">
      {isLoaded ? (
        <div className="mobile-about-content" ref={contentRef}>
          {/* Header with logo */}
          <div className="mobile-header">
           
          </div>
          
          {/* About The Hand Section */}
          <section className="section about-hand-section">
            <div className="grid-gallery top-gallery">
              <div className="image-box">
                <img src={getImage(0)} alt="About VZBL" />
              </div>
              <div className="image-box">
                <img src={getImage(1)} alt="About VZBL" />
              </div>
              <div className="image-box">
                <img src={getImage(2)} alt="About VZBL" />
              </div>
              <div className="image-box tall">
                <img src={getImage(3)} alt="About VZBL" />
              </div>
              <div className="image-box">
                <img src={getImage(4)} alt="About VZBL" />
              </div>
            </div>
            
            <div className="content-block left-aligned">
              <p className="body-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam malesuada nibh auctor lacinia sit amet. Morbi vulputate libero magna. Duis vel felis consequat, viverra sem a, blandit ex imperdiet vehicula quis malesuad alesce blandit odio.
              </p>
            </div>
            
            <div className="section-title">
              <h2 className="heading-text">ABOUT</h2>
              <h2 className="heading-text script">The</h2>
              <h2 className="heading-text">HAND</h2>
            </div>
            
            <div className="content-block right-aligned">
              <p className="body-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam malesuada nibh auctor lacinia sit amet. Morbi vulputate libero magna. Duis vel felis consequat, viverra sem a, blandit ex. Id qui anim est voluptate veniam, quid nostrud exercit ullamce dolore magna aliqua.
              </p>
            </div>
          </section>
          
          {/* Since 2017 Section */}
          <section className="section since-section">
            <div className="since-container">
              <h3 className="subheading">SINCE 2017</h3>
              <p className="body-text centered">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam malesuada nibh auctor lacinia sit amet. Morbi vulputate libero magna. Duis vel felis consequat, viverra sem a, blandit ex. Ut enim anim quis nostrud, quid nostrud exercit ullamc commodo anim sit.
              </p>
            </div>
          </section>
          
          {/* The Brand Section */}
          <section className="section brand-section">
            <div className="content-block left-aligned">
              <p className="body-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam malesuada nibh auctor lacinia sit amet. Morbi vulputate libero magna. Duis vel felis consequat, viverra sem a, blandit ex. Id qui anim est voluptate veniam, quid nostrud exercit ullamce dolore magna aliqua.
              </p>
            </div>
            
            <div className="section-title right-aligned">
              <h2 className="heading-text script">The</h2>
              <h2 className="heading-text">BRAND</h2>
            </div>
            
            <div className="grid-gallery brand-gallery">
              <div className="image-box">
                <img src={getImage(5)} alt="VZBL Brand" />
              </div>
              <div className="image-box">
                <img src={getImage(6)} alt="VZBL Brand" />
              </div>
              <div className="image-box">
                <img src={getImage(7)} alt="VZBL Brand" />
              </div>
              <div className="image-box">
                <img src={getImage(8)} alt="VZBL Brand" />
              </div>
            </div>
          </section>
          
          {/* About The Founder Section */}
          <section className="section founder-section">
            <div className="section-title wide">
              <h2 className="heading-text">ABOUT</h2>
              <h2 className="heading-text script">The</h2>
              <h2 className="heading-text">FOUNDER</h2>
            </div>
            
            <div className="founder-content">
              <div className="content-block left-aligned">
                <p className="body-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam malesuada nibh auctor lacinia sit amet. Morbi vulputate libero magna. Duis vel felis consequat, viverra sem a, blandit ex imperdiet. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              
              <div className="founder-image">
                <img src={getImage(9)} alt="VZBL Founder" />
              </div>
            </div>
          </section>
          
          {/* Use the existing Footer component */}
          <Footer />
        </div>
      ) : (
        <div className="loading-screen">
          <div className="logo-loader">VZBL</div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transition(MobileAbout); 