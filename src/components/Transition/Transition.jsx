import React, { useRef } from 'react';
import { usePageTransition } from '../../hooks/usePageTransition';
import './Transition.css';

const Transition = (WrappedComponent) => {
  return function WithTransition(props) {
    const pageRef = useRef(null);
    
    // Use our custom hook for page transitions
    usePageTransition(pageRef);

    return (
      <div className="transition-wrapper">
        <div className="page-container" ref={pageRef}>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};

export default Transition;
