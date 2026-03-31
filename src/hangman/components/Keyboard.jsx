import "./styles/Keyboard.css";

//Esta clase en la encargada de pintar el teclado y de desactivar las letras que se hayan empleado,
// recibirá las letras activas, las inactivas, una funcion enviando el click y un booleano para desactivar el teclado l finalizar


const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split(''); // se declara una string con el albabeto, y se converte en un array para separar los elementos 

export const Keyboard = ({
  activeLetters, //prop para las letras que están en la palabra
  inactiveLetters, //prop Para las letras que no están en la palabra
  addGuessedLetter, // funcion para avisar del click
  disabled = false //para desactivar el teclado al finalizar
}) =>{
    return( //Loque devuelve son los botones que se van clicando
     <div className='keyboard-container'>      
     {/* Se engloba dentro de un div general para el estilo y se recorre el string convertido en array asignandole una key a cada elemento  */}
        {alphabet.map(key => {
          //Lo primero es determinar si los botones están activos o no 
          const isActive = activeLetters.includes(key)  //variable con las letras activas captadas por el map
          const isInactive = inactiveLetters.includes(key) //variable con las letras inactivas captadas por el map

          return(  //y ahora el return del map, donde se crearán los botones y captará los cambios en los mismos
            <button // creamos un botón para cada elemento del array
              key={key} //se le dá el identificador, en este caso nos vale con el contenido del mismo, ya que es unico
              className = {`key-btn ${isActive ? 'active' : ''} ${isInactive ? 'inactive' : ''}`}
              //La clase para todos los botones que se crean con el map es key-button, y dependiendo si esta activo o no, se les da clase activa o inactiva
              disabled={isActive || isInactive || disabled} //para desactivar el teclado 
              onClick ={() => addGuessedLetter(key)} //Se llama a la funcion de los props y se envia la letra clickada
              > 
              {key} 
              {/* El contenido del boton es la Key */}
              </button>

          )

        }// fin del map

        )} 
     </div>
    )
}


// const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

// export function Keyboard({ 
//   activeLetters,   // Letras que están en la palabra
//   inactiveLetters, // Letras que NO están en la palabra
//   addGuessedLetter, // Función para avisar al padre del click
//   disabled = false  // Para desactivar todo el teclado al ganar/perder
// }) {
//   return (
//     <div className="keyboard-container">
//       {ALPHABET.map(key => {
//         // Aquí determinamos el estado de cada tecla
//         const isActive = activeLetters.includes(key);
//         const isInactive = inactiveLetters.includes(key);

//         return (
//           <button 
//                 key={key}
//                 className={`key-btn ${isActive ? "active" : ""} ${isInactive ? "inactive" : ""}`}
                
//                 // El botón se bloquea si ya se usó (isActive o isInactive) 
//                 // o si el juego terminó (disabled)
//                 disabled={isActive || isInactive || disabled}
                
//                 // Al hacer click, enviamos la letra hacia arriba al componente App
//                 onClick={() => addGuessedLetter(key)}
//                 >
//                 {key}
//             </button>
//         );
//       })}
//     </div>
//   );
// }