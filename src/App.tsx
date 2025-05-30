import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { ForgotPasswordForm } from "@/pages/ForgotPasswordForm";
import EventDetail from './pages/EventDetail';
import QuestionHelp from './pages/QuestionHelp';
import Organizer  from './pages/Organizer';
import Home from "./pages/Home"
import Profile from './pages/Profile';
import CreateEvent from "@/pages/CreateEvent";
import MyTickets from "@/pages/MyTickets";
import MyEvents from "@/pages/MyEvents";
import Favorites from "@/pages/Favorites";
import EmailConfirmation from "@/pages/EmailConfirmation";
import EmailConfirmed from "@/pages/EmailConfirmed";
import TermsOfUse from "@/pages/TermsOfUse";
import CommunityGuidelines from "@/pages/CommunityGuidelines";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import LegalObligations from "@/pages/LegalObligations";
import HalfPriceRules from "@/pages/HalfPriceRules";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/confirm-email" element={<EmailConfirmation />} />
        <Route path="/email-confirmed" element={<EmailConfirmed />} />
        <Route path="/evento/:id" element={<EventDetail />} />
        <Route path="/question-help" element={<QuestionHelp />} />
        <Route path="/organizer/:id" element={<Organizer />} />
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/criar-evento" element={<CreateEvent />} />
        <Route path="/meus-ingressos" element={<MyTickets />} />
        <Route path="/meus-eventos" element={<MyEvents />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/termos-de-uso" element={<TermsOfUse />} />
        <Route path="/diretrizes-da-comunidade" element={<CommunityGuidelines />} />
        <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
        <Route path="/obrigatoriedades-legais" element={<LegalObligations />} />
        <Route path="/regra-da-meia-entrada" element={<HalfPriceRules />} />
      </Routes>
    </Router>
  );
}

export default App;
