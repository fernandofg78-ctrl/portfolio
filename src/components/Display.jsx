


export const Display = ({ value }) => {

   const displayValue = value === "" ? "0" : value;  //se crea la variable asignandole el valor que recibimos del padre

   return (
      <div className="display">
         {displayValue.split("").map((char, index) => ( //aqui está la clave, transformamos en un array y lo recorremos 
            <span key={index} className="digit"> {/* para  darle una key y poder identificarlo y ponerles el nombre de una clase para poder pasarles los estilos de animacion en css */}
               {char} {/* Lo que  se pinta en display se renderiza com caracteres individuales */}
            </span>
         ))}
      </div>
   );
};
