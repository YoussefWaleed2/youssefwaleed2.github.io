import React, { useState, useRef } from "react";
import { emailConfig } from "../../config/emailConfig";
import Popup from "../Popup/Popup";
import { sendEmail } from '../../utils/email';
import { generateContactEmail } from '../../utils/emailTemplates';
import CountryCodeSelect from '../CountryCodeSelect/CountryCodeSelect';
import "./ContactForm.css";

const ContactForm = ({ formType = 'contact' }) => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "", // Changed to empty string like JoinUsForm
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
  const [fieldErrors, setFieldErrors] = useState({}); // Added field errors like JoinUsForm

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
    
    // Clear field error when user starts typing (added like JoinUsForm)
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
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

    // Clear previous field errors (added like JoinUsForm)
    setFieldErrors({});
    
    const errors = {};

    // Validate all required fields (added like JoinUsForm)
    if (!form.name.trim()) {
      errors.name = "Full name is required";
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
    if (!form.projectName.trim()) {
      errors.projectName = "Project name is required";
    }
    if (!form.sector) {
      errors.sector = "Please select a sector";
    }
    if (!form.service) {
      errors.service = "Please select a service";
    }

    // Service-specific validations
    if (selectedService === "Branding") {
      if (!form.brandName.trim()) {
        errors.brandName = "Brand name is required";
      }
      if (!form.brandingType) {
        errors.brandingType = "Please select branding type";
      }
      if (!form.budget) {
        errors.budget = "Please select budget";
      }
    }

    if (selectedService === "Marketing" || selectedService === "Advertisement") {
      if (!form.socialMediaLink.trim()) {
        errors.socialMediaLink = "Social media link is required";
      }
      if (form.platforms.length === 0) {
        errors.platforms = "Please select at least one platform";
      }
      if (!form.budget) {
        errors.budget = "Please select budget";
      }
      if (selectedService === "Advertisement" && !form.campaignObjective.trim()) {
        errors.campaignObjective = "Campaign objective is required";
      }
    }

    // Validate all inputs for security
    for (const [key, value] of Object.entries(form)) {
      if (typeof value === 'string' && value && !validateInput(value)) {
        errors[key] = "Invalid characters detected";
      }
    }

    // If there are validation errors, show them and stop submission (added like JoinUsForm)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
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
        countryCode: "",
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
            placeholder="FULL NAME" 
            className={fieldErrors.name ? 'error' : ''}
          />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>

        <div className="form-group">
          <input 
            type="email" 
            name="email" 
            value={form.email}
            onChange={handleChange}
            placeholder="Email" 
            className={fieldErrors.email ? 'error' : ''}
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
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
            className={`phone-input ${fieldErrors.phone ? 'error' : ''}`}
          />
        </div>
        {(fieldErrors.countryCode || fieldErrors.phone) && (
          <span className="field-error">
            {fieldErrors.countryCode || fieldErrors.phone}
          </span>
        )}

        <div className="form-group">
          <input 
            type="text" 
            name="projectName" 
            value={form.projectName}
            onChange={handleChange}
            placeholder="Project Name" 
            className={fieldErrors.projectName ? 'error' : ''}
          />
          {fieldErrors.projectName && <span className="field-error">{fieldErrors.projectName}</span>}
        </div>

        <div className="form-group">
          <select 
            name="sector" 
            value={form.sector}
            onChange={handleChange}
            className={fieldErrors.sector ? 'error' : ''}
          >
            <option value="">SELECT SECTOR</option>
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
          {fieldErrors.sector && <span className="field-error">{fieldErrors.sector}</span>}
        </div>

        <div className="form-group">
          <select 
            name="service" 
            value={form.service}
            onChange={handleServiceChange}
            className={fieldErrors.service ? 'error' : ''}
          >
            <option value="">SELECT SERVICE</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          {fieldErrors.service && <span className="field-error">{fieldErrors.service}</span>}
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
                className={fieldErrors.brandName ? 'error' : ''}
              />
              {fieldErrors.brandName && <span className="field-error">{fieldErrors.brandName}</span>}
            </div>

            <div className="form-group">
              <select 
                name="brandingType" 
                value={form.brandingType}
                onChange={handleChange}
                className={fieldErrors.brandingType ? 'error' : ''}
              >
                <option value="">SELECT BRANDING TYPE</option>
                {brandingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {fieldErrors.brandingType && <span className="field-error">{fieldErrors.brandingType}</span>}
            </div>

            <div className="form-group">
              <select 
                name="budget" 
                value={form.budget}
                onChange={handleChange}
                className={fieldErrors.budget ? 'error' : ''}
              >
                <option value="">SELECT BUDGET</option>
                {budgetOptions[selectedService].map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
              {fieldErrors.budget && <span className="field-error">{fieldErrors.budget}</span>}
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
                className={fieldErrors.socialMediaLink ? 'error' : ''}
              />
              {fieldErrors.socialMediaLink && <span className="field-error">{fieldErrors.socialMediaLink}</span>}
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
              {fieldErrors.platforms && <span className="field-error">{fieldErrors.platforms}</span>}
            </div>

            <div className="form-group">
              <select 
                name="budget" 
                value={form.budget}
                onChange={handleChange}
                className={fieldErrors.budget ? 'error' : ''}
              >
                <option value="">Select Budget</option>
                {budgetOptions[selectedService].map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
              {fieldErrors.budget && <span className="field-error">{fieldErrors.budget}</span>}
            </div>

            {selectedService === "Advertisement" && (
              <div className="form-group">
                <input 
                  type="text" 
                  name="campaignObjective" 
                  value={form.campaignObjective}
                  onChange={handleChange}
                  placeholder="Campaign Objective" 
                  className={fieldErrors.campaignObjective ? 'error' : ''}
                />
                {fieldErrors.campaignObjective && <span className="field-error">{fieldErrors.campaignObjective}</span>}
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
