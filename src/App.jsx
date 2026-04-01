import Hangman from "./hangman/components/Hangman";

import "./hangman/components/styles/Styles.css";

function App() {
  return (
    <div className="main-app-container">
      {/* Navegación simplificada o eliminada si no hay más apps */}

      <main className="content-area">
        <div className="fade-in">
          <Hangman />
        </div>
      </main>
    </div>
  );
}

export default App;
