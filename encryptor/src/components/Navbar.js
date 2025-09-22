import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardRoute, setDashboardRoute] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      setDashboardRoute("/dashboard");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-60 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-cyan-400">
          <Link to="/">SecureFile Encryptor</Link>
        </h1>
        <div className="space-x-4 text-sm flex items-center">
          <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
          <Link to="/guide" className="hover:text-cyan-400 transition">Guide</Link>
          
       
          <Link to="/faq" className="hover:text-cyan-400 transition">Help</Link>
          <Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="hover:text-cyan-400 transition">Login</Link>
              <Link to="/register" className="hover:text-cyan-400 transition">Register</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
