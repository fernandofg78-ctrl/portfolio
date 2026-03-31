
import './styles/HangmanWord.css'


// Este compnente sirve para recibir la palbra a descifrar y determinar si las letras están o no en la palabra
export const HangmanWord = ({word, guessedLetters, reveal = false}) =>{ //recibimos una palabra, y las letras el jugador ya ha usado y un boleano que determina si se debe mostrar toda la palabra, como al perder el juego
  return(
    <div className='word-container'>
      {/* Lo primero es englobar todo en una clase para el css */}
      {/* A continuación convertimos la palabra recibida en un array..split() y lo recorremos con un map() */}
      {word.split('').map((letter, index)=> {// en el map, letter es cada letra y index su posicion
        const cleanLetter = letter.trim() //  Nos vamos a traer cadenas de texto con espacios, por lo que se los eliminamos con trim()
        const isSpace = cleanLetter === '' //importante para pintar espacios en blanco para frases, si despies de limpiar la letra, queda vacio hay que pintar un espacio
        const isGuessed = guessedLetters.includes(letter) //comprueba si la letra está dentro de la palabra devuelve true o false
        const shouldShow = isSpace || isGuessed || reveal // la letra se muestra si se ha adivinado o si es un espacio o si se perdio la partida

        return(  //este el el return del map, para renderizar la lista de letras acertadas o de la palabra comleta al perder
          <span key={index} className={`letter-slot ${isSpace ? 'space' : ''}`} > { /* siempre tendrá una clase y dependiendo si es espacio o no, tendrá la clase space */}
            <span className={`letter-content ${shouldShow ? 'visible' : 'hidden'} ${!isSpace && !isGuessed && reveal ? 'red' : ''}`}>
              {/* este span es para revelar las letras acertadas, cambiamos la clase, si al final del juego no se han acertado, pintandolas de rojo */}
              {letter}  {/*esta es la letra acertada, que se pinta en el slot*/}
            </span>
          </span>
        )
      
      })} 
    </div>
  )
}






