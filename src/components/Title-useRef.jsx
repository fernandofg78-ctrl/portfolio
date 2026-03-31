import { useState, useRef, useEffect } from "react";
import './styles/Title-style.css'

export const Title = ({ title }) => {

   const [isOpen, setIsOpen] = useState(false);
   const containerRef = useRef(null);

   const toggleMenu = () => {
      setIsOpen((prev) => !prev);
   };

   // Cerrar al clicar fuera
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            containerRef.current &&
        !containerRef.current.contains(event.target)
         ) {
            setIsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   return (
      <div className="title-style" ref={containerRef}>

         <div className="title-menu" onClick={toggleMenu}>
            <h1>{title}</h1>
            <span className={`arrow ${isOpen ? "open" : ""}`}>
          ▼
            </span>
         </div>

         <div className={`title-content ${isOpen ? "open" : ""}`}>
            <p>
          Esta calculadora está construida con React y sirve como
          ejercicio práctico para entender estado, props,
          renderizado condicional y lógica de interfaz.
            </p>
         </div>

      </div>
   );
};
