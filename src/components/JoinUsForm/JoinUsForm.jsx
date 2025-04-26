import React, { useState, useRef, useEffect } from "react";
import { emailConfig } from "../../config/emailConfig";
import Popup from "../Popup/Popup";
import { motion, AnimatePresence } from "framer-motion";
import "./JoinUsForm.css";

const JoinUsForm = ({ isOpen, onClose, position = {}, selectedJob = "" }) => {
  const formRef = useRef();
  const fileInputRef = useRef();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    aboutYou: "",
    resume: null,
    jobTitle: selectedJob || ""
  });
  
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  // Set initial job title based on selectedJob if provided
  useEffect(() => {
    if (selectedJob && isOpen) {
      setForm(prev => ({
        ...prev,
        jobTitle: selectedJob
      }));
    }
  }, [selectedJob, isOpen]);

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

    // Convert file to base64
    const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };

    const sendEmailWithBrevo = async () => {
      try {
        let attachment = null;
        
        if (form.resume) {
          const base64Content = await readFileAsBase64(form.resume);
          attachment = {
            name: form.resume.name,
            content: base64Content
          };
        }

        const emailData = {
          sender: {
            name: emailConfig.senderName,
            email: emailConfig.senderEmail
          },
          to: emailConfig.recipientEmails.map(email => ({ email })),
          subject: `Job Application: ${form.jobTitle || 'General Application'}`,
          htmlContent: `
            <h2>New Job Application</h2>
            <p><strong>Job Title:</strong> ${form.jobTitle || 'General Application'}</p>
            <p><strong>Name:</strong> ${form.firstName} ${form.lastName}</p>
            <p><strong>Email:</strong> ${form.email}</p>
            <p><strong>Phone:</strong> ${form.phone}</p>
            <p><strong>About:</strong> ${form.aboutYou || 'Not provided'}</p>
          `,
          attachment: attachment ? [attachment] : []
        };

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': emailConfig.apiKey
          },
          body: JSON.stringify(emailData)
        });

        if (!response.ok) {
          throw new Error('Failed to send email');
        }

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
          jobTitle: ""
        });
        
        if (onClose) onClose();
      } catch (error) {
        console.error("Error sending email:", error);
        setPopup({
          show: true,
          message: "Failed to send application. Please try again later.",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    sendEmailWithBrevo();
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
              />
            )}
            
            <button className="close-button" onClick={onClose}>
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>✕</span>
            </button>
            <h2>{selectedJob ? `JOIN AS ${selectedJob.toUpperCase()}` : "SEND EMAIL"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group-joinus">
                <label>JOB TITLE</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  required
                />
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
                <label>CV / Portfolio</label>
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

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "SENDING..." : "SEND US YOUR CV"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JoinUsForm; 