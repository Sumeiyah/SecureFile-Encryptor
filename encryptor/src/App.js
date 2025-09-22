import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EncryptDecrypt from "./pages/EncryptDecrypt";
import EncryptionGuidePage from "./pages/EncryptionGuidePage"; // adjust path if needed
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";


// Grouped tool pages
import AsymmetricEncryption from "./tools/AsymmetricEncryption";
import HybridEncryption from "./tools/HybridEncryption";
import HashingTools from "./tools/HashingTools";
import EducationalTools from "./tools/ModernConverters";
import ECCEncryption from "./tools/ECCEncryption";
import ElGamalEncryption from "./tools/ElGamalEncryption";
import ImageCleaner from "./tools/ImageCleaner";

function App() {
  console.log("✅ App.js loaded");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/folder-lock" element={<ImageCleaner />} />

        {/* Encryption pages */}
        <Route path="/encrypt-decrypt" element={<EncryptDecrypt />} />
        <Route path="/guide" element={<EncryptionGuidePage />} />
        <Route path="/contact" element={<ContactPage />} />
<Route path="/faq" element={<FAQPage />} />

        {/* Tool Category Pages */}
        <Route path="/asymmetric" element={<AsymmetricEncryption />} />
        <Route path="/hybrid" element={<HybridEncryption />} />
        <Route path="/hashing" element={<HashingTools />} />
        <Route path="/ecc" element={<ECCEncryption />} />
      <Route path="/elgamal" element={<ElGamalEncryption />} />
      <Route path="/educational" element={<EducationalTools />} />

        
      </Routes>
    </Router>
  );
}

export default App;
