import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

export const usePageTransition = (pageRef) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLinkClick = async (e) => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault();
        const target = link.getAttribute('href');
        
        // Create a new div for the incoming page
        const newPage = document.createElement('div');
        newPage.className = 'page-container incoming';
        pageRef.current.parentNode.appendChild(newPage);

        // Set initial positions
        gsap.set(newPage, {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          xPercent: 100
        });

        // Create the transition timeline
        const tl = gsap.timeline({
          onComplete: () => {
            navigate(target);
            newPage.remove();
          }
        });

        // Animate both pages simultaneously
        tl.to(pageRef.current, {
          xPercent: -100,
          duration: 1,
          ease: "power2.inOut"
        })
        .to(newPage, {
          xPercent: 0,
          duration: 1,
          ease: "power2.inOut"
        }, "<");
      }
    };

    // Add click listener for internal links
    document.addEventListener('click', handleLinkClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [navigate, pageRef]);

  // Handle entering animation when location changes
  useEffect(() => {
    gsap.fromTo(pageRef.current,
      {
        xPercent: 100,
      },
      {
        xPercent: 0,
        duration: 1,
        ease: "power2.inOut"
      }
    );
  }, [location.pathname]);
}; 