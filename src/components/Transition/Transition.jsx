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
        variants={customVariants}
        transition={pageTransition}
      >
        <Component />
      </motion.div>
    );
  };
};

export default Transition;
