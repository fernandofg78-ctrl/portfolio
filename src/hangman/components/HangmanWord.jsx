export const HangmanWord = ({ word, guessedLetters, reveal = false }) => {
  return (
    <div className="word-container">
      {word.split("").map((letter, index) => {
        // Normalizamos la letra para comparar (evitar fallos con tildes o espacios)
        const isSpace = letter === " ";
        const isGuessed = guessedLetters.includes(letter.toUpperCase());
        const shouldShow = isSpace || isGuessed || reveal;

        return (
          <span key={index} className={`letter-slot ${isSpace ? "space" : ""}`}>
            <span
              className={`letter-content ${shouldShow ? "visible" : "hidden"} ${
                !isSpace && !isGuessed && reveal ? "red" : ""
              }`}
            >
              {letter}
            </span>
          </span>
        );
      })}
    </div>
  );
};
