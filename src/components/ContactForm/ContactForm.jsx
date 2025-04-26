import React, { useState, useRef } from "react";
import { emailConfig } from "../../config/emailConfig";
import Popup from "../Popup/Popup";
import "./ContactForm.css";

const ContactForm = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Format the email content based on the selected service
    let serviceSpecificContent = '';
    
    if (selectedService === "Branding") {
      serviceSpecificContent = `
        <p><strong>Brand Name:</strong> ${form.brandName}</p>
        <p><strong>Branding Type:</strong> ${form.brandingType}</p>
      `;
    } else if (selectedService === "Marketing" || selectedService === "Advertisement") {
      serviceSpecificContent = `
        <p><strong>Social Media Link:</strong> ${form.socialMediaLink}</p>
        <p><strong>Platforms:</strong> ${form.platforms.join(", ")}</p>
      `;
      
      if (selectedService === "Advertisement") {
        serviceSpecificContent += `<p><strong>Campaign Objective:</strong> ${form.campaignObjective}</p>`;
      }
    }

    const sendEmailWithBrevo = async () => {
      try {
        const emailData = {
          sender: {
            name: emailConfig.senderName,
            email: emailConfig.senderEmail
          },
          to: emailConfig.recipientEmails.map(email => ({ email })),
          subject: `Contact Form: ${form.projectName}`,
          htmlContent: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${form.name}</p>
            <p><strong>Email:</strong> ${form.email}</p>
            <p><strong>Phone:</strong> ${form.phone}</p>
            <p><strong>Project Name:</strong> ${form.projectName}</p>
            <p><strong>Sector:</strong> ${form.sector}</p>
            <p><strong>Service:</strong> ${form.service}</p>
            ${serviceSpecificContent}
            <p><strong>Budget:</strong> ${form.budget}</p>
          `
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
          message: "Your message has been sent successfully!",
          type: "success"
        });
        
        setForm({
          name: "",
          email: "",
          phone: "",
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
        console.error("Error sending email:", error);
        setPopup({
          show: true,
          message: "Failed to send message. Please try again later.",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    sendEmailWithBrevo();
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

        <div className="form-group">
          <input 
            type="tel" 
            name="phone" 
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number" 
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
            <option value="">Select Sector</option>
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
            <option value="">Select Service</option>
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
                <option value="">Select Branding Type</option>
                {brandingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <input 
                type="text" 
                name="budget" 
                value={form.budget}
                onChange={handleChange}
                placeholder="Budget" 
                required
              />
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
              <input 
                type="text" 
                name="budget" 
                value={form.budget}
                onChange={handleChange}
                placeholder="Budget" 
                required
              />
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
