import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LanguageProvider } from "./i18n/LanguageContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Chatbot from "./components/Chatbot/Chatbot";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home/Home";
import { Threats, ThreatDetail } from "./pages/Threats/Threats";
import Analyzer from "./pages/Analyzer/Analyzer";
import Videos from "./pages/Videos/Videos";
import Quiz from "./pages/Quiz/Quiz";
import SafetyGuide from "./pages/SafetyGuide/SafetyGuide";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ScamSolutions from "./pages/ScamSolutions/ScamSolutions";
import Feedback from "./pages/Feedback/Feedback";
import NotFound from "./pages/NotFound";

import "./styles/platform.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <ErrorBoundary>
          <Navbar />
          <main id="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/threats" element={<Threats />} />
              <Route path="/threats/:slug" element={<ThreatDetail />} />
              <Route path="/analyser" element={<Analyzer />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/safety-guide" element={<SafetyGuide />} />
              <Route path="/about" element={<About />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/report-scam" element={<ScamSolutions />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Legacy routes now covered by the bilingual library */}
              <Route path="/learn" element={<Navigate to="/threats" replace />} />
              <Route path="/digital-literacy" element={<Navigate to="/threats" replace />} />
              <Route path="/cyber-crime-awareness" element={<Navigate to="/threats" replace />} />
              <Route path="/social-media-safety" element={<Navigate to="/threats/social-engineering" replace />} />
              <Route path="/upi-safety" element={<Navigate to="/threats/upi-fraud" replace />} />
              <Route path="/password-security" element={<Navigate to="/threats/password-attacks" replace />} />
              <Route path="/digital-literacy-quiz" element={<Navigate to="/quiz" replace />} />
              <Route path="/emergency-help" element={<Navigate to="/safety-guide" replace />} />
              <Route path="/analyzer" element={<Navigate to="/analyser" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </ErrorBoundary>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
