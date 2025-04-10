import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

export const usePageTransition = (pageRef) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault();
        const target = link.getAttribute('href');
        
        // Create exit animation
        const tl = gsap.timeline({
          onComplete: () => navigate(target)
        });

        tl.to(pageRef.current, {
          xPercent: -100,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut"
        });
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
    const tl = gsap.timeline();

    tl.fromTo(pageRef.current,
      {
        xPercent: 100,
      },
      {
        xPercent: 0,
        duration: 0.8,
        ease: "power2.inOut"
      }
    );
  }, [location.pathname, pageRef]);
}; 