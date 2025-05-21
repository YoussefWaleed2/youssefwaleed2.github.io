"use client";
import "./Menu.css";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import CustomEase from "gsap/dist/CustomEase";
import { Link } from "react-router-dom";

const MobileMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  
  // Check if we're on a single project page
  const isSingleProjectPage = pathname.includes('/projects/') || pathname.includes('/project/');
  // Extract category from URL if on single project page
  const category = isSingleProjectPage ? pathname.split('/')[2] : '';

  const navRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuOverlayBarRef = useRef(null);
  const menuOpenBtnRef = useRef(null);
  const menuCloseBtnRef = useRef(null);

  function slideInOut() {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "scale(1)",
        },
        {
          opacity: 0.4,
          transform: "scale(0.5)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  // Helper function to reset all menu elements to their initial state
  const resetMenuElements = () => {
    // Reset menu overlay
    if (menuOverlayRef.current) {
      gsap.set(menuOverlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        top: "-100vh",
        pointerEvents: "none",
        opacity: 1,
        scale: 1,
        zIndex: "auto"
      });
    }

    // Reset menu links
    const menuLinks = document.querySelectorAll(".menu-link a");
    if (menuLinks.length > 0) {
      gsap.set(menuLinks, { y: "120%" });
    }

    // Reset overlay elements
    const overlayBarLink = menuOverlayBarRef.current?.querySelector("a");
    const closeBtnText = menuCloseBtnRef.current?.querySelector("svg");
    if (overlayBarLink) gsap.set(overlayBarLink, { y: 40 });
    if (closeBtnText) gsap.set(closeBtnText, { y: 50 });

    // Reset nav elements
    const navLink = navRef.current?.querySelector("a");
    const menuOpenText = menuOpenBtnRef.current?.querySelector("svg");
    if (navLink) gsap.set(navLink, { y: 0 });
    if (menuOpenText) gsap.set(menuOpenText, { y: 0 });

    // Ensure nav and menu open button are interactive
    if (navRef.current) {
      gsap.set(navRef.current, { 
        pointerEvents: "all",
        opacity: 1
      });
    }
    
    if (menuOpenBtnRef.current) {
      gsap.set(menuOpenBtnRef.current, {
        pointerEvents: "auto",
        cursor: "pointer",
        opacity: 1
      });
    }
  };

  const handleCloseMenu = () => {
    if (
      !menuOverlayBarRef.current ||
      !menuCloseBtnRef.current ||
      !navRef.current ||
      !menuOpenBtnRef.current ||
      !menuOverlayRef.current
    ) {
      console.log("Some refs are missing");
      return;
    }

    // Check if elements exist before animating
    const overlayBarLink = menuOverlayBarRef.current.querySelector("a");
    const closeBtnText = menuCloseBtnRef.current.querySelector("svg");
    
    const elementsToAnimate = [];
    if (overlayBarLink) elementsToAnimate.push(overlayBarLink);
    if (closeBtnText) elementsToAnimate.push(closeBtnText);
    
    if (elementsToAnimate.length > 0) {
      gsap.to(elementsToAnimate, {
        y: -100,
        duration: 1.2,
        stagger: 0.1,
        ease: CustomEase.create("", ".76,0,.2,1"),
      });
    }

    // Animate menu links
    const menuLinks = document.querySelectorAll(".menu-link a");
    if (menuLinks.length > 0) {
      gsap.to(menuLinks, {
        y: "-100%",
        duration: 0.75,
        stagger: 0.05,
        ease: "power4.in",
        onComplete: () => {
          menuLinks.forEach(link => {
            gsap.set(link, { y: "120%" });
          });
        },
      });
    }

    // Animate menu overlay
    gsap.to(menuOverlayRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      delay: 0.5,
      ease: CustomEase.create("", ".76,0,.2,1"),
      onComplete: () => {
        // Reset all menu elements to initial state
        resetMenuElements();
      },
    });

    // Animate nav elements
    const navLink = navRef.current.querySelector("a");
    const menuOpenText = menuOpenBtnRef.current.querySelector("svg");
    
    const navElements = [];
    if (navLink) navElements.push(navLink);
    if (menuOpenText) navElements.push(menuOpenText);
    
    if (navElements.length > 0) {
      gsap.to(navElements, {
        y: 0,
        duration: 1,
        stagger: 0.1,
        delay: 0.5,
        ease: CustomEase.create("", ".76,0,.2,1"),
      });
    }
  };

  const handleCloseMenuForNavigation = () => {
    if (
      !menuOverlayBarRef.current ||
      !menuCloseBtnRef.current ||
      !navRef.current ||
      !menuOpenBtnRef.current ||
      !menuOverlayRef.current
    ) {
      console.log("Some refs are missing for navigation close");
      return;
    }

    // Ensure open button is clickable immediately
    if (navRef.current) {
      gsap.set(navRef.current, { 
        pointerEvents: "all",
        opacity: 1
      });
    }
    
    if (menuOpenBtnRef.current) {
      gsap.set(menuOpenBtnRef.current, {
        pointerEvents: "auto",
        cursor: "pointer",
        opacity: 1
      });
    }

    // Check if elements exist before animating
    const overlayBarLink = menuOverlayBarRef.current.querySelector("a");
    const closeBtnText = menuCloseBtnRef.current.querySelector("svg");
    
    const elementsToAnimate = [];
    if (overlayBarLink) elementsToAnimate.push(overlayBarLink);
    if (closeBtnText) elementsToAnimate.push(closeBtnText);
    
    if (elementsToAnimate.length > 0) {
      gsap.to(elementsToAnimate, {
        y: -100,
        duration: 1, // Changed from 0.5 to 1 to match the menu overlay animation
        stagger: 0.05,
        ease: CustomEase.create("", ".76,0,.2,1"),
      });
    }

    // Animate menu links
    const menuLinks = document.querySelectorAll(".menu-link a");
    if (menuLinks.length > 0) {
      gsap.to(menuLinks, {
        y: "-10000%",
        duration: 1, // Changed from 0.5 to 1 to match the overlay animation
        stagger: 0.05,
        ease: "power4.in"
      });
    }

    // Immediately make the menu overlay non-interactive
    if (menuOverlayRef.current) {
      gsap.set(menuOverlayRef.current, {
        pointerEvents: "none"
      });
    }

    // Animate menu overlay
    gsap.to(menuOverlayRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1, // Changed from 0.5 to 1
      ease: CustomEase.create("", ".76,0,.2,1"),
      onComplete: () => {
        // Reset all menu elements to initial state
        resetMenuElements();
        
        // Add a slight delay to ensure everything is reset
        setTimeout(() => {
          resetMenuElements();
        }, 200);
      },
    });
  };

  const handleOpenMenu = () => {
    if (
      !navRef.current ||
      !menuOpenBtnRef.current ||
      !menuOverlayRef.current ||
      !menuOverlayBarRef.current ||
      !menuCloseBtnRef.current
    ) {
      console.log("Some refs are missing");
      return;
    }

    // First reset all elements to ensure we start from a clean state
    resetMenuElements();

    // Check if elements exist before animating
    const navLink = navRef.current.querySelector("a");
    const menuOpenText = menuOpenBtnRef.current.querySelector("svg");
    
    if (navLink && menuOpenText) {
      gsap.to(
        [navLink, menuOpenText],
        {
          y: -20,
          duration: 1,
          stagger: 0.1,
          ease: CustomEase.create("", ".76,0,.2,1"),
          onComplete: () => {
            if (navLink) gsap.set(navLink, { y: 20 });
            if (menuOpenText) gsap.set(menuOpenText, { y: 20 });
          },
        }
      );
    }

    // Set top to 0 to bring overlay into view
    gsap.set(menuOverlayRef.current, { top: 0 });

    // Set initial positions for menu links
    const menuLinks = document.querySelectorAll(".menu-link a");
    if (menuLinks.length > 0) {
      gsap.set(menuLinks, { y: "120%" });
    }

    // Set initial positions for overlay elements
    const overlayBarLink = menuOverlayBarRef.current.querySelector("a");
    const closeBtnText = menuCloseBtnRef.current.querySelector("svg");
    if (overlayBarLink) gsap.set(overlayBarLink, { y: 40 });
    if (closeBtnText) gsap.set(closeBtnText, { y: 50 });

    // Animate the menu overlay
    gsap.to(menuOverlayRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: CustomEase.create("", ".76,0,.2,1"),
      onComplete: () => {
        if (navRef.current) gsap.set(navRef.current, { pointerEvents: "none" });
        if (menuOverlayRef.current) gsap.set(menuOverlayRef.current, { pointerEvents: "all" });
      },
    });

    // Animate menu links
    if (menuLinks.length > 0) {
      gsap.to(menuLinks, {
        y: "-5%",
        duration: 1,
        stagger: 0.1,
        delay: 0.5,
        ease: "power3.out",
      });
    }

    // Animate overlay elements
    const elementsToAnimate = [];
    if (overlayBarLink) elementsToAnimate.push(overlayBarLink);
    if (closeBtnText) elementsToAnimate.push(closeBtnText);
    
    if (elementsToAnimate.length > 0) {
      gsap.to(elementsToAnimate, {
        y: 0,
        duration: 1,
        stagger: 0.1,
        delay: 0.5,
        ease: CustomEase.create("", ".76,0,.2,1"),
      });
    }
  };

  useEffect(() => {
    gsap.registerPlugin(CustomEase);

    // Initialize by resetting all menu elements
    resetMenuElements();

    // Save references to the current DOM elements
    const openBtn = menuOpenBtnRef.current;
    const closeBtn = menuCloseBtnRef.current;

    if (openBtn) {
      openBtn.addEventListener("click", handleOpenMenu);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", handleCloseMenu);
    }

    // Listen for route changes
    const handleRouteChange = () => {
      handleCloseMenuForNavigation();
    };

    // Add event listener for route changes
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      if (openBtn) {
        openBtn.removeEventListener("click", handleOpenMenu);
      }

      if (closeBtn) {
        closeBtn.removeEventListener("click", handleCloseMenu);
      }

      // Remove event listener for route changes
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleNavigation = (e, path) => {
    e.preventDefault();

    if (pathname === path) {
      handleCloseMenu();
      return;
    }

    handleCloseMenuForNavigation();
    
    // Adjust navigation delay to account for the longer animation duration
    setTimeout(() => {
      navigate(path);
      slideInOut();
      
      // Reset menu elements after navigation
      setTimeout(resetMenuElements, 100);
    }, 500); // Increased from 300 to 500 to account for longer animation
  };

  return (
    <>
      <nav ref={navRef}>
        <div className="menu-toggle-open" ref={menuOpenBtnRef} onClick={handleOpenMenu}>
          <svg className="open-btn" width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7H21" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M9.49023 12H21.0002" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3 12H5.99" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3 17H21" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </nav>

      <div className="menu-overlay" ref={menuOverlayRef}>
        <div className="menu-overlay-bar" ref={menuOverlayBarRef}>
          <div className="logo">
          </div>
          <div className="menu-toggle-close" ref={menuCloseBtnRef} onClick={handleCloseMenu}>
            <svg className="close-btn" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.9902 10.0099L14.8302 9.16992" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.16992 14.8301L11.9199 12.0801" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.8299 14.8299L9.16992 9.16992" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 6C2.75 7.67 2 9.75 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C10.57 2 9.2 2.3 7.97 2.85" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="menu-links">
          <div className="menu-link">
            <Link to="/" onClick={(e) => handleNavigation(e, "/")}>
              <h1>Home</h1>
            </Link>
          </div>
          <div className="menu-link">
            <Link to="/about" onClick={(e) => handleNavigation(e, "/about")}>
              <h1>About Us</h1>
            </Link>
          </div>
          <div className="menu-link">
            <Link to="/services" onClick={(e) => handleNavigation(e, "/services")}>
              <h1>Services</h1>
            </Link>
          </div>
          {isSingleProjectPage && (
            <div className="menu-link back-to-projects-menu-link">
              <Link to={`/all-projects/${category}`} onClick={(e) => handleNavigation(e, `/all-projects/${category}`)}>
                <h1>Back to Projects</h1>
              </Link>
            </div>
          )}
          <div className="menu-link">
            <Link to="/projects" onClick={(e) => handleNavigation(e, "/projects")}>
              <h1>Projects</h1>
            </Link>
          </div>
          <div className="menu-link">
            <Link to="/contact" onClick={(e) => handleNavigation(e, "/contact")}>
              <h1>Get In Touch</h1>
            </Link>
          </div>
          <div className="menu-link">
            <Link to="/join-us" onClick={(e) => handleNavigation(e, "/join-us")}>
              <h1>Join Us</h1>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;