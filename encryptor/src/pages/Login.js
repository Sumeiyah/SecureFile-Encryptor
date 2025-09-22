import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";
import bgImage from "../assets/image4.webp";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Save data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("role", userData.role);

        // Redirect to homepage
        window.location.href = "/";
      } else {
        alert("User document not found.");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-black bg-opacity-70 p-8 rounded-xl shadow-lg w-96 text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-white/10 text-white placeholder-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 rounded bg-white/10 text-white placeholder-gray-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition py-2 rounded font-semibold"
        >
          Log In
        </button>

        <p className="mt-4 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <a href="/register" className="text-cyan-400 hover:underline">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
