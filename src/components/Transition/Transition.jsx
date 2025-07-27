import React from 'react';
import { motion as _Motion } from 'framer-motion';
import { usePageTransition } from '../../hooks/usePageTransition';
import './Transition.css';
import gsap from 'gsap';
import { useLocation, useNavigate } from 'react-router-dom';

// Properly structured HOC
// eslint-disable-next-line no-unused-vars
const Transition = (_WrappedComponent) => {
  // This returns a proper function component where hooks can be used
  const TransitionComponent = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isEntering = React.useRef(true);
    const _videoRef = React.useRef(null);
    const { pageVariants: _pageVariants, pageTransition } = usePageTransition();
    const navigationInProgress = React.useRef(false);

    // Dynamic variants based on current page and destination
    const getDynamicVariants = () => {
      const isProjects = location.pathname === '/projects';
      const isHome = location.pathname === '/' || location.pathname === '';
      
      // Special transitions for home page
      if (isHome) {
        return {
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: 1,
            transition: {
              duration: 0.7,
              ease: "easeInOut"
            }
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: "easeInOut"
            }
          }
        };
      }
      
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

    React.useEffect(() => {
      const timeline = gsap.timeline();

      // Special handling for services page
      if (location.pathname === '/services') {
        // Ensure navbar is visible when navigating to Services page
        const nav = document.querySelector('nav');
        if (nav) {
          nav.classList.add('nav-reveal');
          nav.classList.add('visible');
        }
      }

      // Special handling for home page transitions
      if ((location.pathname === '/' || location.pathname === '') && isEntering.current) {
        // Let the Home component handle its own video transitions
        // This avoids conflicts between splash screen completion and navigation
      }

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

      // Reset navigation status when location changes
      navigationInProgress.current = false;

      // Cleanup function
      return () => {
        timeline.kill();
        isEntering.current = true;
      };
    }, [location]);

    // Handle navigation
    React.useEffect(() => {
      const handleClick = (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href')?.startsWith('/')) {
          e.preventDefault();
          
          // Check if it's a navigation from a single project page in menu
          const isFromSingleProject = location.pathname.includes('/projects/') || location.pathname.includes('/project/');
          const isFromMobileMenu = e.target.closest('.menu-overlay') !== null;
          
          // If navigation is already in progress (handled by MobileMenu), don't interfere
          if (isFromSingleProject && isFromMobileMenu && !navigationInProgress.current) {
            navigationInProgress.current = true;
            
            // Don't navigate here - let the MobileMenu handleNavigation function handle it
            return;
          }
          
          // Normal navigation with animation
          const path = link.getAttribute('href');
          navigate(path);
        }
      };

      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, [navigate, location]);

    return (
      <_Motion.div
        className={`transition-wrapper ${location.pathname === '/' ? 'home-transition' : ''}`}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={pageTransition}
      >
        <_WrappedComponent {...props} />
      </_Motion.div>
    );
  };

  return TransitionComponent;
};

export default Transition;
