import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePageTransition } from '../../hooks/usePageTransition';
import './Transition.css';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

const Transition = (Component) => {
  return () => {
    const location = useLocation();
    const isEntering = useRef(true);
    const videoRef = useRef(null);
    const { pageVariants, pageTransition } = usePageTransition();

    // Custom variants for Projects page
    const customVariants = {
      initial: {
        x: location.pathname === '/projects' ? 0 : '100vw',
      },
      animate: {
        x: 0,
      },
      exit: {
        x: location.pathname === '/projects' ? 0 : '-100vw',
      }
    };

    useEffect(() => {
      const timeline = gsap.timeline();

      if (location.pathname === '/projects' && isEntering.current) {
        // If coming from home to projects, transition the video
        const homeVideo = document.querySelector('.home-video');
        if (homeVideo) {
          const projectVideo = document.querySelector('.project-video');
          gsap.set(projectVideo, {
            opacity: 0
          });

          timeline
            .to(homeVideo, {
              filter: "blur(10px)",
              duration: 1,
              ease: "power2.inOut"
            })
            .to(projectVideo, {
              opacity: 1,
              duration: 0.5
            }, "-=0.5");
        }
        isEntering.current = false;
      }

      return () => {
        timeline.kill();
      };
    }, [location]);

    return (
      <motion.div
        className="transition-wrapper"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={customVariants}
        transition={pageTransition}
      >
        <Component />
      </motion.div>
    );
  };
};

export default Transition;
