import { BrowserRouter } from "react-router-dom";
import * as MyLayout from "./lib/MyLayout.jsx";
import AppRouter from "./AppRouter.jsx";
import { AuthProvider } from "./pages/Login/AuthContext.jsx";

import "./App.css";
import "./resources/css/layout.css";

const App = () => (
  <BrowserRouter>
    <AuthProvider> 
      <MyLayout.Layout>
        <AppRouter />
      </MyLayout.Layout>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
