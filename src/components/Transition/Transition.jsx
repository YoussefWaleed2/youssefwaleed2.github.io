import React from 'react';
import { motion } from 'framer-motion';
import { usePageTransition } from '../../hooks/usePageTransition';
import './Transition.css';

const Transition = (WrappedComponent) => {
  return function WithTransition(props) {
    // Use our custom hook for page transitions
    const { pageVariants, pageTransition } = usePageTransition();

    return (
      <motion.div 
        className="transition-wrapper"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className="page-container">
          <WrappedComponent {...props} />
        </div>
      </motion.div>
    );
  };
};

export default Transition;
