import { useEffect, useRef, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';
import * as THREE from 'three';
import './Services.css';
import { Environment, SpotLight } from '@react-three/drei';
import Transition from '../../components/Transition/Transition';
import { handleOverlay } from '../../utils/overlayManager';

function Model({ modelRef, scrollProgress, isLeftHand = true, onEntranceComplete }) {
  const { scene } = useGLTF('/services/Vzbl hand.glb');
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const initialRotation = useRef(isLeftHand ? Math.PI * 0.5 : Math.PI * 1.5);
  const currentPosition = useRef({ x: 0, y: 0, z: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const animationInProgress = useRef(false);
  const { viewport } = useThree();
  
  // Calculate responsive scaling factor based on viewport size
  const scaleFactor = useMemo(() => {
    // Base scale is 0.3
    const baseScale = 0.3;
    
    // For smaller screens, reduce the scale
    if (viewport.width < 5) { // Equivalent to ~768px
      return baseScale * 0.7;
    } else if (viewport.width < 8) { // Equivalent to ~1200px
      return baseScale * 0.85;
    }
    
    return baseScale;
  }, [viewport.width]);
  
  // Set the model color and material properties
  useEffect(() => {
    // Make the model invisible initially
    scene.visible = false;
    
    scene.traverse((child) => {
      if (child.isMesh) {
        const shinyMaterial = new THREE.MeshPhysicalMaterial({
          color: '#383014',
          metalness: 0.9,
          roughness: 0.1,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
          reflectivity: 0.7,
          envMapIntensity: 1
        });
        child.material = shinyMaterial;
      }
    });
    
    // Initial scale - using responsive scaleFactor
    scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
    
    // Set initial position based on which hand it is and viewport size
    const startX = isLeftHand ? -50 : 50; // Start from left or right
    scene.position.set(startX, -100, 0);
    scene.rotation.y = Math.PI * 2; // Start with a full rotation
    
    // Store initial position for smooth transition
    currentPosition.current = {
      x: startX,
      y: -100,
      z: 0
    };
    
    currentRotation.current = {
      x: 0,
      y: Math.PI * 2
    };

    // Mark the model as ready
    setIsReady(true);
    
    // Calculate responsive position adjustments based on viewport width
    const calculateResponsivePosition = () => {
      // Base positions
      let xPos = isLeftHand ? -30 : 30;
      let yPos = -35;
      
      // Adjust for smaller screens
      if (viewport.width < 5) { // Mobile
        xPos = isLeftHand ? -20 : 20;
        yPos = -25;
      } else if (viewport.width < 8) { // Tablet
        xPos = isLeftHand ? -25 : 25;
        yPos = -30;
      }
      
      return { x: xPos, y: yPos };
    };
    
    const responsivePosition = calculateResponsivePosition();
    
    // Create a timeline for coordinated animations
    const tl = gsap.timeline({
      delay: 0.5,
      ease: "power1.out",
      onStart: () => {
        // Make the model visible when animation starts
        scene.visible = true;
      },
      onComplete: () => {
        setEntranceComplete(true);
        // Store the final rotation after entrance animation
        initialRotation.current = scene.rotation.y;
        
        // Update current position and rotation to match the final entrance position
        currentPosition.current = {
          x: scene.position.x,
          y: scene.position.y,
          z: scene.position.z
        };
        
        currentRotation.current = {
          x: scene.rotation.x,
          y: scene.rotation.y
        };
        
        // Mark that entrance animation is complete
        animationInProgress.current = false;
        
        // Notify parent component that entrance animation is complete
        if (onEntranceComplete) {
          onEntranceComplete();
        }
      }
    });

    // Add animations to timeline with responsive positions
    tl.to(scene.position, {
      x: responsivePosition.x, // Responsive x position
      y: responsivePosition.y, // Responsive y position
      z: 0,
      duration: 3.5,
      ease: "power2.out"
    })
    .to(scene.rotation, {
      y: isLeftHand ? Math.PI * 0.5 : Math.PI * 1.5, // Rotate to face the section
      duration: 4,
      ease: "power1.out"
    }, "<"); // Start at the same time as position animation

    // Add a scale bounce effect
    tl.from(scene.scale, {
      x: scaleFactor * 0.8,
      y: scaleFactor * 0.8,
      z: scaleFactor * 0.8,
      duration: 3,
      ease: "elastic.out(1, 0.2)"
    }, "<0.3"); // Start slightly after the main animation
  }, [scene, isLeftHand, scaleFactor, viewport.width]);

  // Update rotation and position based on scroll progress
  useEffect(() => {
    if (modelRef.current && entranceComplete) {
      // Calculate section progress (0-1 for each section)
      const sectionCount = 3; // Total number of sections
      const sectionProgress = (scrollProgress * sectionCount) % 1;
      const currentSection = Math.floor(scrollProgress * sectionCount);
      
      // Determine if we're in an even or odd section
      const isEvenSection = currentSection % 2 === 0;
      
      // Calculate responsive movement range based on viewport width
      const calculateMovementRange = () => {
        // Base range
        let range = 60;
        
        // Adjust for smaller screens
        if (viewport.width < 5) { // Mobile
          range = 35;
        } else if (viewport.width < 8) { // Tablet
          range = 45;
        }
        
        return range;
      };
      
      const movementRange = calculateMovementRange();
      
      // Calculate horizontal movement (zigzag pattern)
      let targetX;
      if (isLeftHand) {
        // Left hand moves from left to right in odd sections, right to left in even sections
        targetX = isEvenSection 
          ? -30 + (sectionProgress * movementRange) // Move from left to right
          : 30 - (sectionProgress * movementRange); // Move from right to left
      } else {
        // Right hand moves from right to left in odd sections, left to right in even sections
        targetX = isEvenSection 
          ? 30 - (sectionProgress * movementRange) // Move from right to left
          : -30 + (sectionProgress * movementRange); // Move from left to right
      }
      
      // Calculate target positions
      const startY = -35; // Match the entrance position
      const endY = -30; // Reduced from -50 to -45 to make the hand end higher
      const targetY = startY + (endY - startY) * scrollProgress;
      
      // Z-axis movement (move closer and further)
      const startZ = 0;
      const endZ = -30;
      const targetZ = startZ + (endZ - startZ) * Math.sin(scrollProgress * Math.PI);

      // Calculate target rotations - SLOWED DOWN ROTATION
      const rotationDirection = isLeftHand ? 1 : -1;
      // Reduced from Math.PI * 4 to Math.PI * 2 for slower rotation
      const targetRotationY = initialRotation.current + (scrollProgress * Math.PI * 2 * rotationDirection);
      const targetRotationX = Math.sin(scrollProgress * Math.PI) * 0.1;

      // Apply smooth easing - INCREASED SMOOTHNESS
      const easing = 0.03; // Reduced from 0.05 to 0.03 for slower movement

      // Position easing
      currentPosition.current.x += (targetX - currentPosition.current.x) * easing;
      currentPosition.current.y += (targetY - currentPosition.current.y) * easing;
      currentPosition.current.z += (targetZ - currentPosition.current.z) * easing;

      // Apply smoothed positions
      modelRef.current.position.x = currentPosition.current.x;
      modelRef.current.position.y = currentPosition.current.y;
      modelRef.current.position.z = currentPosition.current.z;

      // Rotation easing
      let rotationDiffY = targetRotationY - currentRotation.current.y;
      // Normalize rotation difference
      if (Math.abs(rotationDiffY) > Math.PI) {
        rotationDiffY = rotationDiffY > 0 
          ? rotationDiffY - Math.PI * 2 
          : rotationDiffY + Math.PI * 2;
      }
      currentRotation.current.y += rotationDiffY * easing;
      currentRotation.current.x += (targetRotationX - currentRotation.current.x) * easing;

      // Apply smoothed rotations
      modelRef.current.rotation.y = currentRotation.current.y;
      modelRef.current.rotation.x = currentRotation.current.x;
    }
  }, [scrollProgress, modelRef, entranceComplete, isLeftHand, viewport.width]);

  return isReady ? <primitive object={scene} ref={modelRef} /> : null;
}

const Services = () => {
  const containerRef = useRef(null);
  const leftHandRef = useRef(null);
  const rightHandRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const titleRef = useRef(null);
  const sectionsRef = useRef(null);
  const navRef = useRef(null);
  const lenisRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle entrance animation completion
  const handleEntranceComplete = () => {
    console.log("Entrance animation complete, enabling scrolling");
    setEntranceComplete(true);
  };

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    
    lenisRef.current = lenis;
    
    // Initially stop scrolling until entrance animation completes
    lenis.stop();
    
    // Scroll handler
    function raf(time) {
      lenis.raf(time);
      
      // Only calculate scroll progress if entrance animation is complete
      if (entranceComplete) {
        // Calculate scroll progress (0 to 1)
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const progress = Math.min(currentScroll / scrollHeight, 1);
        setScrollProgress(progress);
      }
      
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, [entranceComplete]);

  // Enable scrolling when entrance animation completes
  useEffect(() => {
    if (entranceComplete && lenisRef.current) {
      console.log("Starting Lenis scroll");
      lenisRef.current.start();
    }
  }, [entranceComplete]);

  // Animation sequence
  useEffect(() => {
    if (canvasLoaded) {
      const timeline = gsap.timeline();
      
      // Hide loader
      timeline.to('.loader', {
        opacity: 0,
        duration: 0.5,
        onComplete: () => setIsLoading(false)
      });

      // Reveal navigation
      const nav = document.querySelector('nav');
      if (nav) {
        nav.classList.add('nav-reveal');
        timeline.add(() => {
          nav.classList.add('visible');
        }, "+=0.3");
      }

      // Reveal services title
      timeline.add(() => {
        const servicesContent = document.querySelector('.services-content');
        if (servicesContent) {
          servicesContent.classList.add('visible');
        }
      }, "+=0.5");

      // Start hand entrance animation
      timeline.add(() => {
        // Hand animation is already set up in the Model component
        // It will start automatically when the component mounts
      }, "+=0.3");

      // Reveal sections one by one
      const sections = document.querySelectorAll('.service-section');
      sections.forEach((section, index) => {
        timeline.add(() => {
          section.classList.add('visible');
        }, `+=0.2`);
      });
    }
  }, [canvasLoaded]);

  useEffect(() => {
    handleOverlay();
    return () => handleOverlay();
  }, []);

  return (
    <div className="services-container" ref={containerRef}>
      {isLoading && <div className="loader" />}
      
      <div className="services-content">
        <h1>SERVICES</h1>
      </div>

      <div className="model-container">
        <Canvas
          camera={{ position: [0, 0, 75], fov: isMobile ? 60 : 45 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ alpha: true }}
          onCreated={() => setCanvasLoaded(true)}
        >
          <color attach="background" args={['#000000']} />
          
          {/* Environment and lighting for shine */}
          <ambientLight intensity={0.3} />
          <Environment preset="studio" />
          
          {/* Gold spotlight */}
          <SpotLight
            position={[0, 15, 25]}
            angle={0.5}
            penumbra={0.5}
            intensity={15}
            color="#8C7A32"
            distance={50}
            volumetric
            opacity={0.8}
            attenuation={2}
            anglePower={3}
          />
          
          {/* Left hand */}
          {canvasLoaded && !isLoading && (
            <Model 
              modelRef={leftHandRef} 
              scrollProgress={scrollProgress} 
              isLeftHand={true}
              onEntranceComplete={handleEntranceComplete}
            />
          )}
          
          {/* Right hand */}
          {canvasLoaded && !isLoading && (
            <Model 
              modelRef={rightHandRef} 
              scrollProgress={scrollProgress} 
              isLeftHand={false}
              onEntranceComplete={handleEntranceComplete}
            />
          )}
        </Canvas>
      </div>
      
      <div className="services-sections" ref={sectionsRef}>
        <section className="service-section">
          <div className="service-number">01.</div>
          <h2 className="service-title">BRANDING</h2>
          <p className="service-description">
            Every brand has a story to tell, but sometimes, that story needs a fresh perspective.
          </p>
          <p className="service-description">
            Our rebranding process goes beyond just a new logo or color scheme; it's about uncovering the brand's essence and redefining how it connects with its audience.
          </p>
        </section>

        <section className="service-section">
          <div className="service-number">02.</div>
          <h2 className="service-title">SOCIAL MEDIA</h2>
          <p className="service-description">
            Every brand has a story to tell, but sometimes, that story needs a fresh perspective.
          </p>
          <p className="service-description">
            Our rebranding process goes beyond just a new logo or color scheme; it's about uncovering the brand's essence and redefining how it connects with its audience.
          </p>
        </section>

        <section className="service-section">
          <div className="service-number">03.</div>
          <h2 className="service-title">MEDIA PRODUCTION</h2>
          <p className="service-description">
            Every brand has a story to tell, but sometimes, that story needs a fresh perspective.
          </p>
          <p className="service-description">
            Our rebranding process goes beyond just a new logo or color scheme; it's about uncovering the brand's essence and redefining how it connects with its audience.
          </p>
        </section>

        <section className="service-section">
          <div className="service-number">04.</div>
          <h2 className="service-title">PACKAGING</h2>
          <p className="service-description">
            Every brand has a story to tell, but sometimes, that story needs a fresh perspective.
          </p>
          <p className="service-description">
            Our rebranding process goes beyond just a new logo or color scheme; it's about uncovering the brand's essence and redefining how it connects with its audience.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Transition(Services);