import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Menu from "./components/Menu/Menu";

// Direct imports instead of lazy loading
import Home from "./pages/Home/Home";
import Work from "./pages/Join Us/Work";
import Project from "./pages/Project/Projects";
import About from "./pages/About Us/About";
import FAQ from "./pages/Clients/FAQ";
import Contact from "./pages/Get In Touch/Contact";
import Services from "./pages/Services/Services";

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
          <Route path="/faq" element={<FAQ />} />
          <Route path="/work" element={<Work />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Project />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
