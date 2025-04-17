import React from "react";
import "./FAQ.css";

import FAQContainer from "../../components/FAQContainer/FAQContainer";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";

import ReactLenis from "lenis/react";

import Transition from "../../components/Transition/Transition";

const FAQ = () => {
  return (
    <ReactLenis root>
      <div className="page faq">
        <FAQContainer />
        
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(FAQ);
