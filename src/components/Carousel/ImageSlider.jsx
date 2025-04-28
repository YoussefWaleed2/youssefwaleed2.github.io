import React from 'react';
import './ImageSlider.css';

const ImageSlider = ({ assets }) => {
  // Duplicate the assets for seamless looping
  const sliderAssetsDouble = [...assets, ...assets];

  return (
    <div className="image-slider-container">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div className="image-slider">
          {sliderAssetsDouble.map((asset, index) => (
            <img 
              key={`slider-${index}`}
              src={asset} 
              alt={`Slider asset ${index + 1}`} 
              className="slider-image"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider; 