import React, { useEffect, useRef, useState } from "react";
import "./Projects.css";
import Transition from "../../components/Transition/Transition";
import { useNavigate } from "react-router-dom";
import projectsData from "../../data/projectsData.json";
import { handleOverlay } from "./../../utils/overlayManager";
import ReactLenis from "lenis/react";
import ImageSlider from "../../components/ImageSlider/ImageSlider";

// Debug log to check if this file is being loaded correctly
console.log("Projects.jsx loaded, projectsData:", Object.keys(projectsData));

const Projects = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const videoRef = useRef(null);

  const services = [
    "BRANDING",
    "MARKETING",
    "ADVERTISEMENT"
  ];

  const serviceRoutes = [
    "/all-projects/branding",
    "/all-projects/marketing",
    "/all-projects/advertisement"
  ];

  // Assets for the slider
  const sliderAssets = [
    "/project/Asset 1.webp",
    "/project/Asset 3.webp", 
    "/project/Asset 4.webp",
    "/project/Asset 5.webp",
    "/project/Asset 6.webp",
    "/project/Asset 7.webp",
    "/project/Asset 8.webp",
    "/project/Asset 9.webp",
    "/project/Asset 10.webp",
    "/project/Asset 11.webp",
    "/project/Asset 12.webp",
    "/project/Asset 13.webp"
  ];

  const handleServiceClick = (index) => {
    navigate(serviceRoutes[index]);
  };

  useEffect(() => {
    document.title = "Projects | VZBL";
  }, []);
  
  // Handle overlay on mount and unmount
  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  return (
    <ReactLenis root options={{ duration: 1.2 }}>
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
      <div className="project-container">
        <div className="service-selector-row">
          <div style={{position: 'relative'}}>
            <div className="service-selector-left">
              <span className="section-title">OUR PROJECTS</span>
              <span 
                className="section-arrow"
                style={{
                  position: 'relative',
                  top: hoveredIndex === 2 ? '3rem' : 
                       hoveredIndex === 1 ? null : 
                       hoveredIndex === 0 ? '-3rem' : 
                       '0rem',
                  transition: 'top 0.35s cubic-bezier(0.4,1.6,0.4,1)'
                }}
              >&gt;</span>
            </div>
          </div>
          <div className="service-selector-right">
            {services.map((service, index) => {
              let style = { zIndex: hoveredIndex === index ? 2 : 1 };
              if (hoveredIndex !== null) {
                if (index < hoveredIndex) {
                  style.transform = 'perspective(400px) rotateX(-40deg) translateY(-28px) scale(0.98) translateZ(-40px)';
                  style.opacity = 0.3;
                  style.zIndex = 1;
                } else if (index > hoveredIndex) {
                  style.transform = 'perspective(400px) rotateX(40deg) translateY(28px) scale(0.98) translateZ(-40px)';
                  style.opacity = 0.3;
                  style.zIndex = 1;
                } else {
                  style.transform = 'perspective(400px) rotateX(0deg) scale(1.08)';
                  style.opacity = 1;
                  style.zIndex = 2;
                }
              }
              return (
                <div
                  key={index}
                  className={`service-list-item${index === hoveredIndex ? ' active' : ''}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleServiceClick(index)}
                  style={{...style, cursor: 'pointer'}}
                >
                  {service}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Use the ImageSlider component */}
      <ImageSlider assets={sliderAssets} />
    </ReactLenis>
  );
};

export default Transition(Projects);
