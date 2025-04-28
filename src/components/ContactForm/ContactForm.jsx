import React, { useState, useRef } from "react";
import { emailConfig } from "../../config/emailConfig";
import Popup from "../Popup/Popup";
import { sendEmail } from '../../utils/email';
import { generateContactEmail } from '../../utils/emailTemplates';
import { countryCodes } from '../../utils/countryCodes';
import CountryCodeSelect from '../CountryCodeSelect/CountryCodeSelect';
import "./ContactForm.css";

const ContactForm = ({ formType = 'contact' }) => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+971", // Default country code (UAE)
    projectName: "",
    sector: "",
    service: "",
    brandName: "",
    brandingType: "",
    budget: "",
    socialMediaLink: "",
    platforms: [],
    campaignObjective: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [selectedService, setSelectedService] = useState("");

  const sectors = [
    "Hospitality",
    "F&B",
    "Entertainment",
    "Automotive",
    "Fashion & Leisure",
    "Cosmetics",
    "Others"
  ];

  const services = ["Branding", "Marketing", "Advertisement"];
  const brandingTypes = ["Branding", "Rebranding", "Revamping"];
  const socialPlatforms = ["Instagram", "Tiktok", "Linkedin", "Facebook", "Snapchat"];
  
  const budgetOptions = {
    Advertisement: [
      "6,000-15,000$",
      "15,000-30,000$",
      "30,000-70,000$",
      "70,000-100,000$",
      "ABOVE 100,000$"
    ],
    Marketing: [
      "4,000$-7,000$",
      "7,000$-10,000$",
      "10,000$-15,000$"
    ],
    Branding: [
      "5,000$-10,000$",
      "10,000$-20,000$",
      "20,000$-30,000$",
      "ABOVE 30,000$"
    ]
  };

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
    
    setForm({ ...form, [name]: value });
  };

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setForm({ 
      ...form, 
      service,
      // Reset service-specific fields when service changes
      brandName: "",
      brandingType: "",
      socialMediaLink: "",
      platforms: [],
      campaignObjective: "",
    });
  };

  const handlePlatformChange = (e) => {
    const platform = e.target.value;
    const isChecked = e.target.checked;
    
    setForm(prevForm => ({
      ...prevForm,
      platforms: isChecked 
        ? [...prevForm.platforms, platform]
        : prevForm.platforms.filter(p => p !== platform)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup({ show: false, message: "", type: "" });

    // Validate all inputs before submission
    for (const [value] of Object.entries(form)) {
      if (typeof value === 'string' && !validateInput(value)) {
        setPopup({
          show: true,
          message: "Invalid input detected. Please check your information.",
          type: "error"
        });
        setLoading(false);
        return;
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

    try {
      // Prepare the form data for the template
      const sanitizedForm = {
        name: sanitize(form.name),
        email: sanitize(form.email),
        phone: `${sanitize(form.countryCode)} ${sanitize(form.phone)}`, // Include country code
        projectName: sanitize(form.projectName),
        sector: sanitize(form.sector),
        service: sanitize(form.service),
        brandName: form.brandName ? sanitize(form.brandName) : '',
        brandingType: form.brandingType ? sanitize(form.brandingType) : '',
        socialMediaLink: form.socialMediaLink ? sanitize(form.socialMediaLink) : '',
        platforms: form.platforms.map(p => sanitize(p)),
        campaignObjective: form.campaignObjective ? sanitize(form.campaignObjective) : '',
        budget: sanitize(form.budget)
      };
      
      // Generate HTML email content
      const htmlContent = generateContactEmail(sanitizedForm);

      const emailData = {
        senderName: emailConfig.contact.senderName,
        senderEmail: emailConfig.contact.senderEmail,
        replyTo: form.email,
        subject: `Contact Form: ${sanitize(form.projectName)}`,
        to: [emailConfig.contact.recipientEmail],
        htmlContent,
        formType: formType
      };

      await sendEmail(emailData);

      setPopup({
        show: true,
        message: "Message sent successfully!",
        type: "success"
      });
      
      setForm({
        name: "",
        email: "",
        phone: "",
        countryCode: "+971",
        projectName: "",
        sector: "",
        service: "",
        brandName: "",
        brandingType: "",
        budget: "",
        socialMediaLink: "",
        platforms: [],
        campaignObjective: "",
      });
      
      setSelectedService("");
    } catch (error) {
      console.error("Email sending error:", error);
      setPopup({
        show: true,
        message: "Failed to send message. Please try again later.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form">
      {popup.show && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
          centered={popup.type === 'success'}
        />
      )}
      
      <div className="contact-form-header">
        <h2>GET IN TOUCH</h2>
        
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="contact-form-content">
        <div className="form-group">
          <input 
            type="text" 
            name="name" 
            value={form.name}
            onChange={handleChange}
            placeholder="Name" 
            required
          />
        </div>

        <div className="form-group">
          <input 
            type="email" 
            name="email" 
            value={form.email}
            onChange={handleChange}
            placeholder="Email" 
            required
          />
        </div>

        <div className="form-group phone-input-group">
          <CountryCodeSelect 
            value={form.countryCode}
            onChange={handleChange}
          />
          <input 
            type="tel" 
            name="phone" 
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number" 
            className="phone-input"
            required
          />
        </div>

        <div className="form-group">
          <input 
            type="text" 
            name="projectName" 
            value={form.projectName}
            onChange={handleChange}
            placeholder="Project Name" 
            required
          />
        </div>

        <div className="form-group">
          <select 
            name="sector" 
            value={form.sector}
            onChange={handleChange}
            required
          >
            <option value="">SELECT SECTOR</option>
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <select 
            name="service" 
            value={form.service}
            onChange={handleServiceChange}
            required
          >
            <option value="">SELECT SERVICE</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {selectedService === "Branding" && (
          <>
            <div className="form-group">
              <input 
                type="text" 
                name="brandName" 
                value={form.brandName}
                onChange={handleChange}
                placeholder="Brand Name" 
                required
              />
            </div>

            <div className="form-group">
              <select 
                name="brandingType" 
                value={form.brandingType}
                onChange={handleChange}
                required
              >
                <option value="">SELECT BRANDING TYPE</option>
                {brandingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <select 
                name="budget" 
                value={form.budget}
                onChange={handleChange}
                required
              >
                <option value="">SELECT BUDGET</option>
                {budgetOptions[selectedService].map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {(selectedService === "Marketing" || selectedService === "Advertisement") && (
          <>
            <div className="form-group">
              <input 
                type="url" 
                name="socialMediaLink" 
                value={form.socialMediaLink}
                onChange={handleChange}
                placeholder="Social Media Platform Link" 
                required
              />
            </div>

            <div className="form-group platforms-group">
              <label>Platforms:</label>
              <div className="platforms-checkboxes">
                {socialPlatforms.map(platform => (
                  <label key={platform} className="platform-checkbox">
                    <input
                      type="checkbox"
                      value={platform}
                      checked={form.platforms.includes(platform)}
                      onChange={handlePlatformChange}
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <select 
                name="budget" 
                value={form.budget}
                onChange={handleChange}
                required
              >
                <option value="">Select Budget</option>
                {budgetOptions[selectedService].map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </div>

            {selectedService === "Advertisement" && (
              <div className="form-group">
                <input 
                  type="text" 
                  name="campaignObjective" 
                  value={form.campaignObjective}
                  onChange={handleChange}
                  placeholder="Campaign Objective" 
                  required
                />
              </div>
            )}
          </>
        )}

        <div className="form-group">
          <button 
            className="submit-btn" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
