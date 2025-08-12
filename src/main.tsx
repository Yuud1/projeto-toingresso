import { createRoot } from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/useContext";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="234809663884-jmo98csrf8etl5suu9fsbqsclj0ks2f0.apps.googleusercontent.com">
    <UserProvider>
      <App />
    </UserProvider>
  </GoogleOAuthProvider>
);
