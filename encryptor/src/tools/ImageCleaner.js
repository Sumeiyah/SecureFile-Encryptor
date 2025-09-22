import React, { useState } from "react";
import exifr from "exifr";
import CryptoJS from "crypto-js";
import { logToolActivity } from "../utils/logger";

function ImageCleaner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [password, setPassword] = useState("");
  const [decryptedImageURL, setDecryptedImageURL] = useState(null);
  const [cleanedFile, setCleanedFile] = useState(null);
  const [decryptedMetadata, setDecryptedMetadata] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setDecryptedImageURL(null);
    setDecryptedMetadata(null);

    if (file) {
      try {
        const meta = await exifr.parse(file);
        setMetadata(meta || {});
      } catch (err) {
        console.error("Metadata read error:", err);
        setMetadata("Error reading metadata");
      }
    }
  };

  const handleStripMetadata = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
      const arrayBuffer = e.target.result;
      const blob = new Blob([arrayBuffer], { type: selectedFile.type });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const cleaned = new File([blob], "cleaned_image.jpg", {
            type: "image/jpeg",
          });
          setCleanedFile(cleaned);
          setMetadata({});
        }, "image/jpeg");
      };
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleEncrypt = () => {
    if (!cleanedFile || !password) {
      alert("Please strip metadata first and provide a password.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
        const encrypted = CryptoJS.AES.encrypt(wordArray, password).toString();

        const blob = new Blob([encrypted], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "encrypted_image.enc";
        link.click();

        logToolActivity("Image Cleaner", "encrypt", "success");
      } catch (error) {
        console.error("Encryption failed:", error);
        logToolActivity("Image Cleaner", "encrypt", "failed");
      }
    };

    reader.readAsArrayBuffer(cleanedFile);
  };

  const handleDecrypt = () => {
    if (!selectedFile || !password) {
      alert("Select encrypted .enc file and enter password");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const encryptedText = e.target.result.trim();
        const decrypted = CryptoJS.AES.decrypt(encryptedText, password);

        const decryptedBase64 = decrypted.toString(CryptoJS.enc.Base64);
        const binaryString = atob(decryptedBase64);
        const byteNumbers = Array.from(binaryString, (char) =>
          char.charCodeAt(0)
        );
        const typedArray = new Uint8Array(byteNumbers);

        const blob = new Blob([typedArray], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setDecryptedImageURL(url);

        exifr.parse(blob).then((meta) => {
          setDecryptedMetadata(meta || {});
        });

        logToolActivity("Image Cleaner", "decrypt", "success");
      } catch (error) {
        console.error("Decryption failed:", error);
        alert("Failed to decrypt file. Check your password.");
        logToolActivity("Image Cleaner", "decrypt", "failed");
      }
    };

    reader.readAsText(selectedFile);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Image Cleaner (Strip Metadata + Encrypt)
      </h1>

      <input
        type="file"
        accept="image/*,.enc"
        onChange={handleFileChange}
        className="mb-2"
      />
      {selectedFile && (
        <p className="text-sm text-gray-300">{selectedFile.name}</p>
      )}

      <div className="bg-gray-900 p-3 rounded mb-4 overflow-auto text-sm">
        <span className="text-purple-400 font-bold">Extracted Metadata:</span>
        <pre>{JSON.stringify(metadata, null, 2)}</pre>
      </div>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        className="mb-4 p-2 w-full rounded bg-gray-800 border border-gray-700 text-white"
      />

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleStripMetadata}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Strip Metadata
        </button>
        <button
          onClick={handleEncrypt}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Encrypt Cleaned Image
        </button>
        <button
          onClick={handleDecrypt}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Decrypt & Show Cleaned Image
        </button>
      </div>

      {decryptedImageURL && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Decrypted Image (Should Be Clean):
          </h2>
          <img
            src={decryptedImageURL}
            alt="Decrypted"
            className="max-w-full mb-4"
          />
          <h3 className="font-semibold mb-1">Metadata After Decryption:</h3>
          <pre className="bg-gray-900 p-3 rounded text-sm">
            {JSON.stringify(decryptedMetadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ImageCleaner;
