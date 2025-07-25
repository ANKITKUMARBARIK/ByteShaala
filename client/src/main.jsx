import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { store } from "./store/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <Provider store={store}>
        <AuthProvider>
          <Toaster />
          <App />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
