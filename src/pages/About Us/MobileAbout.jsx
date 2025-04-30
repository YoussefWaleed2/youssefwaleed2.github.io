import React, { useEffect, useRef } from 'react';
import Transition from '../../components/Transition/Transition';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from '../../components/Footer/Footer';
import './MobileAbout.css';

const MobileAbout = () => {
  const contentRef = useRef(null);
  const textRefs = useRef([]);
  const titleRefs = useRef([]);
  const imageRefs = useRef([]);

  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Add viewport meta tag for proper mobile rendering
  useEffect(() => {
    // Check if viewport meta exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    // If not, create one
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.getElementsByTagName('head')[0].appendChild(viewportMeta);
    }
    
    // Set content attribute with width=device-width
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }, []);

  // Animation for page content
  useEffect(() => {
    if (contentRef.current) {
      try {
        // Force layout recalculation before animation
        document.body.offsetHeight;
        
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power2.out",
            onComplete: () => {
              // Add a class to the body to indicate the page is loaded
              document.body.classList.add('about-page-loaded');
              
              // Now animate the main title with a slight delay
              const mainTitle = document.querySelector('.call-us-visible-title');
              const subtitle = document.querySelector('.call-us-visible-subtitle');
              
              if (mainTitle && subtitle) {
                gsap.fromTo(
                  mainTitle, 
                  { opacity: 0, y: 30 }, 
                  { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
                );
                
                gsap.fromTo(
                  subtitle, 
                  { opacity: 0, y: 20 }, 
                  { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 }
                );
              }
            }
          }
        );
      } catch (error) {
        console.error("Animation error:", error);
        // Still mark as loaded even if animation fails
        document.body.classList.add('about-page-loaded');
      }
    }
  }, []);

  // Create scroll animations for all text elements
  useEffect(() => {
    // Animate text paragraphs on scroll
    textRefs.current.forEach((textRef) => {
      if (textRef) {
        gsap.fromTo(
          textRef,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: textRef,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Animate section titles with stagger effect
    titleRefs.current.forEach((titleRef) => {
      if (titleRef) {
        const titleElements = titleRef.querySelectorAll('.heading-text');
        
        gsap.fromTo(
          titleElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6, 
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef,
              start: "top 75%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Animate images with subtle scale effect
    imageRefs.current.forEach((imageRef) => {
      if (imageRef) {
        gsap.fromTo(
          imageRef,
          { opacity: 0.7, scale: 1.05 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: imageRef,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
  }, []);

  // Ensure proper page setup for direct navigation
  useEffect(() => {
    // Set a proper document title
    document.title = "About Us | VZBL";
    
    // Force scrolling to the top
    window.scrollTo(0, 0);
    
    // Add class to body for page-specific styling
    document.body.classList.add('about-page-active');
    
    return () => {
      // Clean up class when component unmounts
      document.body.classList.remove('about-page-active');
      document.body.classList.remove('about-page-loaded');
    };
  }, []);

  // Fallback image
  const defaultImage = "/about/1.webp";
  
  // Helper function to get image path
  const getImage = (index) => {
    return `/about/${index + 1}.webp`;
  };

  // Handle image errors
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <div className="mobile-about dark-theme">
      <div className="mobile-about-content" ref={contentRef}>
        {/* Header with logo */}
        <div className="mobile-header">
         
        </div>
        
        {/* About The Hand Section */}
        <section className="section about-hand-section">
          <div className="call-us-visible-container">
            <div className="call-us-visible-bg">
              <img 
                src="/about/1.webp" 
                alt="Background" 
                className="bg-image" 
                onError={handleImageError}
                ref={el => imageRefs.current[0] = el}
              />
            </div>
            <h1 className="call-us-visible-title">
              CALL US<br />VISIBLE<span className="asterisk">*</span>
            </h1>
            <p className="call-us-visible-subtitle">(VIZ.Ə.BƏL)</p>
          </div>
          
          <div className="content-block left-aligned">
            <p 
              className="body-text animate-text" 
              ref={el => textRefs.current[0] = el}
            >
              VZBL IS ALL ABOUT BEING SEEN. IT'S THE FREQUENCY AT WHICH YOUR BRAND SHOWS UP, WHETHER IN SEARCH RESULTS, ON SOCIAL MEDIA, THROUGH EMAIL, OR ACROSS OTHER MARKETING CHANNELS. IT'S ABOUT MAKING YOUR BRAND IMPOSSIBLE TO IGNORE, GRABBING ATTENTION, AND BUILDING AN IDENTITY THAT STICKS.
            </p>
          </div>
          
          <div 
            className="section-title hand-title" 
            ref={el => titleRefs.current[0] = el}
          >
            <h2 className="heading-text">ABOUT</h2>
            <h2 className="heading-text script">The</h2>
            <h2 className="heading-text">HAND</h2>
          </div>
          
          <div className="about-hand-container">
            <div className="about-hand-bg">
              <img 
                src="/about/16.webp" 
                alt="Background" 
                className="about-hand-bg-image" 
                onError={handleImageError}
                ref={el => imageRefs.current[1] = el}
              />
            </div>
          </div>
          
          <div className="content-block hand-content">
            <p 
              className="body-text animate-text" 
              ref={el => textRefs.current[1] = el}
            >
              THE HAND IS MORE THAN A SYMBOL, IT PROMISES STRENGTH, CREATIVITY, AND UNITY. IT STANDS FOR OPENNESS AND THE ABILITY TO TRANSFORM IDEAS INTO ACTION. IT REFLECTS WHO WE ARE AND WHAT WE STAND FOR
            </p>
          </div>
        </section>
        
        {/* Since 2017 Section */}
        <section className="section since-section">
          <div className="since-container">
            <h3 
              className="subheading animate-text" 
              ref={el => textRefs.current[2] = el}
            >
              SINCE 2017
            </h3>
            <p 
              className="body-text centered animate-text" 
              ref={el => textRefs.current[3] = el}
            >
              A CREATIVE AGENCY BUILT TO DEFY THE ORDINARY.
              <br /><br />
              FROM BRANDING TO MEDIA PRODUCTION, WE DELIVER WORK THAT REVEALS THE UNSEEN.
              <br /><br />
              OUR APPROACH IS SIMPLE: THINK BOLD, CREATE SMART, AND OWN THE SPOTLIGHT WITH EVERY PROJECT.
            </p>
          </div>
        </section>
        
        {/* The Visionary Mind Section */}
        <section className="section team-section">
          <div 
            className="section-title right-aligned"
            ref={el => titleRefs.current[1] = el}
          >
            <h2 className="heading-text script">The</h2>
            <h2 className="heading-text">VISIONARY /////////MIND</h2>
          </div>
        </section>
        
        {/* About The Founder Section */}
        <section className="section founder-section">
          <div 
            className="section-title wide centered"
            ref={el => titleRefs.current[2] = el}
          >
            <h2 className="heading-text">ABOUT</h2>
            <h2 className="heading-text script">The</h2>
            <h2 className="heading-text">FOUNDER</h2>
          </div>
          
          <div className="team-member-container">
            <div className="team-image-box ">
              <img 
                src={getImage(14)} 
                alt="VZBL Founder"  
                onError={handleImageError}
                ref={el => imageRefs.current[2] = el}
              />
            </div>
            
            <div 
              className="section-title member-title"
              ref={el => titleRefs.current[7] = el}
            >
              <h2 className="heading-text">AHMED EL ZALAT</h2>
            </div>
            
            <div className="content-block centered-text">
              <p 
                className="body-text centered animate-text" 
                ref={el => textRefs.current[4] = el}
              >
                AHMED'S CURIOSITY IS HIS GREATEST STRENGTH. IT PUSHES HIM TO EXPLORE EVERY BRAND'S STORY AND UNCOVER WHAT OTHERS OFTEN OVERLOOK. HE LOOKS BEYOND THE SURFACE, FINDING HIDDEN INSIGHTS AND UNSPOKEN TRUTHS THAT HELP BRANDS CONNECT ON A DEEPER LEVEL. IT'S HIS ABILITY TO SEE WHAT'S UNSEEN THAT SETS HIM APART AND DRIVES HIS PASSION FOR MAKING BRANDS THAT TRULY STAND OUT.
              </p>
            </div>
          </div>
        </section>
        
        {/* Meet The Team Section */}
        <section className="section team-section">
          <div 
            className="section-title wide centered"
            ref={el => titleRefs.current[3] = el}
          >
            <h2 className="heading-text">MEET</h2>
            <h2 className="heading-text script">The</h2>
            <h2 className="heading-text">CCO</h2>
          </div>
          
          {/* Team Member 1: Ebraheim El Zeyoudi */}
          <div className="team-member-container">
            <div className="team-image-box member-image">
              <img 
                src="/about/19.webp" 
                alt="Ebraheim El Zeyoudi" 
                onError={handleImageError}
                ref={el => imageRefs.current[3] = el}
              />
            </div>
            <div 
              className="section-title member-title"
              ref={el => titleRefs.current[4] = el}
            >
             
              <h2 className="heading-text">EBRAHEIM EL ZEYOUDI</h2>
            </div>
            <div className="content-block member-text">
              <p 
                className="body-text animate-text" 
                ref={el => textRefs.current[6] = el}
              >
                EBRAHEIM EL ZEYOUDI IS THE VISIONARY CO-FOUNDER AND CHIEF 
                COMMERCIAL OFFICER (CCO) OF VZBL, THE LEADING CREATIVE 
                MARKETING AGENCY IN THE UAE AND EGYPT. WITH A DEEP 
                UNDERSTANDING OF BRAND POSITIONING AND COMMERCIAL GROWTH, 
                EBRAHEIM HAS PLAYED A PIVOTAL ROLE IN TRANSFORMING VZBL 
                INTO A POWERHOUSE THAT BRIDGES THE CREATIVE GAP IN THE 
                REGION'S MARKETING LANDSCAPE.
              </p>
            </div>
          </div>
          

          {/* Team Member 2: Shorouk Abdalla */}
          <div 
            className="section-title wide centered"
            ref={el => titleRefs.current[8] = el}
          >
            <h2 className="heading-text">MEET</h2>
            <h2 className="heading-text script">The</h2>
            <h2 className="heading-text">STRATEGIC PARTNER</h2>
          </div>
          <div className="team-member-container">
       
            <div className="team-image-box member-image">
              <img 
                src="/about/18.webp" 
                alt="Shorouk Abdalla" 
                onError={handleImageError}
                ref={el => imageRefs.current[4] = el}
              />
            </div>
            <div 
              className="section-title member-title"
              ref={el => titleRefs.current[5] = el}
            >
              
              <h2 className="heading-text">Shorouk Abdalla</h2>
            </div>
            <div className="content-block member-text">
              <p 
                className="body-text animate-text" 
                ref={el => textRefs.current[7] = el}
              >
                WITH A STRONG FOCUS ON BUSINESS DEVELOPMENT AND CREATIVE 
                STRATEGY, SHOUROUK HELPS CLIENTS REFINE THEIR BRAND POSITIONING 
                AND MARKET PRESENCE. AS A SEASONED RESTAURATEUR AND HOSPITALITY 
                CONSULTANT WITH SIX YEARS OF EXPERIENCE IN GLOBAL MARKETS, SHE 
                UNDERSTANDS THE CHALLENGES BUSINESSES FACE AND WORKS TO 
                HIGHLIGHT THEIR STRENGTHS AND UNIQUENESS, ENSURING THEY STAND 
                OUT IN A COMPETITIVE ECONOMY. THROUGH VZBL, SHE CRAFTS TAILORED 
                SOLUTIONS THAT DRIVE GROWTH, VISIBILITY, AND LASTING IMPACT.
              </p>
            </div>
          </div>
          
          {/* Team Member 3: Nourhan Nagy */}
          <div 
            className="section-title wide centered"
            ref={el => titleRefs.current[9] = el}
          >
            <h2 className="heading-text">MEET</h2>
            <h2 className="heading-text script">The</h2>
            <h2 className="heading-text">OPERATIONS MANAGER</h2>
          </div>
          <div className="team-member-container">
            <div className="team-image-box member-image">
              <img 
                src="/about/17.webp" 
                alt="Nourhan Nagy" 
                onError={handleImageError}
                ref={el => imageRefs.current[5] = el}
              />
            </div>
            <div 
              className="section-title member-title"
              ref={el => titleRefs.current[6] = el}
            >
              <h2 className="heading-text">Nourhan Nagy</h2>
            </div>
            <div className="content-block member-text">
              <p 
                className="body-text animate-text" 
                ref={el => textRefs.current[8] = el}
              >
                AT THE HEART OF VZBL'S OPERATIONS, NOURHAN IS THE FORCE THAT 
                KEEPS EVERYTHING MOVING. WITH A SHARP STRATEGIC MIND AND A 
                NATURAL INSTINCT FOR ORGANIZATION, SHE TURNS BIG IDEAS INTO 
                SEAMLESS EXECUTION AS SHE ENSURES EVERY PROJECT DOESN'T JUST 
                RUN SMOOTHLY BUT WITH PURPOSE, ALIGNING EVERY DETAIL WITH 
                VZBL'S VISION FROM THE FIRST SPARK OF AN IDEA TO THE FINAL 
                EXECUTION. HER ABILITY TO NAVIGATE HIGH-PRESSURE SITUATIONS 
                WITH CONFIDENCE AND EFFICIENCY MAKES HER AN ESSENTIAL DRIVER 
                OF VZBL'S SUCCESS.
              </p>
            </div>
          </div>
        </section>
        
        {/* Use the existing Footer component */}
        <Footer />
      </div>
    </div>
  );
};

// Export with Transition HOC with explicit settings
export default Transition(MobileAbout, {
  unmountDelay: 800,
  mountDelay: 300,
  appear: true,
}); 