import React, { useRef, useEffect } from "react";
import "./Contact.css";
import gsap from "gsap";

import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";

import ReactLenis from "lenis/react";

import Transition from "../../components/Transition/Transition";

const Contact = () => {
  const videoRef = useRef(null);

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
            src="/home/vid.webm"
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
