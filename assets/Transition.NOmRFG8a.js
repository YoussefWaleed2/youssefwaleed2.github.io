import{j as s}from"./three-vendor.R-RPA-1_.js";import{u,c as m,b as p}from"./react-vendor.C9y_EsvM.js";import{m as l}from"./animation-vendor.Cs8CPchK.js";const x=()=>{const t=u();m();const r={initial:{x:"100vw"},animate:{x:0},exit:{x:"-100vw"}},n={ease:"easeInOut",type:"tween",duration:.5};return p.useEffect(()=>{const e=i=>{var o;const a=i.target.closest("a");if(a&&((o=a.getAttribute("href"))!=null&&o.startsWith("/"))){i.preventDefault();const c=a.getAttribute("href");t(c)}};return document.addEventListener("click",e),()=>{document.removeEventListener("click",e)}},[t]),{pageVariants:r,pageTransition:n}},f=t=>function(n){const{pageVariants:e,pageTransition:i}=x();return s.jsx(l.div,{className:"transition-wrapper",initial:"initial",animate:"animate",exit:"exit",variants:e,transition:i,children:s.jsx("div",{className:"page-container",children:s.jsx(t,{...n})})})};export{f as T};
