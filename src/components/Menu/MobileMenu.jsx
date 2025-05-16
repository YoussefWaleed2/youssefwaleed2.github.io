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

  const handleCloseMenu = (e) => {
    // Stop event propagation to prevent any conflicts
    if (e) e.stopPropagation();
    
    // Reset any SingleProject styles that might interfere with menu
    document.body.style.touchAction = '';
    document.body.classList.remove('single-project-page-active');
    document.body.classList.remove('dark-background');
    document.body.classList.remove('light-background');
    
    // Immediately hide menu visually for better UX
    if (menuOverlayRef.current) {
      // Add immediate visual feedback
      menuOverlayRef.current.style.opacity = "0.95";
    }

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
        y: -40,
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
        if (navRef.current) gsap.set(navRef.current, { pointerEvents: "all" });
        if (menuOverlayRef.current) {
          gsap.set(menuOverlayRef.current, {
            pointerEvents: "none",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            top: "-100vh",
            opacity: "1" // Reset opacity
          });
        }
        
        // Cleanup for SingleProject related styles
        document.body.style.backgroundColor = '';
        document.body.classList.remove('single-project-page-active');
        document.body.classList.remove('dark-background');
        document.body.classList.remove('light-background');
        document.body.style.touchAction = '';
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

  const handleOpenMenu = (e) => {
    // Stop event propagation to prevent any conflicts
    if (e) e.stopPropagation();

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

    // First reset the menu position
    gsap.set(menuOverlayRef.current, { top: 0 });

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
    const menuLinks = document.querySelectorAll(".menu-link a");
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
    const overlayBarLink = menuOverlayBarRef.current.querySelector("a");
    const closeBtnText = menuCloseBtnRef.current.querySelector("svg");
    
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

    // Save references to the current DOM elements
    const openBtn = menuOpenBtnRef.current;
    const closeBtn = menuCloseBtnRef.current;
    
    // Set initial menu state
    if (menuOverlayRef.current) {
      gsap.set(menuOverlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        top: "-100vh",
        pointerEvents: "none"
      });
    }

    const handleOpenMenuWrapper = (e) => {
      if (e) e.stopPropagation();
      handleOpenMenu();
    };

    const handleCloseMenuWrapper = (e) => {
      if (e) e.stopPropagation();
      handleCloseMenu(e);
    };

    if (openBtn) {
      openBtn.addEventListener("click", handleOpenMenuWrapper);
      // Add touch events for mobile
      openBtn.addEventListener("touchend", handleOpenMenuWrapper, { passive: false });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", handleCloseMenuWrapper);
      // Add touch events for mobile
      closeBtn.addEventListener("touchend", handleCloseMenuWrapper, { passive: false });
      
      // Add additional event listeners to ensure the close button works on mobile
      const svg = closeBtn.querySelector('svg');
      if (svg) {
        svg.addEventListener("click", handleCloseMenuWrapper);
        svg.addEventListener("touchend", handleCloseMenuWrapper, { passive: false });
        
        // Add click event listeners to all paths in the SVG
        const paths = svg.querySelectorAll('path');
        paths.forEach(path => {
          path.addEventListener("click", handleCloseMenuWrapper);
          path.addEventListener("touchend", handleCloseMenuWrapper, { passive: false });
        });
      }
    }

    // Listen for route changes
    const handleRouteChange = () => {
      handleCloseMenu();
    };

    // Add event listener for route changes
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      if (openBtn) {
        openBtn.removeEventListener("click", handleOpenMenuWrapper);
        openBtn.removeEventListener("touchend", handleOpenMenuWrapper);
      }

      if (closeBtn) {
        closeBtn.removeEventListener("click", handleCloseMenuWrapper);
        closeBtn.removeEventListener("touchend", handleCloseMenuWrapper);
        
        // Clean up additional event listeners
        const svg = closeBtn.querySelector('svg');
        if (svg) {
          svg.removeEventListener("click", handleCloseMenuWrapper);
          svg.removeEventListener("touchend", handleCloseMenuWrapper);
          
          // Remove click event listeners from all paths
          const paths = svg.querySelectorAll('path');
          paths.forEach(path => {
            path.removeEventListener("click", handleCloseMenuWrapper);
            path.removeEventListener("touchend", handleCloseMenuWrapper);
          });
        }
      }

      // Remove event listener for route changes
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleNavigation = (e, path) => {
    e.preventDefault();

    // If clicking on the active page link, just close the menu
    if (pathname === path) {
      handleCloseMenu();
      return;
    }

    // First, ensure the SingleProjects page cleans up
    // by resetting body styles that might block touch events
    document.body.style.touchAction = '';
    document.body.classList.remove('single-project-page-active');
    document.body.classList.remove('dark-background');
    document.body.classList.remove('light-background');
    
    // Next, manually reset the menu overlay styles to hide it immediately
    if (menuOverlayRef.current) {
      // Kill any active GSAP animations on menu elements first
      gsap.killTweensOf(menuOverlayRef.current);
      gsap.killTweensOf(document.querySelectorAll(".menu-link a"));
      
      // Remove the menu
      menuOverlayRef.current.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
      menuOverlayRef.current.style.top = "-100vh";
      menuOverlayRef.current.style.pointerEvents = "none";
    }
    
    // Ensure pointerEvents are reset on nav
    if (navRef.current) {
      navRef.current.style.pointerEvents = "all";
    }
    
    // Reset background color
    document.body.style.backgroundColor = '';
    
    // Finally, navigate after a small delay to ensure menu is gone
    setTimeout(() => {
      navigate(path);
      slideInOut();
    }, 50);
  };

  return (
    <>
      <nav ref={navRef}>
        <div className="menu-toggle-open" ref={menuOpenBtnRef} onClick={handleOpenMenu} style={{ 
          padding: "10px", 
          cursor: "pointer",
          touchAction: "manipulation"
        }}>
          <svg className="open-btn" width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7H21" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M9.49023 12H21.0002" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3 12H5.99" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3 17H21" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </nav>

      <div className="menu-overlay" ref={menuOverlayRef} style={{ 
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        top: "-100vh",
        pointerEvents: "none"
      }}>
        <div className="menu-overlay-bar" ref={menuOverlayBarRef}>
          <div className="logo">
          </div>
          <div className="menu-toggle-close" 
            ref={menuCloseBtnRef} 
            onClick={handleCloseMenu}
            style={{ 
              padding: "20px", 
              cursor: "pointer",
              touchAction: "auto",
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
              WebkitUserSelect: "none",
              position: "absolute",
              right: "10px",
              top: "10px",
              zIndex: "9999",
              transform: "translateZ(0)",
              background: "rgba(0,0,0,0.1)",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg className="close-btn" width="36" height="36" viewBox="0 0 24 24" fill="rgba(255,255,255,0.01)" xmlns="http://www.w3.org/2000/svg" style={{
              pointerEvents: "auto",
              touchAction: "auto"
            }}>
            <rect x="0" y="0" width="24" height="24" fill="rgba(255,255,255,0.01)" />
            <path d="M13.9902 10.0099L14.8302 9.16992" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.16992 14.8301L11.9199 12.0801" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.8299 14.8299L9.16992 9.16992" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 6C2.75 7.67 2 9.75 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C10.57 2 9.2 2.3 7.97 2.85" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="menu-links">
          <div className="menu-link">
            <Link to="/" onClick={(e) => handleNavigation(e, "/")} style={{ marginTop: "60px" }}>
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
