import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Chatbot from "./components/Chatbot/Chatbot";
import ErrorBoundary from "./components/ErrorBoundary";
import SafetyHome from "./pages/SafetyHome/SafetyHome";
import CheckCenter from "./pages/CheckCenter/CheckCenter";
import IncidentMode from "./pages/IncidentMode/IncidentMode";
import ThreatRadar from "./pages/ThreatRadar/ThreatRadar";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Learn from "./pages/Learn/Learn";
import DigitalLiteracy from "./pages/DigitalLiteracy/DigitalLiteracy";
import DigitalLiteracyQuiz from "./pages/DigitalLiteracyQuiz/DigitalLiteracyQuiz";
import EmergencyHelp from "./pages/EmergencyHelp/EmergencyHelp";
import ScamSolutions from "./pages/ScamSolutions/ScamSolutions";
import Feedback from "./pages/Feedback/Feedback";
import NotFound from "./pages/NotFound";

import UPISafety from "./pages/LearningModules/UPISafety";
import CyberCrimeAwareness from "./pages/LearningModules/CyberCrimeAwareness";
import SocialMediaSafety from "./pages/LearningModules/SocialMediaSafety";
import PasswordSecurity from "./pages/LearningModules/PasswordSecurity";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="app">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<SafetyHome />} />
              <Route path="/check" element={<CheckCenter />} />
              <Route path="/threats" element={<ThreatRadar />} />
              <Route path="/incidents" element={<IncidentMode />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/digital-literacy" element={<DigitalLiteracy />} />
              <Route path="/digital-literacy-quiz" element={<DigitalLiteracyQuiz />} />
              <Route path="/upi-safety" element={<UPISafety />} />
              <Route path="/cyber-crime-awareness" element={<CyberCrimeAwareness />} />
              <Route path="/social-media-safety" element={<SocialMediaSafety />} />
              <Route path="/password-security" element={<PasswordSecurity />} />
              <Route path="/emergency-help" element={<EmergencyHelp />} />
              <Route path="/report-scam" element={<ScamSolutions />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
