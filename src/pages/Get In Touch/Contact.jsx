import React, { useRef, useEffect } from "react";
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

  // Set page title
  useEffect(() => {
    document.title = "Get In Touch | VZBL";
  }, []);

  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  useEffect(() => {
    // Animate the video background
    if (videoRef.current) {
      gsap.to(videoRef.current, {
        filter: "blur(100px)",
        duration: 1,
        ease: "power2.inOut"
      });
    }
  }, []);

  return (
    <ReactLenis root>
      <div className="page contact">
        <div className="video-background">
          <video
            ref={videoRef}
            className="background-video"
            autoPlay
            muted
            loop
            playsInline
              src={CDN_CONFIG.getHomeVideoUrl('desktop')}
          />
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
