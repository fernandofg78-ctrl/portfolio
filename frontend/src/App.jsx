// src/App.jsx
// Componente raíz — aplica el tema y renderiza el router

import { useApplyTheme } from "./hooks/useApplyTheme";
import { AppRouter } from "./router/AppRouter";

const App = () => {
  useApplyTheme();

  return <AppRouter />;
};

export default App;
