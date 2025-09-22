import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";
import backgroundImage from "../assets/image4.webp";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [successMsg, setSuccessMsg] = useState("");

  const passwordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const getStrengthLabel = (score) => {
    switch (score) {
      case 5:
        return "Very Strong";
      case 4:
        return "Strong";
      case 3:
        return "Medium";
      case 2:
        return "Weak";
      default:
        return "Very Weak";
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (passwordStrength(password) < 3) {
      alert("Please use a stronger password with at least 3 types of characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role,
      });

      localStorage.setItem("user", JSON.stringify({ uid: user.uid, name, email, role }));

      setSuccessMsg("✅ Registration successful! Redirecting to homepage in 3s...");

      setTimeout(() => {
        setSuccessMsg("");
        window.location.href = "/"; // ✅ Use hard redirect
      }, 3000);
    } catch (error) {
      console.error("Firebase Registration Error:", error);
      alert("Error registering: " + error.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-60 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">Register</h2>

        {successMsg && (
          <div className="bg-green-800 text-green-300 font-semibold p-3 rounded text-center mb-4 border border-green-500">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white bg-opacity-10 border border-white text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white bg-opacity-10 border border-white text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white bg-opacity-10 border border-white text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {password && (
            <p className="text-sm text-yellow-300">
              Strength: {getStrengthLabel(passwordStrength(password))}
            </p>
          )}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 bg-opacity-80 border border-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="user" className="bg-black text-white">User</option>
            <option value="admin" className="bg-black text-white">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-white">
          Already have an account?{" "}
          <a href="/login" className="text-blue-300 underline hover:text-blue-400">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
