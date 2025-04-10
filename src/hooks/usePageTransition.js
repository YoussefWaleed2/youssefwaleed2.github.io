import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pageVariants = {
    initial: {
      x: '100vw',
    },
    animate: {
      x: 0,
    },
    exit: {
      x: '-100vw',
    }
  };

  // Define the transition properties
  const pageTransition = {
    ease: 'easeInOut',
    type: 'tween',
    duration: 0.5
  };

  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        const target = link.getAttribute('href');
        navigate(target);
      }
    };

    // Add click listener for internal links
    document.addEventListener('click', handleLinkClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [navigate]);

  return { pageVariants, pageTransition };
}; 