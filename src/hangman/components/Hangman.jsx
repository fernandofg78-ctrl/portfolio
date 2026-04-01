import React, { useState, useEffect } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import "./styles/Styles.css";

export default function Hangman() {
  const [wordIng, setWordIng] = useState("");
  const [wordEsp, setWordEsp] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [wins, setWins] = useState(
    () => Number(localStorage.getItem("hangman_wins")) || 0,
  );
  const [losses, setLosses] = useState(
    () => Number(localStorage.getItem("hangman_losses")) || 0,
  );

  const DICCIONARIO_URL =
    "https://raw.githubusercontent.com/fernandofg78-ctrl/palabras/3f25b8cc1dcc15faa843aba64f315d5a9f9c961b/palabras";

  const cleanText = (t) =>
    t
      ? t
          .toUpperCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : "";

  const resetGame = async () => {
    setLoading(true);
    try {
      const response = await fetch(DICCIONARIO_URL);
      if (!response.ok) throw new Error("Error de conexión");

      const text = await response.text();
      const lines = text.split("\n").filter((l) => l.includes(","));

      if (lines.length === 0) throw new Error("Archivo vacío");

      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      const [ing, esp] = randomLine.split(",");

      setWordIng(cleanText(ing));
      setWordEsp(cleanText(esp));
      setGuessedLetters([]);
    } catch (error) {
      console.error("Fallo al cargar:", error);
      setWordIng("APPLE");
      setWordEsp("MANZANA");
      setGuessedLetters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetGame();
  }, []);

  const combined = (wordIng + wordEsp).replace(/\s/g, "");
  const incorrectLetters = guessedLetters.filter((l) => !combined.includes(l));

  const isWinner =
    wordIng !== "" &&
    combined.split("").every((l) => guessedLetters.includes(l));
  const isLoser = incorrectLetters.length >= 6;

  useEffect(() => {
    if (isWinner) {
      setWins((prev) => {
        const n = prev + 1;
        localStorage.setItem("hangman_wins", n);
        return n;
      });
    }
    if (isLoser) {
      setLosses((prev) => {
        const n = prev + 1;
        localStorage.setItem("hangman_losses", n);
        return n;
      });
    }
  }, [isWinner, isLoser]);

  const addLetter = (l) => {
    if (guessedLetters.includes(l) || isWinner || isLoser || loading) return;
    setGuessedLetters((prev) => [...prev, l]);
  };

  const clearStats = () => {
    localStorage.clear();
    setWins(0);
    setLosses(0);
  };

  if (loading && wordIng === "")
    return (
      <div className="hangman-app">
        <h1>Conectando...</h1>
      </div>
    );

  return (
    <div className="hangman-app fade-in">
      <div className="title">
        <h1>Ahorcado Bilingüe</h1>
      </div>

      {/* Marcador superior con botón pequeño integrado */}
      <div className="score-board">
        <p>
          Victorias: <b>{wins}</b> | Derrotas: <b>{losses}</b>
        </p>
        <button className="clear-btn" onClick={clearStats}>
          Borrar
        </button>
      </div>

      {/* Contenedor del Robot con el Badge de intentos flotante */}
      <div className="drawing-container">
        <div className="attempts-badge">
          Intentos: <b>{6 - incorrectLetters.length}</b>
        </div>

        <HangmanDrawing numberOfGuesses={incorrectLetters.length} />

        {/* Mensaje de resultado superpuesto sobre el robot */}
        <div className="result-message">
          {isWinner && <span className="win">¡Excelente! Correcto 🎉</span>}
          {isLoser && (
            <span className="lose">
              ¡Oh no! Era: {wordIng} / {wordEsp}
            </span>
          )}
        </div>
      </div>

      {/* Palabras a adivinar */}
      <div className="words-display">
        <div className="word-row">
          <small>ENGLISH</small>
          <HangmanWord
            word={wordIng}
            guessedLetters={guessedLetters}
            reveal={isLoser}
          />
        </div>
        <div className="word-row">
          <small>ESPAÑOL</small>
          <HangmanWord
            word={wordEsp}
            guessedLetters={guessedLetters}
            reveal={isLoser}
          />
        </div>
      </div>

      {/* Teclado */}
      <div style={{ alignSelf: "stretch", marginTop: "10px" }}>
        <Keyboard
          activeLetters={guessedLetters.filter((l) => combined.includes(l))}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addLetter}
          disabled={isWinner || isLoser || loading}
        />
      </div>

      {/* Botón de reinicio */}
      <button className="reset-btn" onClick={resetGame} disabled={loading}>
        {loading ? "Cargando..." : "Siguiente palabra"}
      </button>
    </div>
  );
}
