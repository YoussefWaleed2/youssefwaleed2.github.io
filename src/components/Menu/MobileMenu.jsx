import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
import { gsap } from "gsap";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Use ref to target the menu

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  
    // GSAP animation for opening/closing the menu
    if (!isOpen) {
      gsap.to(menuRef.current, { x: 0, duration: 0.5, ease: "power3.out" }); // Open from the right
    } else {
      gsap.to(menuRef.current, { x: "100%", duration: 0.5, ease: "power3.in" }); // Close back to the right
    }
  };

  return (
    <>
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Mobile Menu */}
      <div className="mobile-menu" ref={menuRef}>
        <Link to="/" className="logo-link" onClick={toggleMenu}>
          <svg
            className="img-logo"
            width="92"
            height="32"
            viewBox="0 0 92 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG content */}
          </svg>
        </Link>
        <Link to="/" onClick={toggleMenu} data-text="About Us">
          <span>About Us</span>
        </Link>
        <Link to="/services" onClick={toggleMenu} data-text="Services">
          <span>Services</span>
        </Link>
        <Link to="/projects" onClick={toggleMenu} data-text="Projects">
          <span>Projects</span>
        </Link>
        <Link to="/clients" onClick={toggleMenu} data-text="Clients">
          <span>Clients</span>
        </Link>
        <Link to="/join-us" onClick={toggleMenu} data-text="Join Us">
          <span>Join Us</span>
        </Link>
        <Link to="/contact" onClick={toggleMenu}>
          <button className="contact-button">Get in Touch</button>
        </Link>
      </div>
    </>
  );
};

export default MobileMenu;