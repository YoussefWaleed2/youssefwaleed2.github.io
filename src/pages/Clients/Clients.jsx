import React, { useEffect, useRef } from "react";
import "./Clients.css";
import ReactLenis from "lenis/react";
import Transition from "../../components/Transition/Transition";
import ParallaxImage from "../../components/ParallaxImage/ParallaxImage";
import gsap from "gsap";
import SplitType from "split-type";
import Footer from "../../components/Footer/Footer";
import { handleOverlay } from "../../utils/overlayManager";

const ClientData = [
  {
    id: 1,
    name: "Aurora Studios",
    description: "Brand identity and digital marketing for a creative production company.",
    image: "/Clients/1.webp"
  },
  {
    id: 2,
    name: "Zenith Technologies",
    description: "Website redesign and UX optimization for tech innovation firm.",
    image: "/Clients/2.webp"
  },
  {
    id: 3,
    name: "Bloom & Harvest",
    description: "Full rebrand and packaging design for organic food brand.",
    image: "/Clients/3.webp"
  },
  {
    id: 4,
    name: "Elevation Athletics",
    description: "Social media strategy and content creation for sportswear brand.",
    image: "/Clients/4.webp"
  },
  {
    id: 5,
    name: "Luminous Interiors",
    description: "Brand identity and print collateral for luxury interior design studio.",
    image: "/Clients/5.webp"
  },
  {
    id: 6,
    name: "Pinnacle Financial",
    description: "Website development and digital strategy for investment firm.",
    image: "/Clients/6.webp"
  },
  {
    id: 7,
    name: "Nebula Cosmetics",
    description: "Product packaging design and campaign strategy for beauty brand.",
    image: "/Clients/7.webp"
  },
  {
    id: 8,
    name: "Horizon Hospitality",
    description: "Brand strategy and visual identity for boutique hotel chain.",
    image: "/Clients/8.webp"
  },
  {
    id: 9,
    name: "Pulse Media Group",
    description: "Digital platform design and development for media conglomerate.",
    image: "/Clients/9.webp"
  },
  {
    id: 10,
    name: "Verdant Ventures",
    description: "Brand identity and investor materials for sustainable investment fund.",
    image: "/Clients/10.webp"
  },
  {
    id: 11,
    name: "Sapphire Solutions",
    description: "Website redesign and digital transformation strategy for consulting firm.",
    image: "/Clients/11.webp"
  },
  {
    id: 12,
    name: "Cascade Collective",
    description: "Brand identity and packaging for artisanal beverage company.",
    image: "/Clients/12.webp"
  },
  {
    id: 13,
    image: "/Clients/13.webp"
  },
  {
    id: 14,
    image: "/Clients/14.webp"
  },
  {
    id: 15,
    image: "/Clients/15.webp"
  },
  {
    id: 16,
    image: "/Clients/16.webp"
  },
  {
    id: 17,
    image: "/Clients/17.webp"
  }
];

// Separate the clients into two groups
const regularClients = ClientData.slice(0, 12);
const specialClients = ClientData.slice(12);

const Clients = () => {
  const titleRef = useRef(null);
  const clientRefs = useRef([]);
  const specialClientsRef = useRef(null);

  // Set page title
  useEffect(() => {
    document.title = "Our Clients | VZBL";
  }, []);

  // Animation setup
  useEffect(() => {
    // Initialize refs
    clientRefs.current = clientRefs.current.slice(0, regularClients.length);

    // Set initial opacity to ensure visibility
    if (titleRef.current) {
      gsap.set(titleRef.current, { opacity: 1 });
    }
    
    clientRefs.current.forEach((ref) => {
      if (ref) {
        gsap.set(ref, { opacity: 1 });
      }
    });
    
    if (specialClientsRef.current) {
      gsap.set(specialClientsRef.current, { opacity: 1 });
    }

    // Split text for animation
    if (titleRef.current) {
      const titleSplit = new SplitType(titleRef.current, { types: 'chars' });
      
      // Animate title
      gsap.from(titleSplit.chars, {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: "power4.out",
        delay: 0.5,
        onComplete: () => {
          // Ensure all characters are visible after animation
          gsap.set(titleSplit.chars, { opacity: 1 });
        }
      });
    }

    // Animate client items
    gsap.from(clientRefs.current, {
      opacity: 1, // Start from higher opacity
      y: 100,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.8
    });
  }, []);

  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  // Assign refs to client items
  const setClientRef = (el, i) => {
    if (clientRefs.current.length <= i) {
      clientRefs.current[i] = el;
    } else {
      clientRefs.current[i] = el;
    }
  };

  return (
    <ReactLenis root options={{ duration: 1.2 }}>
      <div className="page clients">
        <h1 ref={titleRef} className="clients-title">Our Clients</h1>
        
        <div className="clients-intro">
          <p>We've had the privilege of working with outstanding brands across industries, helping them achieve their business goals through strategic design and innovative solutions.</p>
        </div>
        
        {/* Regular clients in grid layout */}
        <div className="clients-grid">
          {regularClients.map((client, index) => (
            <div 
              key={client.id} 
              className={`client-item ${index % 2 === 0 ? 'left' : 'right'}`}
              ref={(el) => setClientRef(el, index)}
            >
              <div className="client-image-container">
                <ParallaxImage 
                  src={client.image} 
                  alt={client.name}
                  speed={0.15}
                />
              </div>
              <div className="client-content">
                <h2 className="client-name">{client.name}</h2>
                <p className="client-description">{client.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Special clients in horizontal expandable row */}
        <div className="special-clients-section">
          <h2 className="special-clients-title">Featured Collaborations</h2>
          
          <div className="client-images-container" ref={specialClientsRef}>
            <div className="client-images-row">
              {specialClients.map((client, index) => (
                <div 
                  key={client.id} 
                  className="client-image-box"
                >
                  <div className="client-image-inner">
                    <img 
                      src={client.image} 
                      alt={`Client ${client.id}`}
                      className="client-img"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="clients-footer">
          <h2>Ready to Join Our Client List?</h2>
          <p>Let's create something amazing together.</p>
          <a href="/contact" className="contact-button">Get In Touch</a>
        </div>
      </div>
       <Footer /> 
    </ReactLenis>
  );
};

export default Transition(Clients);
