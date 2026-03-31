import { useState } from "react";
import './styles/Title-style.css'

export const Title = ({ title }) => {

   const [isOpen, setIsOpen] = useState(false); //Para pode desplegar el menú, necesitamos un estado

   const toggleMenu = () => {
      setIsOpen(prev => !prev);//Se invierte el IsOpen, pasa a ser false o true, Patron muy usado en REACT
   };

   return (
      <div className="title-style">

         <div className="title-menu" onClick={toggleMenu}> {/* Si se clica en el manu, pasamos de prev tua a false */}
            <h1>{title}</h1>
            <span className={`arrow ${isOpen ? "open" : ""}`}> {/* Asignamos la clase open o se la quiamos dependiendo del estado */}
          ▼
            </span>
         </div>

         {isOpen && (  /* Si no está abierto, lo niguiente no existe */
            <div className="title-content open">
               <p>
                  Calculadora desarrollada en React como ejercicio práctico para aprender
                  gestión de estado, renderizado condicional y comunicación entre
                  componentes. Incluye animaciones, display de operaciones y un diseño
                  visual integrado, priorizando claridad y simplicidad en el código.

               </p>
            </div>
         )}

      </div>
   );
};
