import React, { useState } from "react";
import CryptoJS from "crypto-js";
import forge from "node-forge";
import HybridEccAes from "./HybridECC_AES";
import ImageCleaner from "./ImageCleaner";
import { logToolActivity } from "../utils/logger";

function HybridEncryption() {
  const [activeTab, setActiveTab] = useState("aesRsa");
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState("");
  const [rsaKeys, setRsaKeys] = useState({ publicKey: "", privateKey: "" });

  // Generate RSA key pair
  const generateRsaKeys = () => {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    setRsaKeys({ publicKey: publicKeyPem, privateKey: privateKeyPem });
  };

  // Download key as file
  const downloadKey = (keyContent, fileName) => {
    const element = document.createElement("a");
    const file = new Blob([keyContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Encrypt message with AES, then encrypt AES key with RSA public key
 const handleEncrypt = () => {
  try {
    const aesKey = CryptoJS.lib.WordArray.random(16).toString(); // AES key
    const encryptedMessage = CryptoJS.AES.encrypt(message, aesKey).toString();

    const publicKey = forge.pki.publicKeyFromPem(rsaKeys.publicKey);
    const encryptedAesKey = forge.util.encode64(publicKey.encrypt(aesKey));

    const result = {
      encryptedMessage,
      encryptedAesKey,
    };

    setOutput("Encrypted successfully:\n" + JSON.stringify(result, null, 2));

    // 🔐 Log encryption activity
    logToolActivity("Hybrid AES + RSA Encryption", {
      messageLength: message.length,
      keyUsed: "RSA Public Key",
    });
  } catch (err) {
    setOutput("Encryption error: " + err.message);
    logToolActivity("Hybrid AES + RSA Encryption", {
      status: "failed",
      error: err.message,
    });
  }
};



  // Decrypt AES key with RSA private key, then decrypt message
  const handleDecrypt = () => {
  try {
    const parsed = JSON.parse(message);

    if (!parsed.encryptedMessage || !parsed.encryptedAesKey) {
      throw new Error("Both encryptedMessage and encryptedAesKey are required.");
    }

    const privateKey = forge.pki.privateKeyFromPem(rsaKeys.privateKey);
    const decryptedAesKey = privateKey.decrypt(forge.util.decode64(parsed.encryptedAesKey));
    const decryptedMessage = CryptoJS.AES.decrypt(parsed.encryptedMessage, decryptedAesKey).toString(CryptoJS.enc.Utf8);

    setOutput("Decrypted message: " + decryptedMessage);

    // ✅ Log decryption activity
    logToolActivity("Hybrid AES + RSA Decryption", {
      outputLength: decryptedMessage.length,
    });
  } catch (err) {
    setOutput("Decryption error: " + err.message);
    logToolActivity("Hybrid AES + RSA Decryption", {
      status: "failed",
      error: err.message,
    });
  }
};




  // Style tabs
  const tabStyle = (tab) =>
    `px-4 py-2 rounded-t ${activeTab === tab ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-400"}`;

  return (
    <div className="min-h-screen bg-[#0e1628] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Hybrid Encryption</h1>

      {/* Tab headers */}
      <div className="flex space-x-2 mb-4">
        <button className={tabStyle("aesRsa")} onClick={() => setActiveTab("aesRsa")}>
          Hybrid AES + RSA
        </button>
        <button className={tabStyle("folderLock")} onClick={() => setActiveTab("folderLock")}>
          Image Cleaner
        </button>
        <button className={tabStyle("eccAes")} onClick={() => setActiveTab("eccAes")}>
          Hybrid ECC + AES
        </button>
      </div>

      {/* Hybrid AES + RSA Section */}
      {activeTab === "aesRsa" && (
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Hybrid AES + RSA</h2>
          <button
            onClick={generateRsaKeys}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mb-4"
          >
            Generate RSA Key Pair
          </button>

          <div className="mb-4">
            <p className="font-semibold">Public Key:</p>
            <pre className="bg-gray-700 p-2 overflow-auto max-h-40">{rsaKeys.publicKey}</pre>
            {rsaKeys.publicKey && (
              <button
                onClick={() => downloadKey(rsaKeys.publicKey, "public_key.pem")}
                className="mt-2 bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded"
              >
                Download Public Key
              </button>
            )}
          </div>

          <div className="mb-6">
            <p className="font-semibold">Private Key:</p>
            <pre className="bg-gray-700 p-2 overflow-auto max-h-40">{rsaKeys.privateKey}</pre>
            {rsaKeys.privateKey && (
              <button
                onClick={() => downloadKey(rsaKeys.privateKey, "private_key.pem")}
                className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Download Private Key
              </button>
            )}
          </div>

          <textarea
            className="w-full p-2 mb-4 rounded bg-gray-700"
            placeholder="Enter message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex space-x-2">
            <button onClick={handleEncrypt} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
              Encrypt
            </button>
            <button onClick={handleDecrypt} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              Decrypt
            </button>
          </div>

          <div className="mt-6">
            <p className="font-semibold mb-2">Output:</p>
            <div className="bg-gray-700 p-3 rounded whitespace-pre-wrap break-words">{output}</div>
          </div>
        </div>
      )}

      {activeTab === "folderLock" && (
        <div className="bg-gray-800 p-4 rounded">
<ImageCleaner />
        </div>
      )}

      {/* Hybrid ECC + AES  */}
      {activeTab === "eccAes" && (
  <div className="bg-gray-800 p-4 rounded">
<HybridEccAes />
  </div>
)}

    </div>
  );
}

export default HybridEncryption;
