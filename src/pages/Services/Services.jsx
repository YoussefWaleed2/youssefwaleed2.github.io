import { useEffect, useRef, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';
import * as THREE from 'three';
import './Services.css';
import { Environment, SpotLight, Points, PointMaterial } from '@react-three/drei';

function Stars({ count = 2000 }) {
  const pointsRef = useRef();
  const [positions] = useState(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 100, 
        Math.random() * 100 - 25,    
        (Math.random() - 0.3) * 100  
      );
    }
    return new Float32Array(positions);
  });

  // Animation for random movement and glow
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate points
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Add subtle random movement
        positions[i] += Math.sin(time + positions[i] * 0.1) * 0.02;
        positions[i + 1] += Math.cos(time + positions[i + 1] * 0.1) * 0.02;
        positions[i + 2] += Math.sin(time + positions[i + 2] * 0.1) * 0.02;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      
      pointsRef.current.material.size = 0.15 + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#8C7A32"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          vertexColors={false}
        />
      </Points>
      {/* Add a subtle ambient light for extra glow */}
      <pointLight color="#8C7A32" intensity={0.2} distance={100} decay={2} />
    </group>
  );
}

function Model({ modelRef, scrollProgress }) {
  const { scene } = useGLTF('/services/Vzbl hand.glb');
  const [entranceComplete, setEntranceComplete] = useState(false);
  
  // Set the model color and material properties
  useEffect(() => {
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
    
    // Initial position and scale
    scene.scale.set(0.3, 0.3, 0.3);
    scene.position.set(0, -100, 0); // Start much lower
    scene.rotation.y = Math.PI * 2; // Start with a full rotation
    
    // Create a timeline for coordinated animations
    const tl = gsap.timeline({
      delay: 0.5,
      ease: "power3.out",
      onComplete: () => setEntranceComplete(true)
    });

    // Add animations to timeline
    tl.to(scene.position, {
      y: -20,
      duration: 2.5,
      ease: "power4.out"
    })
    .to(scene.rotation, {
      y: Math.PI * 4,
      duration: 3,
      ease: "power2.out"
    }, "<"); // Start at the same time as position animation

    // Add a scale bounce effect
    tl.from(scene.scale, {
      x: 0.25,
      y: 0.25,
      z: 0.25,
      duration: 2,
      ease: "elastic.out(1, 0.3)"
    }, "<0.2"); // Start slightly after the main animation
  }, [scene]);

  // Update rotation and position based on scroll progress
  useEffect(() => {
    if (modelRef.current && entranceComplete) {
      // Rotation
      modelRef.current.rotation.y = scrollProgress * Math.PI * 4;
      modelRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.2;
      
      // Position - move down as we scroll
      const startY = -20;
      const endY = -35;
      modelRef.current.position.y = startY + (endY - startY) * scrollProgress;
      
      // Z-axis movement - move closer and further
      const startZ = 0;
      const endZ = -30;
      modelRef.current.position.z = startZ + (endZ - startZ) * Math.sin(scrollProgress * Math.PI);
    }
  }, [scrollProgress, modelRef, entranceComplete]);

  return <primitive object={scene} ref={modelRef} />;
}

const Services = () => {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Scroll handler
    function raf(time) {
      lenis.raf(time);
      
      // Calculate scroll progress (0 to 1)
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = Math.min(currentScroll / scrollHeight, 1);
      setScrollProgress(progress);
      
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="services-container" ref={containerRef}>
      <div className="services-content">
        <h1>SERVICES</h1>
      </div>
      <div className="model-container">
        <Canvas
          camera={{ position: [0, 0, 75], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ alpha: true }}
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
          
          {/* Background stars */}
          <Stars />
          
          <Model modelRef={modelRef} scrollProgress={scrollProgress} />
        </Canvas>
      </div>
      
      <div className="services-sections">
        <section className="service-section">
          <div className="service-number">01.</div>
          <h2 className="service-title">BRANDING</h2>
          <p className="service-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="service-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </section>

        <section className="service-section">
          <div className="service-number">02.</div>
          <h2 className="service-title">SOCIAL MEDIA</h2>
          <p className="service-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="service-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </section>

        <section className="service-section">
          <div className="service-number">03.</div>
          <h2 className="service-title">MEDIA PRODUCTION</h2>
          <p className="service-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="service-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </section>

        <section className="service-section">
          <div className="service-number">04.</div>
          <h2 className="service-title">PACKAGING</h2>
          <p className="service-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="service-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Services;
