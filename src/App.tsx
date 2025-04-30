import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { ForgotPasswordForm } from "@/pages/ForgotPasswordForm";
import Home from "./pages/Home"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
