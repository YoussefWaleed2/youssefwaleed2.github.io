import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { emailConfig } from "../../config/emailConfig";
import Popup from "../Popup/Popup";
import "./ContactForm.css";

const ContactForm = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if EmailJS is configured
    if (!emailConfig.serviceId || !emailConfig.templateId || !emailConfig.publicKey) {
      console.log("EmailJS not configured. Form data:", form);
      setPopup({
        show: true,
        message: "Message sent successfully! (Email service not configured)",
        type: "success"
      });
      setForm({
        name: "",
        email: "",
        message: "",
      });
      setLoading(false);
      return;
    }

    // Add recipient email to the form data
    const formData = {
      ...form,
      to_email: emailConfig.recipientEmail,
    };

    // Send email using EmailJS
    emailjs
      .sendForm(
        emailConfig.serviceId,
        emailConfig.templateId,
        formRef.current,
        emailConfig.publicKey
      )
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
          setPopup({
            show: true,
            message: "Your message has been sent successfully!",
            type: "success"
          });
          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          console.error("Failed to send email:", error.text);
          setPopup({
            show: true,
            message: "Failed to send message. Please try again later.",
            type: "error"
          });
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="contact-form">
      {popup.show && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}
      
      <div className="contact-form-row">
        <div className="contact-form-row-copy-item">
          <p className="primary sm">Let's create together</p>
        </div>
        
        
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="contact-form-row">
        <div className="contact-form-col">
          <div className="contact-form-header">
            <h3>Start a Conversation</h3>

            <p>
              Have a story in mind? Let's bring it to life. I'd love to hear
              what you're working on and explore how we can collaborate.
            </p>
          </div>

          <div className="contact-form-availability">
            <p className="primary sm">Available for Freelance</p>
            <p className="primary sm">Clients worldwide</p>
          </div>
        </div>

        <div className="contact-form-col">
          <div className="form-item">
            <input 
              type="text" 
              name="name" 
              value={form.name}
              onChange={handleChange}
              placeholder="Name" 
              required
            />
          </div>

          <div className="form-item">
            <input 
              type="email" 
              name="email" 
              value={form.email}
              onChange={handleChange}
              placeholder="Email" 
              required
            />
          </div>

          <div className="form-item">
            <textarea 
              name="message" 
              value={form.message}
              onChange={handleChange}
              rows={6} 
              placeholder="Message" 
              required
            />
          </div>

          <div className="form-item">
            <button 
              className="btn" 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
