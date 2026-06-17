import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Chatbot from "./components/Chatbot/Chatbot";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Learn from "./pages/Learn/Learn";
import DigitalLiteracy from "./pages/DigitalLiteracy/DigitalLiteracy";
import DigitalLiteracyQuiz from "./pages/DigitalLiteracyQuiz/DigitalLiteracyQuiz";
import EmergencyHelp from "./pages/EmergencyHelp/EmergencyHelp";
import ScamSolutions from "./pages/ScamSolutions/ScamSolutions";
import Feedback from "./pages/Feedback/Feedback";

// Learning Modules
import UPISafety from "./pages/LearningModules/UPISafety";
import CyberCrimeAwareness from "./pages/LearningModules/CyberCrimeAwareness";
import SocialMediaSafety from "./pages/LearningModules/SocialMediaSafety";
import PasswordSecurity from "./pages/LearningModules/PasswordSecurity";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Learning Routes */}
            <Route path="/learn" element={<Learn />} />
            <Route path="/digital-literacy" element={<DigitalLiteracy />} />
            <Route
              path="/digital-literacy-quiz"
              element={<DigitalLiteracyQuiz />}
            />

            {/* Learning Modules */}
            <Route path="/upi-safety" element={<UPISafety />} />
            <Route
              path="/cyber-crime-awareness"
              element={<CyberCrimeAwareness />}
            />
            <Route
              path="/social-media-safety"
              element={<SocialMediaSafety />}
            />
            <Route path="/password-security" element={<PasswordSecurity />} />

            {/* Emergency & Reporting */}
            <Route path="/emergency-help" element={<EmergencyHelp />} />
            <Route path="/report-scam" element={<ScamSolutions />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
