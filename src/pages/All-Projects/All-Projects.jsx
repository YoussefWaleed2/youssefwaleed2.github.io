import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./All-Projects.css";
import Footer from "../../components/Footer/Footer";
import Transition from "../../components/Transition/Transition";
import ReactLenis from "lenis/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

const AllProjects = () => {
  const { category } = useParams();
  const [projects, setProjects] = useState([]);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // Get projects data from sessionStorage
    const storedProjects = sessionStorage.getItem('currentProjects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }

    const customEase = CustomEase.create("custom", ".87,0,.13,1");

    // Set initial states
    gsap.set([".all-projects-container", "footer"], {
      opacity: 0
    });

    gsap.set(".all-projects-container", {
      clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
      scale: 0,
      rotation: 25,
    });

    // Animate the video background
    if (videoRef.current) {
      gsap.to(videoRef.current, {
        filter: "blur(150px)",
        duration: 1,
        ease: "power2.inOut"
      });
    }

    // Create entrance animation sequence
    
    const tl = gsap.timeline();

    // First clip-path animation
    tl.to(".all-projects-container", {
      clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)",
      duration: 0,
      ease: customEase,
    })
    // Second clip-path animation
    .to(".all-projects-container", {
      clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
      duration: 0,
      ease: customEase
    })
    // Final reveal animation
    .to(".all-projects-container", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 1.5,
      ease: customEase,
      onStart: () => {
        // Animate title characters
        gsap.to(".category-title .char", {
          y: 0,
          opacity: 1,
          duration: 1.8,
          stagger: 0.05,
          delay: 0.5,
          ease: customEase,
        });
      },onComplete: () =>{
        gsap.to("footer", {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out"
        })
      }
    })
    // Animate project items
    .from(".project-grid .project-item", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5")

  }, [category]);

  // Split title into characters for animation
  const renderTitle = (title) => {
    return title.split("").map((char, index) => (
      <span key={index} className="char" style={{ opacity: 0, transform: "translateY(100%)" }}>
        {char}
      </span>
    ));
  };

  const renderMedia = (project) => {
    if (project.mediaType === 'video') {
      // Log the exact path being used
      console.log('Attempting to load video from:', project.media);
      
      // Test if the file exists
      // fetch(project.media)
      //   .then(response => {
      //     console.log('Video file response:', response.status);
      //     if (!response.ok) {
      //       throw new Error(`HTTP error! status: ${response.status}`);
      //     }
      //   })
      //   .catch(error => console.error('Error checking video file:', error));

      return (
        <video
          className="project-media"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={(e) => {
            console.error('Video loading error:', {
              error: e.target.error,
              src: project.media,
              networkState: e.target.networkState,
              readyState: e.target.readyState
            });
          }}
        >
          <source src={project.media} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <img 
        className="project-media"
        src={project.media} 
        alt={project.title} 
      />
    );
  };

  return (
    <>
      <ReactLenis root>
        <div className="all-projects-container" ref={containerRef}>
          <div className="video-background">
            <video
              ref={videoRef}
              className="project-video"
              autoPlay
              muted
              loop
              playsInline
              src="/home/vid.webm"
            />
          </div>
          <h1 className="category-title" ref={titleRef}>
            {renderTitle(category.replace("-", " ").toUpperCase())}
          </h1>
          
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
                  {renderMedia(project)}
                </div>
                <div className="project-info">
                  <h3>{project.title.toUpperCase()}</h3>
                  <p>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </ReactLenis>
    </>
  );
};

export default AllProjects; 