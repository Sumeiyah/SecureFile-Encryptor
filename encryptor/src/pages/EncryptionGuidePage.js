import React, { useState } from "react";
import EncryptionGuide from "./EncryptionGuide";
import Navbar from "../components/Navbar";

function EncryptionGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolClick = (category, tool) => {
    setSelectedCategory(category);
    setSelectedTool(tool);
  };

  const categories = Object.keys(EncryptionGuide);
  const toolData =
    selectedCategory && selectedTool
      ? EncryptionGuide[selectedCategory][selectedTool]
      : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="flex flex-1 pt-20">
        <aside className="w-64 bg-gray-800 p-4 border-r border-cyan-700">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">Encryption Tools</h2>
          {categories.map((category) => (
            <div key={category} className="mb-4">
              <h3 className="text-pink-300 font-semibold mb-2">{category}</h3>
              <ul className="pl-2 space-y-1">
                {Object.keys(EncryptionGuide[category]).map((tool) => (
                  <li
                    key={tool}
                    className={`cursor-pointer p-1 rounded hover:bg-cyan-700 ${
                      selectedTool === tool ? "bg-cyan-600" : ""
                    }`}
                    onClick={() => handleToolClick(category, tool)}
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-cyan-400">🔐 Encryption Guide</h1>

          {toolData ? (
            <div className="bg-gray-800 p-6 rounded-lg border border-cyan-500">
              <h2 className="text-2xl font-bold text-green-400 mb-2">{selectedTool}</h2>
              <p className="text-cyan-300 italic mb-4">{toolData.summary}</p>

              <h3 className="text-lg font-semibold text-pink-300 mt-4">How This Tool Works</h3>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">{toolData.details}</pre>

              <h3 className="text-lg font-semibold text-pink-300 mt-6">How It's Used in This App</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                This encryption tool is implemented with libraries such as
                <code className="text-yellow-400"> crypto-js</code>,
                <code className="text-yellow-400"> jsencrypt</code>, or
                <code className="text-yellow-400"> bcryptjs</code>, depending on the algorithm.
                <br /><br />
                In the app:
                <ul className="list-disc ml-6 mt-2 text-gray-300">
                  <li>Encryption methods (e.g., AES, RSA) convert your input into a secure cipher.</li>
                  <li>Decryption methods reverse that process using the correct key.</li>
                  <li>Hashing tools (e.g., SHA-256, bcrypt) generate irreversible hashes for integrity or secure password storage.</li>
                </ul>
              </p>

              <h3 className="text-lg font-semibold text-pink-300 mt-6">Understanding the Output</h3>
              <p className="text-gray-300 text-sm">
                <strong>Encrypted Output</strong>: A reversible ciphertext that requires the correct key to decode.<br />
                <strong>Hashed Output</strong>: A one-way transformation for verification — it cannot be reversed.<br />
                <strong>Note:</strong> Always keep your private keys or passwords secure and never share them publicly.
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">
              Select an encryption tool from the left sidebar to view full usage instructions and app details.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default EncryptionGuidePage;
