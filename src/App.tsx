import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditEvent from "./pages/EditEvent";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/contexts/ToastContext";

const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPasswordForm = lazy(() => import("@/pages/ForgotPasswordForm"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const QuestionHelp = lazy(() => import("@/pages/QuestionHelp"));
const Home = lazy(() => import("@/pages/Home"));
const Profile = lazy(() => import("@/pages/Profile"));
const CreateEvent = lazy(() => import("@/pages/CreateEvent"));
const MyTickets = lazy(() => import("@/pages/MyTickets"));
const MyEvents = lazy(() => import("@/pages/MyEvents"));
const Favorites = lazy(() => import("@/pages/Favorites"));
const EmailConfirmation = lazy(() => import("@/pages/EmailConfirmation"));
const EmailConfirmed = lazy(() => import("@/pages/EmailConfirmed"));
const TermsOfUse = lazy(() => import("@/pages/TermsOfUse"));
const CommunityGuidelines = lazy(() => import("@/pages/CommunityGuidelines"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const LegalObligations = lazy(() => import("@/pages/LegalObligations"));
const HalfPriceRules = lazy(() => import("@/pages/HalfPriceRules"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const EventArrivals = lazy(() => import("@/pages/EventArrivals"));
const EventSubscribers = lazy(() => import("@/pages/EventSubscribers"));
const Organizer = lazy(() => import("@/pages/Organizer"));
const TodosEventos = lazy(() => import("@/pages/TodosEventos"));

// Páginas Admin
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));

function App() {
  return (
    <Router>
      <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/confirm-email" element={<EmailConfirmation />} />
            <Route path="/email-confirmed" element={<EmailConfirmed />} />
            <Route path="/evento/:id" element={<EventDetail />} />
            <Route path="/question-help" element={<QuestionHelp />} />

            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/organizer/:id" element={<Organizer />} />
            <Route path="/criar-evento" element={<CreateEvent />} />
            <Route path="/editar-evento/:id" element={<EditEvent />} />
            <Route path="/meus-ingressos" element={<MyTickets />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/meus-eventos" element={<MyEvents />} />
            <Route path="/event-arrivals/:id" element={<EventArrivals />} />
            <Route path="/event-subscribers/:id" element={<EventSubscribers />} />
            <Route path="/todos-eventos" element={<TodosEventos />} />

            <Route path="/checkouts" element={<Checkout />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/termos-de-uso" element={<TermsOfUse />} />
            <Route path="/diretrizes-da-comunidade" element={<CommunityGuidelines />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
            <Route path="/obrigatoriedades-legais" element={<LegalObligations />} />
            <Route path="/regra-da-meia-entrada" element={<HalfPriceRules />} />
          </Routes>
          <Toaster />
      </ToastProvider>
    </Router>
  );
}

export default App;
