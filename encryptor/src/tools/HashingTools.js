import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
// Import CryptoJS library for SHA-256 hashing
import CryptoJS from "crypto-js";
// Import bcrypt library for password hashing and verification
import bcrypt from "bcryptjs";
// Import CRC (Cyclic Redundancy Check) library for generating checksum hashes
import * as crc from "crc";
// Import a custom logging function to track when tools are used
import { logToolActivity } from "../utils/logger";

// Define different CRC hashing models and link each name to the correct function
const crcModels = {
  "CRC-32": (data) => crc.crc32(data),
  "CRC-16": (data) => crc.crc16(data),
  "CRC-16-CCITT": (data) => crc.crc16ccitt(data),
  "CRC-8": (data) => crc.crc8(data),
};

function HashingTools() {
  // Which tool is currently active: "SHA256", "bcrypt", or "CRC"
  const [activeTool, setActiveTool] = useState("SHA256");

  // Text input from the user
  const [inputText, setInputText] = useState("");

  // The hash result to show to the user
  const [hashResult, setHashResult] = useState("");

  // Number of rounds/cost factor for bcrypt hashing
  const [bcryptRounds, setBcryptRounds] = useState(10);

  // The bcrypt hash value to verify against
  const [bcryptVerifyHash, setBcryptVerifyHash] = useState("");

  // The text the user enters to check against the stored bcrypt hash
  const [bcryptVerifyText, setBcryptVerifyText] = useState("");

  // Whether the bcrypt verification passed (true), failed (false), or hasn’t been done (null)
  const [bcryptVerified, setBcryptVerified] = useState(null);

  // Which CRC model to use from the crcModels object
  const [crcModel, setCrcModel] = useState("CRC-32");

  // Whether the CRC hash should automatically update when the file is uploaded
  const [autoUpdate, setAutoUpdate] = useState(false);

  // Whenever the user switches tools, reset all input and results
  useEffect(() => {
    setInputText("");
    setHashResult("");
    setBcryptVerifyHash("");
    setBcryptVerifyText("");
    setBcryptVerified(null);
  }, [activeTool]);

  // Function to hash the text based on the active tool
  const handleTextHash = () => {
    // Stop if no input text
    if (!inputText) return;

    try {
      if (activeTool === "SHA256") {
        // Generate SHA256 hash
        const result = CryptoJS.SHA256(inputText).toString();
        setHashResult(result);
        logToolActivity("Hashing - SHA256", "hash");
      } else if (activeTool === "bcrypt") {
        // Generate bcrypt hash
        const salt = bcrypt.genSaltSync(bcryptRounds);
        const hashed = bcrypt.hashSync(inputText, salt);
        setHashResult(hashed);
        logToolActivity("Hashing - bcrypt", "hash");
      } else if (activeTool === "CRC") {
        // Generate CRC hash
        const modelFunc = crcModels[crcModel];
        if (modelFunc) {
          const result = modelFunc(inputText || "");
          setHashResult(result.toString(16).padStart(8, "0").toLowerCase());
          logToolActivity(`Hashing - ${crcModel}`, "crc");
        }
      }
    } catch (err) {
      // Log failure
      logToolActivity(`Hashing - ${activeTool}`, "hash", "failed");
    }
  };

  // Function to verify if a text matches a bcrypt hash
  const handleVerifyBcrypt = () => {
    try {
      const match = bcrypt.compareSync(bcryptVerifyText, bcryptVerifyHash);
      setBcryptVerified(match);
      logToolActivity("Hashing - bcrypt", "verify", match ? "success" : "failed");
    } catch (err) {
      setBcryptVerified(false);
      logToolActivity("Hashing - bcrypt", "verify", "failed");
    }
  };

  // Function to handle file uploads for hashing
  const handleFileInput = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (!file) return; // If no file selected, stop

    const reader = new FileReader(); // Create file reader
    reader.onload = () => {
      // Decode file content into text
      const content = new TextDecoder("utf-8").decode(reader.result);
      setInputText(content); // Put file content into the input field
      if (autoUpdate && activeTool === "CRC") handleTextHash(); // Auto-hash if enabled
    };
    reader.readAsArrayBuffer(file); // Read file as binary data
  };

  // UI for CRC hashing tool
  const renderCRCTool = () => (
    <>
      {/* Text input area */}
      <div className="mb-3">
        <textarea
          className="w-full bg-gray-700 p-2 rounded mb-3"
          rows={4}
          placeholder="Enter text or upload file..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        {/* File input */}
        <input
          type="file"
          className="mb-3"
          onChange={handleFileInput}
          accept="text/*"
        />
        {/* Auto update option */}
        <div className="flex items-center mb-2 gap-2">
          <label className="text-sm">Auto Update:</label>
          <input
            type="checkbox"
            checked={autoUpdate}
            onChange={() => setAutoUpdate(!autoUpdate)}
          />
        </div>
        {/* CRC model selection */}
        <div className="mb-3">
          <label className="block mb-1 text-sm">CRC Model:</label>
          <select
            className="w-full bg-gray-700 p-2 rounded"
            value={crcModel}
            onChange={(e) => setCrcModel(e.target.value)}
          >
            {Object.keys(crcModels).map((model) => (
              <option key={model}>{model}</option>
            ))}
          </select>
        </div>
        {/* Button to calculate hash */}
        <button
          onClick={handleTextHash}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Calculate
        </button>
        {/* Show hash output */}
        {hashResult && (
          <div className="mt-4 p-3 bg-gray-800 rounded text-green-300 font-mono break-all">
            Output (Hex): {hashResult}
          </div>
        )}
      </div>
    </>
  );

  // UI for bcrypt hashing tool
  const renderBcryptTool = () => (
    <>
      {/* Textarea for bcrypt input */}
      <textarea
        className="w-full bg-gray-700 p-2 mb-3 rounded"
        placeholder="Enter text to hash"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      {/* Slider for cost factor */}
      <label className="block mb-1">Cost Factor: {bcryptRounds}</label>
      <input
        type="range"
        min={4}
        max={15}
        value={bcryptRounds}
        onChange={(e) => setBcryptRounds(Number(e.target.value))}
        className="w-full mb-3"
      />
      {/* Generate hash button */}
      <button
        onClick={handleTextHash}
        className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
      >
        Generate bcrypt Hash
      </button>
      {/* Show result */}
      {hashResult && (
        <div className="mt-4 p-3 bg-gray-800 rounded text-pink-300 font-mono break-all">
          {hashResult}
        </div>
      )}
      {/* Divider */}
      <hr className="my-6 border-gray-600" />
      {/* Verification section */}
      <h3 className="text-lg font-semibold mb-2">Verify bcrypt Hash</h3>
      <input
        className="w-full bg-gray-700 p-2 mb-3 rounded"
        placeholder="Paste bcrypt hash"
        value={bcryptVerifyHash}
        onChange={(e) => setBcryptVerifyHash(e.target.value)}
      />
      <input
        className="w-full bg-gray-700 p-2 mb-3 rounded"
        placeholder="Enter original text"
        value={bcryptVerifyText}
        onChange={(e) => setBcryptVerifyText(e.target.value)}
      />
      <button
        onClick={handleVerifyBcrypt}
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
      >
        Verify Hash
      </button>
      {/* Show verification result */}
      {bcryptVerified !== null && (
        <p
          className={`mt-3 font-bold ${
            bcryptVerified ? "text-green-400" : "text-red-400"
          }`}
        >
          {bcryptVerified ? "✅ Match Found!" : "❌ No Match"}
        </p>
      )}
    </>
  );

  // UI for SHA256 hashing tool
  const renderSHA256Tool = () => (
    <>
      {/* Textarea for input */}
      <textarea
        className="w-full bg-gray-700 p-2 mb-3 rounded"
        placeholder="Enter text to hash"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      {/* Button to generate SHA-256 hash */}
      <button
        onClick={handleTextHash}
        className="bg-teal-600 px-4 py-2 rounded hover:bg-teal-700"
      >
        Generate SHA-256 Hash
      </button>
      {/* Show result */}
      {hashResult && (
        <div className="mt-4 p-3 bg-gray-800 rounded text-green-300 font-mono break-all">
          {hashResult}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">🔐 Hashing & CRC Tools</h2>
        <div className="flex justify-center gap-4 mb-8">
          {["SHA256", "bcrypt", "CRC"].map((tool) => (
            <button
              key={tool}
              onClick={() => setActiveTool(tool)}
              className={`px-4 py-2 rounded ${
                activeTool === tool ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {tool === "SHA256" ? "SHA-256" : tool}
            </button>
          ))}
        </div>
        <div className="bg-gray-800 p-6 rounded shadow">
          {activeTool === "SHA256" && renderSHA256Tool()}
          {activeTool === "bcrypt" && renderBcryptTool()}
          {activeTool === "CRC" && renderCRCTool()}
        </div>
      </div>
    </div>
  );
}

export default HashingTools;
