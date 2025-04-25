import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePageTransition } from '../../hooks/usePageTransition';
import './Transition.css';
import gsap from 'gsap';
import { useLocation, useNavigate } from 'react-router-dom';

const Transition = (Component) => {
  return () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isEntering = useRef(true);
    const videoRef = useRef(null);
    const { pageVariants, pageTransition } = usePageTransition();

    // Dynamic variants based on current page and destination
    const getDynamicVariants = () => {
      const isProjects = location.pathname === '/projects';
      
      return {
        initial: {
          x: '100vw', // Always start from right
          opacity: isProjects ? 0 : 1, // Projects has special handling
        },
        animate: {
          x: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeInOut"
          }
        },
        exit: {
          x: '-100vw', // Always exit to left
          opacity: isProjects ? 0 : 1,
          transition: {
            duration: 0.5,
            ease: "easeInOut"
          }
        }
      };
    };

    // Get the dynamic variants
    const variants = getDynamicVariants();

    useEffect(() => {
      const timeline = gsap.timeline();

      if (location.pathname === '/projects' && isEntering.current) {
        // If coming from home to projects, transition the video
        const homeVideo = document.querySelector('.home-video');
        if (homeVideo) {
          const projectVideo = document.querySelector('.project-video');
          if (projectVideo) {
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
        }
        isEntering.current = false;
      }

      // Cleanup function
      return () => {
        timeline.kill();
        isEntering.current = true;
      };
    }, [location]);

    // Handle navigation
    useEffect(() => {
      const handleClick = (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href')?.startsWith('/')) {
          e.preventDefault();
          const path = link.getAttribute('href');
          navigate(path);
        }
      };

      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, [navigate]);

    return (
      <motion.div
        className="transition-wrapper"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={pageTransition}
      >
        <Component />
      </motion.div>
    );
  };
};

export default Transition;
