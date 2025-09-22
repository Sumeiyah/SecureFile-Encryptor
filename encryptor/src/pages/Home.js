import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaKey,
  FaFingerprint,
  FaSync,
  FaExchangeAlt,
  FaCode,
  FaUserShield,
  FaRandom,
  FaUserSecret,
  FaCogs,
  FaThumbsUp,
} from "react-icons/fa";
import Navbar from "../components/Navbar"; // ✅ Navbar included

// 🧠 Tool usage logging
const logToolUsage = (toolName) => {
  // Support either "user" (preferred) or legacy "currentUser"
  const storedUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("currentUser"));
  if (!storedUser) return;

  const activity = {
    user: storedUser?.name || storedUser?.email || "Unknown",
    fileName: "-",
    type: "Tool Clicked",
    toolUsed: toolName,
    timestamp: new Date().toLocaleString(),
  };

  const activities = JSON.parse(localStorage.getItem("fileActivities")) || [];
  activities.unshift(activity);
  localStorage.setItem("fileActivities", JSON.stringify(activities));

  const stats = JSON.parse(localStorage.getItem("activityStats")) || {
    encrypted: 0,
    decrypted: 0,
    downloads: 0,
    success: 0,
    failed: 0,
    lastActivity: "N/A",
  };

  stats.success++;
  stats.lastActivity = activity.timestamp;
  localStorage.setItem("activityStats", JSON.stringify(stats));
};

// Card component
const ToolCard = ({ title, icon, description, route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Gate: require login before using any tool
    const isLoggedIn =
      !!localStorage.getItem("user") || !!localStorage.getItem("currentUser");

    if (!isLoggedIn) {
      // Send them to login and remember where they intended to go
      navigate("/login", { state: { from: route || "/" } });
      return;
    }

    // Logged in → record usage + go to tool
    logToolUsage(title);
    if (route) navigate(route);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-gray-900 shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-cyan-500/40 transition duration-300 border border-gray-700 cursor-pointer"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-sm text-center text-gray-300">{description}</p>
    </div>
  );
};

// Shared section component
const Section = ({ title, items }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold text-cyan-300 mb-6 text-center">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {items.map((tool, index) => (
        <ToolCard key={index} {...tool} />
      ))}
    </div>
  </div>
);


const recommendedTools = [
  {
    title: "Best Symmetric: AES (GCM)",
    icon: <FaThumbsUp className="text-cyan-400 text-3xl" />,
    description: "Balanced security & performance for files. Use AES-GCM.",
    route: "/encrypt-decrypt?alg=AES", // your unified page; mode can be chosen inside
  },
  {
    title: "Best Hybrid: AES + RSA",
    icon: <FaKey className="text-red-500 text-3xl" />,
    description: "Encrypt data with AES and keys with RSA for safe sharing.",
    route: "/hybrid",
  },
  {
    title: "Best For Passwords: bcrypt",
    icon: <FaCode className="text-indigo-400 text-3xl" />,
    description: "Slow, salted hashing for password storage & verification.",
    route: "/hashing",
  },
  {
    title: "Best Utility: Image Cleaner",
    icon: <FaFingerprint className="text-purple-400 text-3xl" />,
    description: "Strip EXIF metadata and optionally encrypt images.",
    route: "/hybrid",
  },
  {
    title: "Best Quick Text: Real-Time Encryptor",
    icon: <FaSync className="text-pink-400 text-3xl" />,
    description: "Fast text/file encryption for quick, ad-hoc use.",
    route: "/encrypt-decrypt?alg=Rabbit",
  },
  {
    title: "Best Asymmetric: RSA",
    icon: <FaUserShield className="text-red-400 text-3xl" />,
    description: "Public/private key encryption and signing.",
    route: "/asymmetric",
  },
];

// SYMMETRIC ENCRYPTION TOOLS
const symmetricTools = [
  {
    title: "AES Encrypt / Decrypt",
    icon: <FaLock className="text-blue-400 text-3xl" />,
    description: "Encrypt and decrypt files using AES algorithm.",
    route: "/encrypt-decrypt?alg=AES",
  },
  {
    title: "Blowfish Encrypt / Decrypt",
    icon: <FaKey className="text-green-400 text-3xl" />,
    description: "Encrypt and decrypt using Blowfish encryption.",
    route: "/encrypt-decrypt?alg=Blowfish",
  },
  {
    title: "Triple DES Encrypt / Decrypt",
    icon: <FaLock className="text-yellow-400 text-3xl" />,
    description: "Secure your files with Triple DES algorithm.",
    route: "/encrypt-decrypt?alg=TripleDES",
  },
  {
    title: "Real-Time Encryptor",
    icon: <FaSync className="text-pink-400 text-3xl" />,
    description: "Encrypt/Decrypt text and files in real time.",
    route: "/encrypt-decrypt?alg=Rabbit",
  },
];

// ASYMMETRIC ENCRYPTION TOOLS
const asymmetricTools = [
  {
    title: "RSA Encrypt / Decrypt",
    icon: <FaUserShield className="text-red-400 text-3xl" />,
    description: "Encrypt and decrypt using public/private RSA keys.",
    route: "/asymmetric",
  },
  {
    title: "ECC Encrypt / Decrypt",
    icon: <FaCogs className="text-green-400 text-3xl" />,
    description: "Encrypt and decrypt using elliptic curve cryptography.",
    route: "/asymmetric",
  },
  {
    title: "ElGamal Encrypt / Decrypt",
    icon: <FaUserSecret className="text-purple-400 text-3xl" />,
    description: "Public key encryption using the ElGamal algorithm.",
    route: "/asymmetric",
  },
];

// HYBRID ENCRYPTION TOOLS
const hybridTools = [
  {
    title: "Hybrid AES + RSA",
    icon: <FaKey className="text-red-500 text-3xl" />,
    description: "Combine AES speed with RSA security.",
    route: "/hybrid",
  },
  {
    title: "Image Cleaner (Strip Metadata + Encrypt)",
    icon: <FaFingerprint className="text-purple-400 text-3xl" />,
    description: "Remove EXIF metadata and encrypt images securely.",
    route: "/hybrid",
  },
  {
    title: "Hybrid ECC + AES",
    icon: <FaRandom className="text-cyan-400 text-3xl" />,
    description: "Use ECC for key exchange and AES for data encryption.",
    route: "/hybrid",
  },
];

// HASHING TOOLS
const hashingTools = [
  {
    title: "SHA-256 Hash Generator",
    icon: <FaCode className="text-teal-400 text-3xl" />,
    description: "Generate a SHA-256 hash from text input.",
    route: "/hashing",
  },
  {
    title: "SHA-3 Hash Generator",
    icon: <FaCode className="text-yellow-400 text-3xl" />,
    description: "Generate a SHA-3 (Keccak) hash from input data.",
    route: "/hashing",
  },
  {
    title: "bcrypt Password Hasher",
    icon: <FaCode className="text-indigo-400 text-3xl" />,
    description: "Securely hash passwords using bcrypt.",
    route: "/hashing",
  },
];

// EDUCATIONAL / MODERN CONVERTERS & DEMOS
// 
const educationalTools = [
  {
    title: "URL encoder",
    icon: <FaLock className="text-green-400 text-3xl" />,
    description: "Makes URLs safe — prevents breaking the structure of the URL.",
    route: "/educational?alg=ChaCha20",
  },
  {
    title: "Base64 Encoder / Decoder",
    icon: <FaCode className="text-blue-400 text-3xl" />,
    description: "Encode and decode text in Base64 format.",
    route: "/educational",
  },
  {
    title: "Text ↔ Binary / Hex Converter",
    icon: <FaExchangeAlt className="text-purple-400 text-3xl" />,
    description: "Convert text to binary or hex and back.",
    route: "/educational",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-cyan-400">
          SecureFile Encryptor Tools
        </h1>

        {/* Sections reordered so Recommended Tools appears at the bottom */}
        <Section title="🔐 Symmetric Encryption" items={symmetricTools} />
        <Section title="🔐 Asymmetric Encryption" items={asymmetricTools} />
        <Section title="🔐 Hybrid Encryption" items={hybridTools} />
        <Section title="🔐 Hashing Tools" items={hashingTools} />
        <Section title="🎓 Modern Demos & Converters" items={educationalTools} />
        {/* Curated recommendations moved to bottom */}
        <Section title="🔎 Recommended Tools" items={recommendedTools} />
      </div>
    </div>
  );
}
