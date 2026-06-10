import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Learn from "./pages/Learn/Learn";
import DigitalLiteracy from "./pages/DigitalLiteracy/DigitalLiteracy";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/learn" element={<Learn />} />

        <Route
          path="/digital-literacy"
          element={<DigitalLiteracy />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;