import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { emailConfig } from "../../config/emailConfig";
import Popup from "../Popup/Popup";
import { motion, AnimatePresence } from "framer-motion";
import "./JoinUsForm.css";

const JoinUsForm = ({ isOpen, onClose, position = {} }) => {
  const formRef = useRef();
  const fileInputRef = useRef();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    aboutYou: "",
    resume: null,
    interests: []
  });
  
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const interestOptions = [
    "GRAPHIC DESIGN",
    "Account Management",
    "Content Creation",
    "Production",
    "Video Editing",
    "UI/UX Design",
    "HR"
  ];

  const handleInterestClick = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['.pdf', '.doc', '.docx'];
      const fileType = '.' + file.name.split('.').pop().toLowerCase();
      if (!validTypes.includes(fileType)) {
        setPopup({
          show: true,
          message: "Please upload a PDF or Word document",
          type: "error"
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setPopup({
          show: true,
          message: "File size should be less than 5MB",
          type: "error"
        });
        return;
      }
      
      setForm({ ...form, resume: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        emailConfig.serviceId,
        emailConfig.templateId,
        {
          ...form,
          to_email: "HR@VZBL.CO",
          interests: form.interests.join(", "),
          resume: form.resume ? form.resume.name : "No file attached"
        },
        emailConfig.publicKey
      )
      .then(
        (result) => {
          setPopup({
            show: true,
            message: "Your application has been sent successfully!",
            type: "success"
          });
          setForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            aboutYou: "",
            resume: null,
            interests: []
          });
          if (onClose) onClose();
        },
        (error) => {
          setPopup({
            show: true,
            message: "Failed to send application. Please try again later.",
            type: "error"
          });
        }
      )
      .finally(() => {
        setLoading(false);
      });
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {popup.show && (
              <Popup
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, show: false })}
              />
            )}
            
            <button className="close-button" onClick={onClose}>×</button>
            <h2>SEND EMAIL</h2>

            <form onSubmit={handleSubmit}>
              <div className="interest-section">
                <p>I'm interested in...</p>
                <div className="interest-options">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      className={`interest-option ${form.interests.includes(interest) ? 'selected' : ''}`}
                      onClick={() => handleInterestClick(interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-joinus">
                  <label>FIRST NAME</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                </div>

                <div className="form-group-joinus">
                  <label>LAST NAME</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-joinus">
                  <label>EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="form-group-joinus">
                  <label>PHONE NUMBER</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+20"
                    required
                  />
                </div>
              </div>
              <div className="form-group-joinus">
                <label>CV / Protofolio</label>
                <div 
                  className="file-input-label"
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span className="file-name">
                    {form.resume ? form.resume.name : "Add Attachment"}
                  </span>
                </div>
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Sending..." : "SEND US"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JoinUsForm; 