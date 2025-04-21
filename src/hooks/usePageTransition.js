import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      x: '100vw',
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: '-100vw',
    }
  };

  // Define the transition properties
  const pageTransition = {
    type: 'tween',
    ease: [0.76, 0, 0.24, 1],
    duration: 1
  };

  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        const target = link.getAttribute('href');
        
        // Don't navigate if we're already on the target page
        if (location.pathname !== target) {
          navigate(target);
        }
      }
    };

    // Add click listener for internal links
    document.addEventListener('click', handleLinkClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [navigate, location]);

  return { pageVariants, pageTransition };
}; 