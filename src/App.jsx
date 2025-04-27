import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Menu from "./components/Menu/Menu";

// Direct imports instead of lazy loading
import Home from "./pages/Home/Home";
import Work from "./pages/Join Us/Work";
import Project from "./pages/Project/Projects";
import About from "./pages/About Us/About";
import Contact from "./pages/Get In Touch/Contact";
import Services from "./pages/Services/Services";
import AllProjects from "./pages/All-Projects/All-Projects";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1400);
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();

  return (
    <>
      <Menu />
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/join-us" element={<Work />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/all-projects/:category" element={<AllProjects />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
