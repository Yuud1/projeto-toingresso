import { createRoot } from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/useContext";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Oculta o loader de vídeo quando React carregar
const hideLoader = () => {
  const loader = document.getElementById("loading");
  if (loader) {
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 3000);
  }
};

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="234809663884-92s0o9ojdmt3ctdb8avf3vge70j8lo0p.apps.googleusercontent.com">
    <UserProvider>
      <App />
    </UserProvider>
  </GoogleOAuthProvider>
);

setTimeout(() => {
  hideLoader(); // espere 2 segundos, por exemplo
}, 1900);
