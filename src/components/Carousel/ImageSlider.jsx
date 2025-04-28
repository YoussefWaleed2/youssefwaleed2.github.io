import React, { useRef } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ assets }) => {
  const sliderRef = useRef(null);

  // We need only one sequence with AND MORE... at the end
  // The CSS animation will handle the looping
  const sliderItems = [
    ...assets,
    "more-text" // Special marker for the "AND MORE..." text
  ];

  return (
    <div className="image-slider-container">
      <div ref={sliderRef} className="image-slider">
        {/* First copy of sequence, starting with logos */}
        {sliderItems.map((item, index) => (
          item === "more-text" ? (
            <span key={`more-text-1`} className="slider-more-text">AND MORE...</span>
          ) : (
            <img 
              key={`slider-1-${index}`}
              src={item} 
              alt={`Slider asset ${index + 1}`} 
              className="slider-image"
            />
          )
        ))}
        
        {/* Second copy of sequence to ensure seamless looping */}
        {sliderItems.map((item, index) => (
          item === "more-text" ? (
            <span key={`more-text-2`} className="slider-more-text">AND MORE...</span>
          ) : (
            <img 
              key={`slider-2-${index}`}
              src={item} 
              alt={`Slider asset ${index + 1}`} 
              className="slider-image"
            />
          )
        ))}
      </div>
    </div>
  );
};

export default ImageSlider; 