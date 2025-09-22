import React, { useState } from "react";
import { ec as EC } from "elliptic";
import CryptoJS from "crypto-js";
import { logToolActivity } from "../utils/logger";

const ec = new EC("secp256k1");

function ECCEncryption() {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [output, setOutput] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const generateKeyPair = () => {
    const key = ec.genKeyPair();
    setPrivateKey(key.getPrivate("hex"));
    setPublicKey(key.getPublic("hex"));
  };

  const encrypt = () => {
    try {
      const pubKey = ec.keyFromPublic(publicKey, "hex");
      const tempKey = ec.genKeyPair();
      const sharedSecret = tempKey.derive(pubKey.getPublic()).toString(16);

      const encrypted = CryptoJS.AES.encrypt(plaintext, sharedSecret).toString();

      const payload = {
        ephemeralPublicKey: tempKey.getPublic("hex"),
        encrypted,
      };

      setOutput("Encrypted with ECC (ECIES): " + JSON.stringify(payload, null, 2));
      logToolActivity("ECC Encrypt / Decrypt", "encrypt", "success");
    } catch (err) {
      setOutput("Encryption error: " + err.message);
      logToolActivity("ECC Encrypt / Decrypt", "encrypt", "failed");
    }
  };

  const decrypt = () => {
    try {
      const parsed = JSON.parse(ciphertext);
      const ephKey = ec.keyFromPublic(parsed.ephemeralPublicKey, "hex");
      const priv = ec.keyFromPrivate(privateKey, "hex");
      const sharedSecret = priv.derive(ephKey.getPublic()).toString(16);

      const decrypted = CryptoJS.AES.decrypt(parsed.encrypted, sharedSecret).toString(CryptoJS.enc.Utf8);

      setOutput("Decrypted with ECC (ECIES): " + decrypted);
      logToolActivity("ECC Encrypt / Decrypt", "decrypt", "success");
    } catch (err) {
      setOutput("Decryption error: " + err.message);
      logToolActivity("ECC Encrypt / Decrypt", "decrypt", "failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1628] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">ECC Encryption (ECIES)</h1>

      <div className="bg-gray-800 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">Generate ECC Key Pair</h2>
        <button
          onClick={generateKeyPair}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Generate ECC Key Pair
        </button>
        <div className="mt-4 space-y-2 max-h-32 overflow-auto">
          <div>
            <strong>Public Key:</strong>
            <p className="bg-gray-700 p-2 rounded break-words">{publicKey}</p>
          </div>
          <div>
            <strong>Private Key:</strong>
            <p className="bg-gray-700 p-2 rounded break-words">{privateKey}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-gray-800 p-4 rounded w-full">
          <h2 className="text-xl font-semibold mb-2">Encryption</h2>
          <textarea
            className="w-full p-2 mb-2 rounded bg-gray-700"
            placeholder="Enter plaintext..."
            rows={4}
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
          />
          <textarea
            className="w-full p-2 mb-4 rounded bg-gray-700"
            placeholder="Paste recipient's public key..."
            rows={3}
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
          <button
            onClick={encrypt}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Encrypt
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded w-full">
          <h2 className="text-xl font-semibold mb-2">Decryption</h2>
          <textarea
            className="w-full p-2 mb-2 rounded bg-gray-700"
            placeholder="Paste ciphertext JSON..."
            rows={4}
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
          />
          <textarea
            className="w-full p-2 mb-4 rounded bg-gray-700"
            placeholder="Paste your private key..."
            rows={3}
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <button
            onClick={decrypt}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Decrypt
          </button>
        </div>
      </div>

      <div className="bg-gray-900 p-4 mt-6 rounded max-h-64 overflow-auto">
        <p className="font-semibold mb-2">Output:</p>
        <div className="bg-gray-700 p-3 rounded break-words whitespace-pre-wrap">{output}</div>
      </div>
    </div>
  );
}

export default ECCEncryption;
