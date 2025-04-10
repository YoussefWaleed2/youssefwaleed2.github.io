<<<<<<< Updated upstream
import { motion } from "framer-motion";
import "./Transition.css";

const calculateRandomBlockDelay = (rowIndex, totalRows) => {
  const blockDelay = Math.random() * 0.5;
  const rowDelay = (totalRows - rowIndex - 1) * 0.05;
  return blockDelay + rowDelay;
};

const Transition = (Page) => {
  return () => (
    <>
      <Page />

      <div className="blocks-container transition-in">
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <div className="row" key={rowIndex}>
            {Array.from({ length: 11 }).map((_, blockIndex) => (
              <motion.div
                key={blockIndex}
                className="block"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 0 }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: calculateRandomBlockDelay(rowIndex, 10),
                }}
              ></motion.div>
            ))}
          </div>
        ))}
      </div>

      <div className="blocks-container transition-out">
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <div className="row" key={rowIndex}>
            {Array.from({ length: 11 }).map((_, blockIndex) => (
              <motion.div
                key={blockIndex}
                className="block"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: calculateRandomBlockDelay(rowIndex, 10),
                }}
              ></motion.div>
            ))}
          </div>
        ))}
      </div>
    </>
=======
import React from 'react';
import { motion } from 'framer-motion';
import './Transition.css';

const Transition = ({ children }) => {
  return (
    <motion.div
      className="transition-wrapper"
      initial={{x: "100vw" }}
      animate={{x: 0 }}
      exit={{x: "-100vw" }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        type: "tween"
      }}
    >
      <div className="page-container">
        {children}
      </div>
    </motion.div>
>>>>>>> Stashed changes
  );
};

export default Transition;
