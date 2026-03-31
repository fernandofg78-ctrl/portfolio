import React, { useState, useEffect } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import "./styles/Hangman.css";

export default function Hangman() {  //Define y exporta el componente principal del juego.
   const [wordIng, setWordIng] = useState(""); //Guarda la palabra en inglés. empieza vacia
   const [wordEsp, setWordEsp] = useState(""); //Guarda la palabra en Español. empieza vacia
   const [guessedLetters, setGuessedLetters] = useState([]); //Array con las letras que el usuario ha probado.
   const [loading, setLoading] = useState(true); //Indica si el juego está cargando palabras.

   const [wins, setWins] = useState(() => Number(localStorage.getItem("hangman_wins")) || 0); //Recupera las victorias guardadas. empieza en 0
   const [losses, setLosses] = useState(() => Number(localStorage.getItem("hangman_losses")) || 0); // Recupera las derrotas

   const DICCIONARIO_URL = "https://raw.githubusercontent.com/fernandofg78-ctrl/palabras/3f25b8cc1dcc15faa843aba64f315d5a9f9c961b/palabras"; //Diccionario empleado, cada linea tiene palabra en ingles y traduccion, separadas por una ','

   const cleanText = (t) => 
      t ? t.toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ""; // convierte a mayusculas, quieta espacios elimina acentos

   const resetGame = async () => { // funcion para iniciar una nueva partida
      setLoading(true); // activa el estado de carga
      try {
         const response = await fetch(DICCIONARIO_URL); //descarga el archivo de palabras
         if (!response.ok) throw new Error("Error de conexión"); //mensaje de error por si falla la carga
      
         const text = await response.text();  //convierte la respuesta a texto plano
         const lines = text.split("\n").filter((l) => l.includes(",")); // divide el archivo en lineas conserva solo las lineas que tienen ','
      
         if (lines.length === 0) throw new Error("Archivo vacío o mal formado"); // sino devuelve error

         const randomLine = lines[Math.floor(Math.random() * lines.length)]; //elige una linea aleatoria
         const [ing, esp] = randomLine.split(","); //serpara la palabra en ingles de su traduccion

         setWordIng(cleanText(ing)); //guarda la palabras limpias en ingles
         setWordEsp(cleanText(esp));//guarda la palabra limpia en español
         setGuessedLetters([]); //reinicia las letras adivinadas
      } catch (error) { //si falla la carga 
         console.error("Fallo al cargar:", error);
         setWordIng("APPLE"); //lanza una palabra por defecto
         setWordEsp("MANZANA");
         setGuessedLetters([]);
      } finally {
         setLoading(false); //finaliza la carga
      }
   };

   useEffect(() => { //se ejecuta para cargar la palabra inicial
      resetGame();
   }, []);

 
   const combined = (wordIng + wordEsp).replace(/\s/g, "");  //Une ambas palabras y elimina espacios
   const incorrectLetters = guessedLetters.filter(l => !combined.includes(l)); //letras que no están en ninguna palabra
  
   const isWinner = wordIng !== "" && combined.split("").every(l => guessedLetters.includes(l)); //si todas las letras está adivinadas, se gana la partida
   const isLoser = incorrectLetters.length >= 6; // si no se adivinan todas, se pierde, tras 6 errores

   useEffect(() => { // se ejecuta si se gana o se pierde
      if (isWinner) {
         setWins(prev => {
            const n = prev + 1;
            localStorage.setItem("hangman_wins", n); // guarda las victorias en localstorage
            return n;
         });
      }
      if (isLoser) {
         setLosses(prev => {
            const n = prev + 1;
            localStorage.setItem("hangman_losses", n); // guarda las derrotas en localstorage
            return n;
         });
      }
   }, [isWinner, isLoser]);

   const addLetter = (l) => {  //guarda la letra clicada
      if (guessedLetters.includes(l) || isWinner || isLoser || loading) return; // evita repeticiones, poder jugar tras acabar y pulsar mientras se carga
      setGuessedLetters(prev => [...prev, l]); //Se añade letra al array de letras clicadas
   };

   const clearStats = () => { //sirve para borrar el almacenamiento en el navegador
      localStorage.clear();
      setWins(0);
      setLosses(0);
   };

   if (loading && wordIng === "") return <div className="hangman-app"><h1>Conectando con el diccionario...</h1></div>;//mensaje de carga mientras se espera la promesa

   return ( // renderizado principal
      <div className="hangman-app">
         <div className="title"><h1>Ahorcado Bilingüe</h1></div>
         <div className="score-board">
            <p>Victorias: <b>{wins}</b> | Derrotas: <b>{losses}</b></p>
            <button className="clear-btn" onClick={clearStats}>Borrar récord</button>
         </div>
         <div className='score-board'>
            <p>Intentos restantes <b>{6 - incorrectLetters.length}</b></p>
         </div>

         <div className="result-message">
            {isWinner && <span className="win">¡Excelente! Correcto 🎉</span>} {/* Si se gana, mensaje de felicitación*/}
            {isLoser && <span className="lose">¡Oh no! Era: {wordIng} / {wordEsp}</span>} {/* Si se pierde, mensaje de lastima con las palabras correctas*/}
         </div>

         <HangmanDrawing numberOfGuesses={incorrectLetters.length} /> {/* Mandamos a el componente de pintar el ahorcado el numero de fallos para que vaya pintando los errores */}

         <div className="words-display">
            <div className="word-row">
               <small>ENGLISH</small>
               <HangmanWord word={wordIng} guessedLetters={guessedLetters} reveal={isLoser} /> {/* Palabra en ingles, letras acertadas y que se revela si se pierde */ }
            </div>
            <div className="word-row">
               <small>ESPAÑOL</small>
               <HangmanWord word={wordEsp} guessedLetters={guessedLetters} reveal={isLoser} /> {/* Palabra en Español, letras acertadas y que se revela si se pierde */ }
            </div>
         </div>

         <div style={{ alignSelf: "stretch", marginTop: "20px" }}>
            <Keyboard
               activeLetters={guessedLetters.filter(l => combined.includes(l))} // {/* Letras inactivas, las que se han acertado, las que están las palabras se les da una clase que las pinta en azul */}
               inactiveLetters={incorrectLetters}// {/* letras inactivas, que no están en ninguna de las palabras */}
               addGuessedLetter={addLetter} //{/* se alade al array de letras usadas la letra clickada */}
               disabled={isWinner || isLoser || loading} //{/* se desabilita el keyboard si se gana, se pierde o está cargando */}
            />
         </div>

         <button className="reset-btn" onClick={resetGame} disabled={loading} style={{ marginTop: "20px" }}> {/* boton para iniciar partida, se llama a la fincion reset */}
            {loading ? "Cargando..." : "Siguiente palabra"}
         </button>
      </div>
   );
}