import "./styles/Styles.css";

const KEYS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "-",
  "/",
  "?",
  "¿",
  "!",
  "¡",
];

export const Keyboard = ({
  activeLetters,
  inactiveLetters,
  addGuessedLetter,
  disabled,
}) => {
  return (
    <div className="keyboard-container">
      {KEYS.map((key) => {
        const isActive = activeLetters.includes(key);
        const isInactive = inactiveLetters.includes(key);
        return (
          <button
            onClick={() => addGuessedLetter(key)}
            className={`key-btn ${isActive ? "active" : ""} ${isInactive ? "inactive" : ""}`}
            key={key}
            disabled={isActive || isInactive || disabled}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};
