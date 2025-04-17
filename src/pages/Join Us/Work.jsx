import React, { useState, useRef, useEffect } from "react";
import "./Work.css";
import Transition from "../../components/Transition/Transition";
import JoinUsForm from "../../components/JoinUsForm/JoinUsForm";
import Footer from "../../components/Footer/Footer";
import gsap from "gsap";
import ReactLenis from "lenis/react";

const Work = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });

      // Set constant blur
      gsap.set(videoRef.current, {
        filter: "blur(100px)",
        opacity: 0
      });

      // Only animate the opacity
      gsap.to(videoRef.current, {
        opacity: 0.3,
        duration: 1.5,
        delay: 0.5,
        ease: "power2.out"
      });
    }
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

  const positions = [
    {
      title: "Account Manager",
      description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
    },
    {
      title: "Graphic Designer",
      description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
    },
    {
      title: "Graphic Designer",
      description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
    },
    {
      title: "Graphic Designer",
      description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
    }
  ];

  const handleApplyClick = (jobTitle) => {
    setSelectedJob(jobTitle);
    setIsFormOpen(true);
  };

  return (
    <ReactLenis root>
      <div className="page work">
        <div className="video-background">
          <video
            ref={videoRef}
            className="background-video"
            muted
            loop
            playsInline
            src="/home/vid.webm"
          />
        </div>
        
        <div className="work-content">
          <div className="work-header">
            <h1 className="join-title">JOIN</h1>
            <div className="join-subtitle">
              <span className="the">The</span>
              <span className="bold-creatives">BOLD CREATIVES</span>
            </div>
          </div>

          <div className="positions-grid">
            {positions.map((position, index) => (
              <div className="position-card" key={index}>
                <div className="position-image">
                  <div className="image-placeholder"></div>
                </div>
                <div className="position-content">
                  <span className="join-label">Join us now</span>
                  <h2 className="position-title">{position.title}</h2>
                  <p className="position-description">{position.description}</p>
                  <button 
                    className="apply-button"
                    onClick={() => handleApplyClick(position.title)}
                  >
                    APPLY NOW
                  </button>
                </div>
              </div>
            ))}
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
