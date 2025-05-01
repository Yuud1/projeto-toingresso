import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { ForgotPasswordForm } from "@/pages/ForgotPasswordForm";
import EventDetail from './pages/EventDetail';
import QuestionHelp from './pages/QuestionHelp';
import Home from "./pages/Home"
import Profile from './pages/Profile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/evento/:id" element={<EventDetail />} />
        <Route path="/question-help" element={<QuestionHelp />} />
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
