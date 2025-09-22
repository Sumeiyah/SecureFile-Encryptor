import React, { useState } from "react";
import CryptoJS from "crypto-js";
import EC from "elliptic/lib/elliptic/ec";
import { logToolActivity } from "../utils/logger";

const ec = new EC("p256"); // NIST P-256 curve

function HybridEccAes() {
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState("");
  const [keys, setKeys] = useState({ publicKey: "", privateKey: "" });

  // Generate ECC Key Pair
  const generateECCKeys = () => {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic("hex");
    const privateKey = key.getPrivate("hex");
    setKeys({ publicKey, privateKey });
  };

  // Download utility
  const downloadKey = (keyContent, fileName) => {
    const element = document.createElement("a");
    const file = new Blob([keyContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Encrypt with AES, then encrypt AES key with ECC public key (mocked)
  const handleEncrypt = () => {
  try {
    const aesKey = CryptoJS.lib.WordArray.random(16).toString();
    const encryptedMessage = CryptoJS.AES.encrypt(message, aesKey).toString();
    const encryptedAesKey = CryptoJS.AES.encrypt(aesKey, keys.publicKey).toString(); // Mock encryption

    const result = {
      encryptedMessage,
      encryptedAesKey,
    };

    setOutput(JSON.stringify(result, null, 2));

    // Log activity
    logToolActivity("Hybrid ECC + AES Encryption", {
      messageLength: message.length,
      keyUsed: "ECC Public Key",
    });

    setTimeout(() => {
      document.getElementById("eccOutput")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } catch (err) {
    setOutput("Encryption error: " + err.message);
  }
};


  // Decrypt
  const handleDecrypt = () => {
  try {
    const parsed = JSON.parse(message);

    if (!parsed.encryptedMessage || !parsed.encryptedAesKey) {
      throw new Error("Both encryptedMessage and encryptedAesKey are required.");
    }

    const aesKey = CryptoJS.AES.decrypt(parsed.encryptedAesKey, keys.publicKey).toString(CryptoJS.enc.Utf8);
    const decryptedMessage = CryptoJS.AES.decrypt(parsed.encryptedMessage, aesKey).toString(CryptoJS.enc.Utf8);

    setOutput("Decrypted message: " + decryptedMessage);

    // Log activity
    logToolActivity("Hybrid ECC + AES Decryption", {
      outputLength: decryptedMessage.length,
    });

    setTimeout(() => {
      document.getElementById("eccOutput")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } catch (err) {
    setOutput("Decryption error: " + err.message);
  }
};

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">Hybrid ECC + AES</h2>

      <button
        onClick={generateECCKeys}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mb-4"
      >
        Generate ECC Key Pair
      </button>

      <div className="mb-4">
        <p className="font-semibold">Public Key:</p>
        <pre className="bg-gray-700 p-2 overflow-auto max-h-32 break-all">{keys.publicKey}</pre>
        {keys.publicKey && (
          <button
            onClick={() => downloadKey(keys.publicKey, "ecc_public_key.txt")}
            className="mt-2 bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded"
          >
            Download Public Key
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="font-semibold">Private Key:</p>
        <pre className="bg-gray-700 p-2 overflow-auto max-h-32 break-all">{keys.privateKey}</pre>
        {keys.privateKey && (
          <button
            onClick={() => downloadKey(keys.privateKey, "ecc_private_key.txt")}
            className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          >
            Download Private Key
          </button>
        )}
      </div>

      <textarea
        className="w-full p-2 mb-4 rounded bg-gray-700"
        rows={4}
        placeholder="Enter message (or paste encrypted JSON to decrypt)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="flex space-x-2">
        <button
          onClick={handleEncrypt}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Encrypt
        </button>
        <button
          onClick={handleDecrypt}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Decrypt
        </button>
      </div>

      <div id="eccOutput" className="mt-6">
        <p className="font-semibold mb-2">Output:</p>
        <div className="bg-gray-700 p-3 rounded whitespace-pre-wrap break-words max-h-64 overflow-auto">
          {output}
        </div>
      </div>
    </div>
  );
}

export default HybridEccAes;
