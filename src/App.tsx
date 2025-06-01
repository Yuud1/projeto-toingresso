import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "@/pages/loadingPage";

// Lazy loading das páginas
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const ForgotPasswordForm = lazy(() => import("@/pages/forgotPasswordForm"));
const EventDetail = lazy(() => import("@/pages/eventDetail"));
const QuestionHelp = lazy(() => import("@/pages/questionHelp"));
const Organizer = lazy(() => import("@/pages/organizer"));
const Home = lazy(() => import("@/pages/home"));
const Profile = lazy(() => import("@/pages/profile"));
const CreateEvent = lazy(() => import("@/pages/createEvent"));
const MyTickets = lazy(() => import("@/pages/myTickets"));
const MyEvents = lazy(() => import("@/pages/myEvents"));
const Favorites = lazy(() => import("@/pages/favorites"));
const EmailConfirmation = lazy(() => import("@/pages/emailConfirmation"));
const EmailConfirmed = lazy(() => import("@/pages/emailConfirmed"));
const TermsOfUse = lazy(() => import("@/pages/termsOfUse"));
const CommunityGuidelines = lazy(() => import("@/pages/communityGuidelines"));
const PrivacyPolicy = lazy(() => import("@/pages/privacyPolicy"));
const LegalObligations = lazy(() => import("@/pages/legalObligations"));
const HalfPriceRules = lazy(() => import("@/pages/halfPriceRules"));
const ScannerPage = lazy(() => import("@/pages/scannerPage"));

// Páginas Admin
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminLogin = lazy(() => import("@/pages/admin/login"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
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
          <Route path="/scan" element={<ScannerPage />} />

          {/* Rotas Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
