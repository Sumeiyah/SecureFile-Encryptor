// src/ElGamalEncryption.js
import React, { useState } from "react";
import bigInt from "big-integer";
import { logToolActivity } from "../utils/logger";

const p = bigInt(7919); // A prime number
const g = bigInt(2);    // A generator

function ElGamalEncryption() {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [output, setOutput] = useState("");
  const [elgamalKeys, setElgamalKeys] = useState({ privateKey: "", publicKey: "" });

  const generateElGamalKeyPair = () => {
    const x = bigInt.randBetween(1, p.minus(2));
    const y = g.modPow(x, p);
    setElgamalKeys({ privateKey: x.toString(), publicKey: y.toString() });
  };

  const encrypt = () => {
  try {
    const y = bigInt(elgamalKeys.publicKey);
    const encryptedArray = [];

    for (let i = 0; i < plaintext.length; i++) {
      const m = bigInt(plaintext.charCodeAt(i));
      const k = bigInt.randBetween(1, p.minus(2));
      const a = g.modPow(k, p);
      const b = y.modPow(k, p).multiply(m).mod(p);
      encryptedArray.push({ a: a.toString(), b: b.toString() });
    }

    setOutput("Encrypted with ElGamal:\n" + JSON.stringify(encryptedArray, null, 2));
    logToolActivity("ElGamal", "encrypt");
  } catch (err) {
    setOutput("Encryption error: " + err.message);
    logToolActivity("ElGamal", "encrypt", "failed");
  }
};


const decrypt = () => {
  try {
    const encryptedArray = JSON.parse(ciphertext);
    const x = bigInt(elgamalKeys.privateKey);
    let decryptedMessage = "";

    encryptedArray.forEach(({ a, b }) => {
      const m = bigInt(b).multiply(bigInt(a).modPow(p.minus(1).minus(x), p)).mod(p);
      decryptedMessage += String.fromCharCode(Number(m));
    });

    setOutput("Decrypted with ElGamal: " + decryptedMessage);
    logToolActivity("ElGamal", "decrypt");
  } catch (err) {
    setOutput("Decryption error: " + err.message);
    logToolActivity("ElGamal", "decrypt", "failed");
  }
};


  return (
    <div className="min-h-screen bg-[#0e1628] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">ElGamal Encryption</h1>

      {/* Key Generation */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">Generate ElGamal Key Pair</h2>
        <button onClick={generateElGamalKeyPair} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
          Generate ElGamal Key Pair
        </button>
        <div className="mt-4 space-y-2">
          <p><strong>Public Key:</strong> {elgamalKeys.publicKey}</p>
          <p><strong>Private Key:</strong> {elgamalKeys.privateKey}</p>
        </div>
      </div>

      {/* Encrypt / Decrypt */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Encryption */}
        <div className="bg-gray-800 p-4 rounded w-full">
          <h2 className="text-xl font-semibold mb-2">Encryption</h2>
          <textarea
            className="w-full p-2 mb-4 rounded bg-gray-700"
            placeholder="Enter a single character..."
            rows={2}
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
          />
          <button onClick={encrypt} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Encrypt</button>
        </div>

        {/* Decryption */}
        <div className="bg-gray-800 p-4 rounded w-full">
          <h2 className="text-xl font-semibold mb-2">Decryption</h2>
          <textarea
            className="w-full p-2 mb-4 rounded bg-gray-700"
            placeholder='Paste ciphertext JSON e.g. {"a":"...", "b":"..."}'
            rows={4}
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
          />
          <button onClick={decrypt} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Decrypt</button>
        </div>
      </div>

      {/* Output */}
      <div className="bg-gray-900 p-4 mt-6 rounded max-h-64 overflow-auto">
        <p className="font-semibold mb-2">Output:</p>
        <div className="bg-gray-700 p-3 rounded break-words whitespace-pre-wrap">{output}</div>
      </div>
    </div>
  );
}

export default ElGamalEncryption;
