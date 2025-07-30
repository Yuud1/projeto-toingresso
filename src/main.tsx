import { createRoot } from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/useContext";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="234809663884-92s0o9ojdmt3ctdb8avf3vge70j8lo0p.apps.googleusercontent.com">
    <UserProvider>
      <App />
    </UserProvider>
  </GoogleOAuthProvider>
);
