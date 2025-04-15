import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./All-Projects.css";
import Transition from "../../components/Transition/Transition";
import gsap from "gsap";

const AllProjects = () => {
  const { category } = useParams();
  const [projects, setProjects] = useState([]);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Get projects data from sessionStorage
    const storedProjects = sessionStorage.getItem('currentProjects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }

    // Animation for page elements
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
        duration: 0.8
      }
    });

    // Animate the video background
    if (videoRef.current) {
      gsap.to(videoRef.current, {
        filter: "blur(100px)",
        duration: 1,
        ease: "power2.inOut"
      });
    }

    tl.from(".category-title", {
      y: 30,
      opacity: 0,
      duration: 1
    })
    .from(".project-grid .project-item", {
      y: 50,
      opacity: 0,
      stagger: 0.1
    }, "-=0.5");

  }, [category]);

  // Function to format the project number
  const formatProjectNumber = (index) => {
    return (index + 1).toString().padStart(2, '0');
  };

  return (
    <>
      <div className="video-background">
        <video
          ref={videoRef}
          className="project-video"
          autoPlay
          muted
          loop
          playsInline
          src="/home/vid.mp4"
        />
      </div>
      <div className="all-projects-container" ref={containerRef}>
        <h1 className="category-title">{category.replace("-", " ").toUpperCase()}</h1>
        
        <div className="project-grid">
          {projects.map((project, index) => (
            <div 
              className="project-item" 
              key={index}
              style={{
                '--delay': `${index * 0.1}s`
              }}
            >
              <div className="project-video-container">
                <img src={project.image} alt={project.title} />
                <div className="play-button">
                  <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36.9998 67.8337C54.0286 67.8337 67.8332 54.0291 67.8332 37.0003C67.8332 19.9715 54.0286 6.16699 36.9998 6.16699C19.9711 6.16699 6.1665 19.9715 6.1665 37.0003C6.1665 54.0291 19.9711 67.8337 36.9998 67.8337Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M30 27L44 37L30 47V27Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="project-info">
                <div className="project-number">{formatProjectNumber(index)}</div>
                <h3>{project.title.toUpperCase()}</h3>
                <p>{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Transition(AllProjects); 