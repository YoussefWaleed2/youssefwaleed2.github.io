import React, { useState, useRef, useEffect } from "react";
import { emailConfig } from "../../config/emailConfig";
import Popup from "../Popup/Popup";
import { AnimatePresence, motion } from "framer-motion";
import "./JoinUsForm.css";
import { sendEmail } from '../../utils/email';
import { generateJoinUsEmail } from '../../utils/emailTemplates';
import CountryCodeSelect from '../CountryCodeSelect/CountryCodeSelect';

const JoinUsForm = ({ isOpen, onClose, position = {}, selectedJob = "" }) => {
  
  const fileInputRef = useRef();
  const scrollContainerRef = useRef();
  const formRef = useRef();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "",
    aboutYou: "",
    portfolioLink: "",
    resume: null,
    jobTitle: selectedJob || ""
  });
  
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  // Set initial job title based on selectedJob if provided
  useEffect(() => {
    if (selectedJob && isOpen) {
      setForm(prev => ({
        ...prev,
        jobTitle: selectedJob
      }));
    }
  }, [selectedJob, isOpen]);

  // Handle form open state
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('form-open');
    } else {
      document.body.classList.remove('form-open');
    }
    
    return () => {
      document.body.classList.remove('form-open');
    };
  }, [isOpen]);

  // Handle wheel events for scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollContainerRef.current && isOpen) {
        scrollContainerRef.current.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };

    // Touch support for mobile
    const handleTouchStart = (e) => {
      if (!scrollContainerRef.current) return;
      const touchY = e.touches[0].clientY;
      scrollContainerRef.current.dataset.touchStartY = touchY;
    };

    const handleTouchMove = (e) => {
      if (!scrollContainerRef.current) return;
      const touchStartY = parseInt(scrollContainerRef.current.dataset.touchStartY || '0', 10);
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      
      scrollContainerRef.current.scrollTop += deltaY;
      scrollContainerRef.current.dataset.touchStartY = touchY;
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && isOpen) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
      scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
      scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleWheel);
        scrollContainer.removeEventListener('touchstart', handleTouchStart);
        scrollContainer.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isOpen]);

  // Validate input for security
  const validateInput = (input) => {
    // Check for potential script injection or suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // onload=, onclick=, etc.
      /data:/i
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(input));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Security validation
    if (!validateInput(value)) {
      setPopup({
        show: true,
        message: "Invalid input detected. Please avoid using scripts or code.",
        type: "error"
      });
      return;
    }
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clear resume field error when file is selected
      if (fieldErrors.resume) {
        setFieldErrors(prev => ({ ...prev, resume: "" }));
      }
      
      // Check file type - show as inline error
      const validTypes = ['.pdf', '.doc', '.docx'];
      const fileType = '.' + file.name.split('.').pop().toLowerCase();
      if (!validTypes.includes(fileType)) {
        setFieldErrors(prev => ({ ...prev, resume: "Please upload a PDF or Word document" }));
        return;
      }
      
      // Check file size (max 2MB) - keep as popup error (bottom-right)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        setPopup({
          show: true,
          message: "File size should be less than 2MB",
          type: "error"
        });
        return;
      }
      
      // Validate file name for security - show as inline error
      if (!validateInput(file.name)) {
        setFieldErrors(prev => ({ ...prev, resume: "Invalid file name. Please rename your file without special characters." }));
        return;
      }
      
      setForm({ ...form, resume: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup({ show: false, message: "", type: "" });
    
    // Clear previous field errors
    setFieldErrors({});
    
    const errors = {};

    // Validate all required fields
    if (!form.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!form.email.trim()) {
      errors.email = "Email is required";
    }
    if (!form.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    if (!form.countryCode || form.countryCode === "") {
      errors.countryCode = "Please select a country code";
    }
    if (!form.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }
    if (!form.resume) {
      errors.resume = "Please attach your resume file";
    }

    // Validate all inputs for security
    for (const [key, value] of Object.entries(form)) {
      if (typeof value === 'string' && value && !validateInput(value)) {
        errors[key] = "Invalid characters detected";
      }
    }

    // If there are validation errors, show them and stop submission
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    // Convert file to base64
    const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };

    try {
      let attachment = [];
      
      if (form.resume) {
        try {
          const base64Content = await readFileAsBase64(form.resume);
          attachment.push({
            name: form.resume.name,
            content: base64Content
          });
        } catch (fileError) {
          console.error("File processing error:", fileError);
          setPopup({
            show: true,
            message: "Error processing your resume file. Please try another file.",
            type: "error"
          });
          setLoading(false);
          return; // Stop submission if file processing fails
        }
      }

      // Sanitize inputs for email content
      const sanitize = (str) => {
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      // Prepare the form data for the template
      const sanitizedForm = {
        fullName: sanitize(form.fullName),
        email: sanitize(form.email),
        phone: `${sanitize(form.countryCode)} ${sanitize(form.phone)}`, // Include country code
        jobTitle: sanitize(form.jobTitle),
        aboutYou: form.aboutYou ? sanitize(form.aboutYou) : '',
        portfolioLink: form.portfolioLink ? sanitize(form.portfolioLink) : '',
        resume: form.resume ? true : false
      };
      
      // Generate HTML email content
      const htmlContent = generateJoinUsEmail(sanitizedForm);

      const emailData = {
        senderName: emailConfig.joinUs.senderName,
        senderEmail: emailConfig.joinUs.senderEmail,
        replyTo: form.email,
        subject: `Join Us Form: ${sanitize(form.jobTitle) || 'General Application'}`,
        to: [emailConfig.joinUs.recipientEmail],
        htmlContent,
        formType: 'joinUs'
      };
      
      // Only add attachment if there's a resume
      if (attachment.length > 0) {
        emailData.attachment = attachment;
      }

      await sendEmail(emailData);
      
      // Show success message
      setPopup({
        show: true,
        message: "Application sent successfully!",
        type: "success"
      });
      
      // Reset the form
      setForm({
        fullName: "",
        email: "",
        phone: "",
        countryCode: "",
        aboutYou: "",
        portfolioLink: "",
        resume: null,
        jobTitle: ""
      });
      
      // Close the form if needed
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 8000); // Close after 2 seconds so user can see success message
      }
    } catch (error) {
      console.error("Email sending error:", error);
      setPopup({
        show: true,
        message: "Failed to send application. Please try again later.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Focus management for accessibility
  useEffect(() => {
    if (!isOpen) return;
    
    // Focus the first input when the form opens
    const firstInput = formRef.current?.querySelector('input:not([type="file"])');
    setTimeout(() => {
      if (firstInput) {
        firstInput.focus();
      }
    }, 300); // Wait for animation to complete
    
    // Create focus trap
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = formRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
      
      // Close on escape key
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="join-us-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="join-us-form"
            style={position}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {popup.show && (
              <Popup
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, show: false })}
                centered={popup.type === 'success'}
                bottomRight={popup.type === 'error'}
              />
            )}
            
            <button className="close-button" onClick={onClose}>
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>✕</span>
            </button>
            
            <div className="join-us-form-inner" ref={scrollContainerRef}>
              <div className="join-us-form-header">
                <h2>{selectedJob ? `JOIN AS ${selectedJob.toUpperCase()}` : "JOIN US"}</h2>
              </div>

              <form className="join-us-form-content" ref={formRef} onSubmit={handleSubmit}>
                <div className="form-group-joinus">
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="FULL NAME"
                    className={fieldErrors.fullName ? 'error' : ''}
                  />
                  {fieldErrors.fullName && <span className="field-error">{fieldErrors.fullName}</span>}
                </div>

                <div className="form-group-joinus">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="EMAIL"
                    className={fieldErrors.email ? 'error' : ''}
                  />
                  {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                </div>

                <div className="form-group-joinus">
                  <div className="phone-input-container">
                    <CountryCodeSelect 
                      value={form.countryCode}
                      onChange={handleChange}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className={`phone-input ${fieldErrors.phone ? 'error' : ''}`}
                      placeholder="PHONE NUMBER"
                    />
                  </div>
                  {(fieldErrors.countryCode || fieldErrors.phone) && (
                    <span className="field-error">
                      {fieldErrors.countryCode || fieldErrors.phone}
                    </span>
                  )}
                </div>

                <div className="form-group-joinus">
                  <input
                    type="text"
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    placeholder="JOB TITLE"
                    className={fieldErrors.jobTitle ? 'error' : ''}
                  />
                  {fieldErrors.jobTitle && <span className="field-error">{fieldErrors.jobTitle}</span>}
                </div>

                <div className="form-group-joinus">
                  <input
                    type="url"
                    name="portfolioLink"
                    value={form.portfolioLink}
                    onChange={handleChange}
                    placeholder="PORTFOLIO LINK (OPTIONAL)"
                    className={fieldErrors.portfolioLink ? 'error' : ''}
                  />
                  {fieldErrors.portfolioLink && <span className="field-error">{fieldErrors.portfolioLink}</span>}
                </div>

                <div className="form-group-joinus">
                  <div 
                    className={`file-input-label ${fieldErrors.resume ? 'error' : ''}`}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span className="file-name">
                      {form.resume ? form.resume.name : "ADD ATTACHMENT"}
                    </span>
                  </div>
                  {fieldErrors.resume && <span className="field-error">{fieldErrors.resume}</span>}
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "SENDING..." : "SEND US YOUR CV"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JoinUsForm; 