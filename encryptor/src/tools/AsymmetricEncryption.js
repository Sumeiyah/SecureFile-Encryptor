import React, { useState } from "react";
import forge from "node-forge";
import Navbar from "../components/Navbar";
import ECCEncryption from "./ECCEncryption";
import ElGamalEncryption from "./ElGamalEncryption";
import { logToolActivity } from "../utils/logger";


function AsymmetricEncryption() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("RSA");

  // RSA states
  const [plaintext, setPlaintext] = useState(""); // Stores the message to encrypt
  const [ciphertext, setCiphertext] = useState("");
  const [output, setOutput] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const generateKeyPair = () => {
    const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(2048);// Create 2048-bit RSA keys
    const publicPem = forge.pki.publicKeyToPem(publicKey);// Convert public key to PEM string

    const privatePem = forge.pki.privateKeyToPem(privateKey);
    setPublicKey(publicPem);
    setPrivateKey(privatePem);
  };

  const downloadKey = (type) => {
    const blob = new Blob([type === "public" ? publicKey : privateKey], {
      type: "text/plain",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = type === "public" ? "publicKey.pem" : "privateKey.pem";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const encrypt = () => {
  try {
    const pubKey = forge.pki.publicKeyFromPem(publicKey);// Convert PEM string to public key object
    const encrypted = pubKey.encrypt(plaintext, "RSA-OAEP");// Encrypt using RSA-OAEP padding

    const encoded = forge.util.encode64(encrypted);
    setOutput("Encrypted with RSA: " + encoded);
    logToolActivity("RSA Encrypt / Decrypt", "encrypt", "success");
  } catch (err) {
    setOutput("Encryption error: " + err.message);
    logToolActivity("RSA Encrypt / Decrypt", "encrypt", "failed");
  }
};

const decrypt = () => {
  try {
    const privKey = forge.pki.privateKeyFromPem(privateKey);// Convert PEM string to private key object
    const decoded = forge.util.decode64(ciphertext);// Decode Base64 ciphertext to binary
    const decrypted = privKey.decrypt(decoded, "RSA-OAEP");// Decrypt using RSA-OAEP padding
    setOutput("Decrypted with RSA: " + decrypted);
    logToolActivity("RSA Encrypt / Decrypt", "decrypt", "success");
  } catch (err) {
    setOutput("Decryption error: " + err.message);
    logToolActivity("RSA Encrypt / Decrypt", "decrypt", "failed");
  }
};


  return (
    <div className="min-h-screen bg-[#0e1628] text-white p-6">
      <Navbar />

      <h1 className="text-3xl font-bold text-center mb-6">
        Asymmetric Encryption Tools
      </h1>

      {/* Tab Toggle */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedAlgorithm("RSA")}
          className={`px-6 py-2 rounded ${
            selectedAlgorithm === "RSA"
              ? "bg-blue-600"
              : "bg-blue-900 hover:bg-blue-700"
          }`}
        >
          RSA
        </button>
        <button
          onClick={() => setSelectedAlgorithm("ECC")}
          className={`px-6 py-2 rounded ${
            selectedAlgorithm === "ECC"
              ? "bg-green-600"
              : "bg-green-900 hover:bg-green-700"
          }`}
        >
          ECC
        </button>
        <button
          onClick={() => setSelectedAlgorithm("ElGamal")}
          className={`px-6 py-2 rounded ${
            selectedAlgorithm === "ElGamal"
              ? "bg-purple-600"
              : "bg-purple-900 hover:bg-purple-700"
          }`}
        >
          ElGamal
        </button>
      </div>

      {/* Render Based on Selection */}
      {selectedAlgorithm === "RSA" && (
        <>
          {/* Key Generation */}
                  <h1 className="text-3xl font-bold text-center mb-2 p-4">RSA Encryption (RSA)</h1>

          <div className="bg-gray-800 p-6 rounded mb-6">

            <h2 className="text-xl font-semibold mb-4">Generate RSA Key Pair</h2>
            <div className="flex flex-wrap gap-4">
              <button
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded"
                onClick={generateKeyPair}
              >
                Generate Key Pair
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                onClick={() => downloadKey("public")}
              >
                Download Public Key
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                onClick={() => downloadKey("private")}
              >
                Download Private Key
              </button>
            </div>
          </div>

          {/* Encryption + Decryption Layout */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {/* Encryption */}
            <div className="bg-gray-800 p-6 rounded flex-1 overflow-auto max-h-[600px]">
              <h2 className="text-xl font-semibold mb-4">RSA Encryption</h2>
              <textarea
                className="w-full p-3 rounded bg-gray-700 mb-4"
                placeholder="Enter plaintext to encrypt..."
                rows={4}
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
              />
              <textarea
                className="w-full p-3 rounded bg-gray-700 mb-4"
                placeholder="Paste Public Key PEM here..."
                rows={6}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
              />
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded"
                onClick={encrypt}
              >
                Encrypt
              </button>
            </div>

            {/* Decryption */}
            <div className="bg-gray-800 p-6 rounded flex-1 overflow-auto max-h-[600px]">
              <h2 className="text-xl font-semibold mb-4">RSA Decryption</h2>
              <textarea
                className="w-full p-3 rounded bg-gray-700 mb-4"
                placeholder="Paste ciphertext to decrypt..."
                rows={4}
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
              />
              <textarea
                className="w-full p-3 rounded bg-gray-700 mb-4"
                placeholder="Paste Private Key PEM here..."
                rows={6}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
                onClick={decrypt}
              >
                Decrypt
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="bg-gray-900 p-4 rounded max-h-[300px] overflow-auto">
            <p className="font-semibold">Output:</p>
            <div className="bg-gray-700 mt-2 p-3 rounded break-words whitespace-pre-wrap">
              {output}
            </div>
          </div>
        </>
      )}

      {selectedAlgorithm === "ECC" && <ECCEncryption />}
      {selectedAlgorithm === "ElGamal" && <ElGamalEncryption />}
    </div>
  );
}

export default AsymmetricEncryption;
