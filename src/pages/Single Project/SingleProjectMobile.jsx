import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SingleProject.css";
import Footer from "../../components/Footer/Footer";
import { CDN_CONFIG } from "../../config/cdn";

// Helper function to determine text color based on background brightness
const getTextColor = (bgColor) => {
  // Default colors if bgColor is not provided
  if (!bgColor) return "#FFFFFF";
  
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const rgb = hexToRgb(bgColor);
  if (rgb) {
    // Simple luminance formula
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance < 0.5 ? "#FFFFFF" : "#1A1A1A";
  }
  
  return "#FFFFFF"; // Default to white text
};

const SingleProjectMobile = ({ project }) => {
  // Add navigate for navigation functionality
  const navigate = useNavigate();
  // Get category from URL params
  const { category } = useParams();

  // Function to handle navigation back to projects
  const handleBackToProjects = () => {
    document.documentElement.style.backgroundColor = '';
    
    // Remove classes immediately
    document.body.classList.remove('dark-background');
    document.body.classList.remove('light-background');
    document.body.classList.remove('single-project-page-active');
    
    // Navigate to the specific category page with correct URL pattern
    navigate(`/all-projects/${category}`);
  };

  // Add a useEffect to fix any possible scroll issues and apply background color
  useEffect(() => {
    // Ensure we're scrolled to top
    window.scrollTo(0, 0);
    
    
    // Apply background color from project data if available
    const bgColor = project?.backgroundColor || '#000000';
    document.body.style.backgroundColor = bgColor;
    document.documentElement.style.backgroundColor = bgColor; // Also set HTML background
    
    // Apply appropriate text color based on background brightness
    const textColor = getTextColor(bgColor);
    
    if (textColor === "#FFFFFF") {
      document.body.classList.add('dark-background');
      document.body.classList.remove('light-background');
    } else {
      document.body.classList.add('light-background');
      document.body.classList.remove('dark-background');
    }
    
    return () => {
      // Disable transitions during cleanup to prevent flash
      document.body.style.transition = 'none';
      document.documentElement.style.transition = 'none';
      
      // Clean up when unmounting - set immediate styles without transitions
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
      document.body.classList.remove('dark-background');
      document.body.classList.remove('light-background');
      document.body.classList.remove('single-project-page-active');
      
      // Allow transitions again after a small delay (after navigation completes)
      setTimeout(() => {
        document.body.style.transition = '';
        document.documentElement.style.transition = '';
      }, 300);
    };
  }, [project]);

  if (!project) {
    return (
      <div className="project-loading">
        
      </div>
    );
  }

  // Get appropriate text color based on project background
  const headerBgColor = project.backgroundColor || "#111";
  const headerTextColor = getTextColor(headerBgColor);

  // Handle case where project doesn't have content
  if (!project.projectContent || !project.projectContent.sections) {
    return (
      <div className="mobile-single-project" style={{ backgroundColor: headerBgColor }}>
        <div className="mobile-project-content">
          {/* Basic Project Title/Header */}
          <div className="mobile-project-header" style={{ 
            padding: "2rem 1rem 1rem 1rem", 
            background: headerBgColor, 
            color: headerTextColor 
          }}>
            <h1 style={{ fontFamily: "Sprat, sans-serif", fontSize: "2.2rem", marginBottom: "0.5rem" }}>
              {project.title}
            </h1>
          </div>
          
          {/* Show media if available */}
          {project.media && (
            <div className="mobile-project-section">
              <img
                src={project.mobileMedia || project.media}
                alt={project.title}
                className="mobile-project-image"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          )}
          
          {/* Placeholder message */}
          <div className="mobile-project-text" style={{ 
            backgroundColor: headerBgColor, 
            color: headerTextColor, 
            padding: "2rem 1rem", 
            textAlign: "center" 
          }}>
            <p>More details about this project coming soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-single-project" style={{ backgroundColor: headerBgColor }}>
      <div className="mobile-project-content">
        {/* Project Title/Header */}
        <div className="mobile-project-header" style={{ 
          padding: "3.5rem 1rem 1rem 1rem", 
          background: headerBgColor, 
          color: headerTextColor, 
          marginTop: "1rem",
          textAlign: "center"
        }}>
          <h1 style={{ fontFamily: "Sprat, sans-serif", fontSize: "2.2rem", marginBottom: "0.5rem", fontWeight: "500" }}>
            {project.title}
          </h1>
          <div style={{ fontFamily: "Sprat, sans-serif", fontSize: "1rem", opacity: 0.7, marginBottom: "0.5rem" }}>
           
          </div>
          <div style={{ fontFamily: "Sprat, sans-serif", fontSize: "1.1rem", fontWeight: 400 }}>
            {project.projectContent?.sections?.[0]?.services || ""}
          </div>
        </div>
        {/* Sections */}
        {project.projectContent.sections.map((section, index) => (
          <div 
            key={index} 
            className="mobile-project-section"
            style={{ 
              marginBottom: index === project.projectContent.sections.length - 1 ? '0' : '0'
            }}
          >
            {/* Handle both media and Video types */}
            {(section.type === "media" || section.type === "Video") && (
              <>
                {/* Check if it's a video section or has a video file extension */}
                {section.type === "Video" || (section.media && (section.media.endsWith('.mp4') || section.media.endsWith('.webm'))) ? (
                  <div className="mobile-project-video-container" style={{ 
                    width: "100%", 
                    display: "block", 
                    padding: "0",
                    margin: "0",
                    overflow: "hidden"
                  }}>
                    <video 
                      src={CDN_CONFIG.getVideoFromPath(section.media)}
                      alt={section.alt || `Project section ${index + 1}`}
                      className="mobile-project-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls={false}
                      style={{
                        width: "100%",
                        height: "auto",
                        margin: "0",
                        padding: "0",
                        display: "block",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={section.mobileMedia || section.media || section.imageName}
                    alt={section.alt || `Project section ${index + 1}`}
                    className="mobile-project-image"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                )}
              </>
            )}
            {section.type === "text" && (
              <div
                className="mobile-project-text"
                style={{
                  backgroundColor: section.backgroundColor || headerBgColor,
                  color: section.textColor || getTextColor(section.backgroundColor || headerBgColor),
                  padding: "2rem 1rem"
                }}
              >
                {section.slogan && (
                  <h2 className="text-slogan" style={{ fontFamily: "Sprat, sans-serif", fontSize: "1.5rem", marginBottom: "1rem",fontWeight: "500" }}>
                    {section.slogan}
                  </h2>
                )}
                {section.subTitle && (
                  <div style={{ fontSize: "1.1rem", marginBottom: "0.5rem", opacity: 0.8 }}>
                    {section.subTitle}
                  </div>
                )}
                {section.text && (
                  <div className="text-right-column" style={{ fontSize: "1rem", lineHeight: 1.6 }}>
                    {Array.isArray(section.text) ? 
                      section.text.map((paragraph, i) => (
                        <p key={i} style={{ marginBottom: i < section.text.length - 1 ? '1rem' : 0 }}>
                          {paragraph}
                        </p>
                      )) : 
                      section.text
                    }
                  </div>
                )}
                
                {/* Field and Services info displayed vertically */}
                <div className="mobile-info-section" style={{ 

                }}>
                  {section.fieldName && (
                    <div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.7}}>FIELD</div>
                      <div style={{ fontSize: '1rem', fontWeight: 500 }}>{section.fieldName}</div>
                    </div>
                  )}
                  {section.services && (
                    <div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>SERVICE</div>
                      <div style={{ fontSize: '1.2rem', fontFamily: 'Sprat, sans-serif', fontWeight: "500" }}>{section.services}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {section.type === "text-section" && (
              <div
                className="mobile-project-text-section"
                style={{
                  backgroundColor: section.backgroundColor || headerBgColor,
                  color: section.textColor || getTextColor(section.backgroundColor || headerBgColor),
                  padding: "4rem 1.5rem",
                  textAlign: "center"
                }}
              >
                {section.text && (
                  <div className="text-section-content-mobile">
                    {Array.isArray(section.text) ? 
                      section.text.map((paragraph, i) => (
                        <p 
                          key={i} 
                          className="text-section-paragraph-mobile" 
                          style={{ 
                            marginBottom: i < section.text.length - 1 ? '1.5rem' : 0 
                          }}
                        >
                          {paragraph}
                        </p>
                      )) : 
                      <p className="text-section-paragraph-mobile">
                        {section.text}
                      </p>
                    }
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Back to Projects button */}
      <button 
        className="back-to-projects-btn" 
        onClick={handleBackToProjects}
        aria-label="Back to projects"
      >
        <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 1L1 10L10 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 10H29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <Footer />
    </div>
  );
};

export default SingleProjectMobile; 