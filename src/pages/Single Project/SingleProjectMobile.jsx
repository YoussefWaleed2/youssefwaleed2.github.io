import React, { useEffect } from "react";
import "./SingleProject.css";

const SingleProjectMobile = ({ project }) => {
  // Add a useEffect to fix any possible scroll issues
  useEffect(() => {
    // Ensure we're scrolled to top
    window.scrollTo(0, 0);
    
    // Reset any overflow issues
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    
    return () => {
      // Clean up when unmounting
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (!project) {
    return (
      <div className="project-loading">
        <h2>Loading project...</h2>
      </div>
    );
  }

  // Handle case where project doesn't have content
  if (!project.projectContent || !project.projectContent.sections) {
    return (
      <div className="mobile-single-project">
        <div className="mobile-project-content">
          {/* Basic Project Title/Header */}
          <div className="mobile-project-header" style={{ padding: "2rem 1rem 1rem 1rem", background: "#111", color: "#fff" }}>
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
          <div className="mobile-project-text" style={{ backgroundColor: "#181818", color: "#fff", padding: "2rem 1rem", textAlign: "center" }}>
            <p>More details about this project coming soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-single-project">
      <div className="mobile-project-content">
        {/* Project Title/Header */}
        <div className="mobile-project-header" style={{ padding: "3.5rem 1rem 1rem 1rem", background: "#111", color: "#fff", marginTop: "1rem" }}>
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
                  backgroundColor: section.backgroundColor || "#181818",
                  color: section.textColor || "#fff",
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