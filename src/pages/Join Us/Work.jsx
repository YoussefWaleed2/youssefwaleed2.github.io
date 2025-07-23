import React, { useState, useRef, useEffect } from "react";
import "./Work.css";
import Transition from "../../components/Transition/Transition";
import JoinUsForm from "../../components/JoinUsForm/JoinUsForm";
import Footer from "../../components/Footer/Footer";
import gsap from "gsap";
import ReactLenis from "lenis/react";
import { handleOverlay } from "../../utils/overlayManager";

const Work = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);

  // Set page title
  useEffect(() => {
    document.title = "Join Us | VZBL";
  }, []);

  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  useEffect(() => {
    // Create entrance animation timeline
    const tl = gsap.timeline();

    // Animate the video background
    if (videoRef.current) {
      tl.to(videoRef.current, {
        filter: "blur(100px)",
        duration: 1,
        ease: "power2.inOut"
      }, 0);
    }

    // Set initial states for animated elements
    gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
      opacity: 0,
      y: 50
    });

    // Animate elements in sequence
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, 0.3)
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, 0.5)
    .to(buttonRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, 0.7);

  }, []);

  useEffect(() => {
    // Add or remove form-open class on body when form opens/closes
    if (isFormOpen) {
      document.body.classList.add('form-open');
    } else {
      document.body.classList.remove('form-open');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('form-open');
    };
  }, [isFormOpen]);

  return (
    <ReactLenis root>
      <div className="page work">
        
        <div className="work-content">
          <div className="video-background">
            <video
              ref={videoRef}
              className="background-video"
              autoPlay
              muted
              loop
              playsInline
              src="/home/Desktop Version.webm"
            />
          </div>
          <header className="work-header">
            <h1 ref={titleRef} className="join-title">JOIN</h1>
            <div ref={subtitleRef} className="join-subtitle">
              <span className="the">The</span>
              <span className="bold-creatives">BOLD CREATIVES</span>
            </div>
          </header>

          <div className="join-us-container">
            <button 
              ref={buttonRef}
              className="join-us-button"
              onClick={() => {
                setSelectedJob("");
                setIsFormOpen(true);
              }}
            >
              JOIN US NOW
            </button>
          </div>
        </div>

        <Footer />

        <JoinUsForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)}
          selectedJob={selectedJob}
        />
      </div>
    </ReactLenis>
  );
};

export default Transition(Work);
