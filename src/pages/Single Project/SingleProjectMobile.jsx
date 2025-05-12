import React from "react";
import "./SingleProject.css";

const SingleProjectMobile = ({ project }) => {
  if (!project) {
    return (
      <div className="project-loading">
        <h2>Loading project...</h2>
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
        {project.projectContent?.sections.map((section, index) => (
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