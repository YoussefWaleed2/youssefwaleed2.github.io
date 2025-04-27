import React, { useEffect } from 'react';
import './Popup.css';

const Popup = ({ message, type, onClose, centered = false }) => {
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
    <div className={`popup ${type} ${centered ? 'centered' : ''}`}>
      <div className="popup-content">
        <div className="popup-message">
          <p>{message}</p>
          
          {isFormSuccess && (
            <p className="thank-you-message">
              Thank you for reaching out to VZBL.<br />
              An email will be sent to you as soon as possible.
            </p>
          )}
        </div>
        <button className="popup-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Popup; 