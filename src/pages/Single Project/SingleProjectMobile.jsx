import React, { useEffect } from "react";
import "./SingleProject.css";

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
  // Add a useEffect to fix any possible scroll issues and apply background color
  useEffect(() => {
    // Ensure we're scrolled to top
    window.scrollTo(0, 0);
    
    // Reset any overflow issues
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    
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
      // Clean up when unmounting
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
      document.body.classList.remove('dark-background');
      document.body.classList.remove('light-background');
    };
  }, [project]);

  if (!project) {
    return (
      <div className="project-loading">
        <h2>Loading project...</h2>
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
            <h1 style={{ fontFamily: "Aboreto, serif", fontSize: "2.2rem", marginBottom: "0.5rem" }}>
              {project.title}
            </h1>
          </div>
          
          {/* Show media if available */}
          {project.media && (
            <div className="mobile-project-section">
              <img
                src={project.media}
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
          marginTop: "1rem" 
        }}>
          <h1 style={{ fontFamily: "Aboreto, serif", fontSize: "2.2rem", marginBottom: "0.5rem" }}>
            {project.title}
          </h1>
          <div style={{ fontSize: "1rem", opacity: 0.7, marginBottom: "0.5rem" }}>
           
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 400 }}>
            {project.projectContent?.sections?.[0]?.services || ""}
          </div>
        </div>
        {/* Sections */}
        {project.projectContent.sections.map((section, index) => (
          <div key={index} className="mobile-project-section">
            {section.type === "media" && (
              <img
                src={section.media || section.imageName}
                alt={section.alt || `Project section ${index + 1}`}
                className="mobile-project-image"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
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
                  <h2 className="text-slogan" style={{ fontFamily: "Aboreto, serif", fontSize: "1.5rem", marginBottom: "1rem" }}>
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
                    {section.text}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleProjectMobile; 