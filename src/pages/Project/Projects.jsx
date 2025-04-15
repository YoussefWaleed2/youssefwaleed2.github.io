import React, { useEffect, useRef } from "react";
import "./Projects.css";
import Transition from "../../components/Transition/Transition";
import gsap from "gsap";

const Projects = () => {
  const titleRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const imageRef = useRef(null);
  const counterRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    // Set initial states
    gsap.set([titleRef.current, prevBtnRef.current, nextBtnRef.current, imageRef.current, counterRef.current, previewRef.current], {
      opacity: 0
    });

    // Set initial transforms
    gsap.set(titleRef.current, { y: -50, visibility: "visible" });
    gsap.set([prevBtnRef.current, nextBtnRef.current], { x: -50, visibility: "visible" });
    gsap.set(imageRef.current, { y: 200, opacity: 0, visibility: "visible" });
    gsap.set(counterRef.current, { y: 30, visibility: "visible" });
    gsap.set(previewRef.current, { scale: 0, visibility: "visible" });

    const tl = gsap.timeline({
      defaults: { 
        ease: "power3.out",
        duration: 1
      }
    });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.2
    })
    .to([prevBtnRef.current, nextBtnRef.current], {
      opacity: 1,
      x: 0,
      duration: 0.8,
      stagger: 0.2
    }, "-=0.5")
    .to(imageRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power4.out"
    }, "-=0.4")
    .to(counterRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, "-=0.6")
    .to(previewRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.4");

  }, []);

  return (
    <div className="project-container">
      <h1 className="project-title" ref={titleRef}>BRANDING</h1>
      
      <div className="project-content">
        <div className="project-navigation">
          <button className="nav-button prev" ref={prevBtnRef}>
            <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
              <path d="M36.9998 67.8337C54.0286 67.8337 67.8332 54.0291 67.8332 37.0003C67.8332 19.9715 54.0286 6.16699 36.9998 6.16699C19.9711 6.16699 6.1665 19.9715 6.1665 37.0003C6.1665 54.0291 19.9711 67.8337 36.9998 67.8337Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M26.1157 33.1152L36.9999 43.9686L47.8841 33.1152" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button className="nav-button next" ref={nextBtnRef}>
            <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
              <path d="M36.9998 67.8337C54.0286 67.8337 67.8332 54.0291 67.8332 37.0003C67.8332 19.9715 54.0286 6.16699 36.9998 6.16699C19.9711 6.16699 6.1665 19.9715 6.1665 37.0003C6.1665 54.0291 19.9711 67.8337 36.9998 67.8337Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M26.1157 33.1152L36.9999 43.9686L47.8841 33.1152" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="project-image" ref={imageRef}>
          <img src="/project/Service-img-1.png" alt="Branding project" />
        </div>
        
        <div className="project-counter" ref={counterRef}>
          <span>1</span>
          <span>/</span>
          <span>3</span>
          <div className="project-preview" ref={previewRef}>
            <button className="nav-button preview-button">
              <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.9998 67.8337C54.0286 67.8337 67.8332 54.0291 67.8332 37.0003C67.8332 19.9715 54.0286 6.16699 36.9998 6.16699C19.9711 6.16699 6.1665 19.9715 6.1665 37.0003C6.1665 54.0291 19.9711 67.8337 36.9998 67.8337Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M37 47.27C40.53 47.27 43.82 45.19 46.11 41.59C47.01 40.18 47.01 37.81 46.11 36.4C43.82 32.8 40.53 30.72 37 30.72C33.47 30.72 30.18 32.8 27.89 36.4C26.99 37.81 26.99 40.18 27.89 41.59C30.18 45.19 33.47 47.27 37 47.27Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M40.58 39C40.58 40.98 38.98 42.58 37 42.58C35.02 42.58 33.42 40.98 33.42 39C33.42 37.02 35.02 35.42 37 35.42C38.98 35.42 40.58 37.02 40.58 39Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transition(Projects);
