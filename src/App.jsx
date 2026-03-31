import { useState } from 'react';
import Calculator from './components/Calculator';
import Hangman from './hangman/components/Hangman';
import './App.css'; 
import './components/styles/Styles.css'

function App() {

   const [activeApp, setActiveApp] = useState('calc');

   return (
      <div className="main-app-container">
         <nav className="app-nav">
            <button 
               className={activeApp === 'calc' ? 'nav-btn active' : 'nav-btn'}
               onClick={() => setActiveApp('calc')}
            >
          Calculadora
            </button>
            <button 
               className={activeApp === 'game' ? 'nav-btn active' : 'nav-btn'}
               onClick={() => setActiveApp('game')}
            >
          Juego Ahorcado
            </button>
         </nav>

         {/* Renderizado condicional */}
         <main className="content-area">
            {activeApp === 'calc' ? (
               <div className="fade-in">
                  <Calculator />
               </div>
            ) : (
               <div className="fade-in">
                  <Hangman />
               </div>
            )}
         </main>
      </div>
   );
}

export default App;