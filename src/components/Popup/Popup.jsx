import React, { useEffect } from 'react';
import './Popup.css';

const Popup = ({ message, type, onClose, centered = false, bottomRight = false }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // If this is a success message for form submission, add the thank you text
  const isFormSuccess = type === 'success' && 
    (message.includes('sent successfully') || message.includes('application has been sent'));
  
  return (
    <div className={`popup-content ${type} ${centered ? 'centered' : ''} ${bottomRight ? 'bottom-right' : ''}`}>
      <div className="popup-message">
        <p>{message}</p>
        
        {isFormSuccess && (
          <p className="thank-you-message">
            Thank you for reaching out to vzbl, we will contact you soon
          </p>
        )}
      </div>
      <button className="popup-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Popup; 