import React, { useEffect, useState } from "react"; // React component + hooks
import { useLocation } from "react-router-dom";     // Read ?alg=AES from the URL
import CryptoJS from "crypto-js";                   // Crypto library for AES/3DES/Blowfish/Rabbit + PBKDF2
import Navbar from "../components/Navbar";          // Your top navigation

/* =========================
   Helpers: bytes <-> WordArray
   (lets us encrypt/decrypt real file bytes safely)
========================= */
const uint8ToWordArray = (u8arr) => {                       // Convert Uint8Array to CryptoJS WordArray
  const words = [];                                         // Will hold 32-bit words
  for (let i = 0; i < u8arr.length; i += 4) {               // Process 4 bytes at a time
    words.push(                                             // Pack 4 bytes into one 32-bit word
      (((u8arr[i] || 0) << 24) |                            // byte 0 → highest
        ((u8arr[i + 1] || 0) << 16) |                       // byte 1
        ((u8arr[i + 2] || 0) << 8) |                        // byte 2
        (u8arr[i + 3] || 0)) >>> 0                          // byte 3 → lowest (>>>0 keeps it unsigned)
    );
  }
  return CryptoJS.lib.WordArray.create(words, u8arr.length); // Build WordArray with original length
};

const wordArrayToUint8 = (wa) => {                           // Convert CryptoJS WordArray back to bytes
  const { words, sigBytes } = wa;                            // sigBytes = actual byte length
  const u8 = new Uint8Array(sigBytes);                       // Prepare byte output
  let i = 0, j = 0;                                          // i walks bytes, j walks words
  while (i < sigBytes) {                                     // Until all bytes written
    const w = words[j++] ?? 0;                               // Next 32-bit word (0 if none)
    u8[i++] = (w >>> 24) & 0xff; if (i === sigBytes) break;  // Write byte #1
    u8[i++] = (w >>> 16) & 0xff; if (i === sigBytes) break;  // Write byte #2
    u8[i++] = (w >>> 8) & 0xff;  if (i === sigBytes) break;  // Write byte #3
    u8[i++] = w & 0xff;                                      // Write byte #4
  }
  return u8;                                                 // Return raw bytes
};

/* =========================
   Cipher spec + key derivation
========================= */
const CIPHER_SPEC = {                                        // Map of supported algorithms
  AES:       { cipher: CryptoJS.AES,       keySize: 256 / 32, useCBC: true  }, // AES-256, CBC
  TripleDES: { cipher: CryptoJS.TripleDES, keySize: 192 / 32, useCBC: true  }, // 3DES-192, CBC
  Blowfish:  { cipher: CryptoJS.Blowfish,  keySize: 256 / 32, useCBC: true  }, // Blowfish-256, CBC
  Rabbit:    { cipher: CryptoJS.Rabbit,    keySize: 128 / 32, useCBC: false }, // Rabbit stream, no CBC
};

const deriveKey = (password, salt, words) =>                 // PBKDF2 turns password+salt → fixed-length key
  CryptoJS.PBKDF2(password, salt, { keySize: words, iterations: 100000 }); // 100k iters (good CPU cost)

const randBytesHex = (len) =>                                // Create secure random bytes and return hex string
  CryptoJS.lib.WordArray.random(len).toString(CryptoJS.enc.Hex);

/* =========================
   Input validation helpers
========================= */
const MIN_KEY_LEN = 6;                                       // Simple minimum; adjust to your policy
const MAX_FILE_BYTES = 50 * 1024 * 1024;                     // 50 MB max (tune as you like)

const isEmpty = (s) => !s || !s.trim();                      // Blank/whitespace check

const ensureKeyValid = (key) => {                            // Validate password/key
  if (isEmpty(key)) throw new Error("Enter a key/password.");
  if (key.length < MIN_KEY_LEN) throw new Error(`Key must be at least ${MIN_KEY_LEN} characters.`);
};

const ensureTextPresent = (s, mode) => {                     // Validate text presence based on mode
  if (isEmpty(s)) {
    throw new Error(mode === "encrypt" ? "Type some text to encrypt." : "Paste the encrypted JSON to decrypt.");
  }
};

const ensureFileForEncrypt = (file) => {                     // Basic file checks for encryption
  if (!file) throw new Error("Choose a file to encrypt.");
  if (file.size > MAX_FILE_BYTES) throw new Error(`File is too large (>${(MAX_FILE_BYTES/1024/1024)|0} MB).`);
};

const ensureFileForDecrypt = (file) => {                     // Basic file checks for decryption
  if (!file) throw new Error("Choose a .enc JSON file to decrypt.");
  // Soft check: name/extension (we still parse JSON later)
  const looksEnc = /\.enc$/i.test(file.name) || /json|text/.test(file.type || "");
  if (!looksEnc) throw new Error("Please select the .enc (JSON) file produced by this app.");
  if (file.size > MAX_FILE_BYTES) throw new Error(`File is too large (>${(MAX_FILE_BYTES/1024/1024)|0} MB).`);
};

/* =========================
   Core encrypt/decrypt (shared)
========================= */
function encryptWordArrayGeneric(plainWA, password, alg) {   // Encrypt any WordArray with selected algorithm
  const spec = CIPHER_SPEC[alg];                             // Find the algorithm spec
  if (!spec) throw new Error("Unsupported algorithm.");
  const saltHex = randBytesHex(16);                          // 16 random bytes → hex salt
  const ivHex   = randBytesHex(16);                          // 16 random bytes → hex IV
  const salt = CryptoJS.enc.Hex.parse(saltHex);              // Convert hex → WordArray
  const iv   = CryptoJS.enc.Hex.parse(ivHex);                // Convert hex → WordArray
  const keyW = deriveKey(password, salt, spec.keySize);      // PBKDF2 derive key
  const opts = spec.useCBC                                   // CBC needs IV + padding; Rabbit does its own thing
    ? { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    : { iv };
  const cp = spec.cipher.encrypt(plainWA, keyW, opts);       // Run encryption
  const ctB64 = cp.ciphertext.toString(CryptoJS.enc.Base64); // Ciphertext as Base64 string

  return { version: 1, alg, saltHex, ivHex, ctB64 };         // Self-contained envelope (no preview shown in UI)
}

function decryptPayloadGeneric(payload, password) {          // Decrypt the JSON envelope using password
  if (!payload || payload.version !== 1) {                   // Ensure expected format
    throw new Error("Unsupported/old encrypted format. Re-encrypt with the latest app.");
  }
  const spec = CIPHER_SPEC[payload.alg];                     // Match algorithm used
  if (!spec) throw new Error("Unsupported algorithm in payload.");

  const salt = CryptoJS.enc.Hex.parse(payload.saltHex);      // Restore salt WordArray
  const iv   = CryptoJS.enc.Hex.parse(payload.ivHex);        // Restore IV WordArray
  const keyW = deriveKey(password, salt, spec.keySize);      // Re-derive key
  const opts = spec.useCBC                                   // Same mode/padding used during encryption
    ? { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    : { iv };

  const ctWA = CryptoJS.enc.Base64.parse(payload.ctB64);     // Base64 → bytes (WordArray)
  const cp   = CryptoJS.lib.CipherParams.create({ ciphertext: ctWA }); // Wrap for CryptoJS
  const decWA = spec.cipher.decrypt(cp, keyW, opts);         // Decrypt to WordArray

  if (!decWA || typeof decWA.sigBytes !== "number" || decWA.sigBytes <= 0) { // Sanity check
    throw new Error("Wrong key or corrupted data.");
  }
  return decWA;                                              // Return plaintext bytes (WordArray)
}

/* =========================
   Component: EncryptDecrypt (unified)
========================= */
function EncryptDecrypt() {
  const location = useLocation();                                                // Access current URL
  const queryParams = new URLSearchParams(location.search);                      // Read query params
  const defaultAlgorithm = queryParams.get("alg") || "AES";                      // Default alg from ?alg=...

  const [mode, setMode] = useState("encrypt");                                   // "encrypt" | "decrypt"
  const [inputType, setInputType] = useState("text");                            // "text" | "file"
  const [algorithm, setAlgorithm] = useState(defaultAlgorithm);                  // Selected algorithm
  const [key, setKey] = useState("");                                            // Password/key user enters

  const [text, setText] = useState("");                                          // Text area value (plain or JSON)
  const [file, setFile] = useState(null);                                        // Selected file handle

  const [outputText, setOutputText] = useState("");                              // Shows encrypted JSON or decrypted text

  useEffect(() => {                                                               // Keep algorithm in sync with URL
    setAlgorithm(defaultAlgorithm);                                               // If ?alg changes, update dropdown
  }, [defaultAlgorithm]);

  const handleFileChange = (e) => setFile(e.target.files[0]);                    // Save chosen file

  /* ---------- TEXT flow ---------- */
  const handleTextEncrypt = () => {                                               // Encrypt the text in the textarea
    try {
      ensureKeyValid(key);                                                        // Validate key
      ensureTextPresent(text, "encrypt");                                         // Validate text
      const plainWA = CryptoJS.enc.Utf8.parse(text);                              // UTF-8 → bytes
      const payload = encryptWordArrayGeneric(plainWA, key, algorithm);           // Build envelope
      const envelope = { ...payload, kind: "text", name: null, type: "text/plain" }; // Tag as text
      setOutputText(JSON.stringify(envelope, null, 2));                           // Show JSON result (copyable)
    } catch (e) {
      alert(e.message);                                                           // Friendly error
    }
  };

  const handleTextDecrypt = () => {                                               // Decrypt the JSON pasted in textarea
    try {
      ensureKeyValid(key);                                                        // Validate key
      ensureTextPresent(text, "decrypt");                                         // Must paste JSON
      const payload = JSON.parse(text);                                           // Parse the envelope
      const decWA = decryptPayloadGeneric(payload, key.trim());                   // Decrypt to WordArray
      const utf8 = CryptoJS.enc.Utf8.stringify(decWA);                            // Bytes → string
      setOutputText(utf8);                                                        // Show plaintext
    } catch (e) {
      alert(e.message || "Decryption failed.");                                   // Friendly error
    }
  };

  /* ---------- FILE flow ---------- */
  const handleFileEncrypt = () => {                                               // Encrypt a chosen file and download .enc
    try {
      ensureKeyValid(key);                                                        // Validate key
      ensureFileForEncrypt(file);                                                 // Validate file
      const reader = new FileReader();                                            // File → bytes
      reader.onload = () => {
        try {
          const u8 = new Uint8Array(reader.result);                               // Raw file bytes
          const wa = uint8ToWordArray(u8);                                        // Bytes → WordArray
          const payload = encryptWordArrayGeneric(wa, key, algorithm);            // Build envelope
          const envelope = {                                                      // Add metadata to recover original
            ...payload,
            kind: "file",
            name: file.name,
            type: file.type || "application/octet-stream",
          };
          const pretty = JSON.stringify(envelope, null, 2);                       // Nicely formatted JSON
          const blob = new Blob([pretty], { type: "application/json" });          // Make a downloadable blob
          const link = document.createElement("a");                                // Hidden <a> for download
          link.href = URL.createObjectURL(blob);                                   // Point to blob
          link.download = `${file.name}.enc`;                                      // Save as originalname.enc
          link.click();                                                            // Trigger download
        } catch (e) {
          alert(e.message || "Encryption failed.");                                // Friendly error
        }
      };
      reader.readAsArrayBuffer(file);                                              // Read as raw bytes
    } catch (e) {
      alert(e.message);                                                            // Validation/file read errors
    }
  };

  const handleFileDecrypt = () => {                                               // Decrypt a .enc JSON file back to original
    try {
      ensureKeyValid(key);                                                        // Validate key
      ensureFileForDecrypt(file);                                                 // Validate file type/size
      const reader = new FileReader();                                            // Read the JSON
      reader.onload = () => {
        try {
          const payload = JSON.parse(reader.result);                              // Parse envelope JSON
          const decWA = decryptPayloadGeneric(payload, key.trim());               // Decrypt to bytes
          if (payload.kind === "file") {                                          // If it was a file
            const u8 = wordArrayToUint8(decWA);                                   // WordArray → Uint8Array
            const blob = new Blob([u8], { type: payload.type || "application/octet-stream" }); // Build Blob
            const link = document.createElement("a");                              // Download anchor
            link.href = URL.createObjectURL(blob);                                 // Blob URL
            link.download = payload.name || "decrypted.bin";                       // Restore original name
            link.click();                                                          // Trigger download
          } else {                                                                 // If it was text
            const utf8 = CryptoJS.enc.Utf8.stringify(decWA);                       // Bytes → string
            setOutputText(utf8);                                                   // Show plaintext
          }
        } catch (e) {
          alert(e.message || "Decryption failed.");                                // Friendly error
        }
      };
      reader.readAsText(file);                                                     // .enc JSON is plain text
    } catch (e) {
      alert(e.message);                                                            // Validation errors
    }
  };

  const onProcessClick = () => {                                                   // Single button handler based on mode/input
    if (inputType === "text") {                                                    // Text branch
      return mode === "encrypt" ? handleTextEncrypt() : handleTextDecrypt();       // Encrypt or decrypt text
    }
    return mode === "encrypt" ? handleFileEncrypt() : handleFileDecrypt();         // Encrypt or decrypt file
  };

  /* =========================
     UI below (no comments inside JSX per your style)
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {mode === "encrypt" ? "🔐 Encrypt" : "🛡️ Decrypt"} Text or Files
        </h2>

        {/* Mode & Algorithm & Input Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <label className="block font-semibold mb-1">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 w-full"
            >
              <option value="encrypt">Encrypt</option>
              <option value="decrypt">Decrypt</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block font-semibold mb-1">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 w-full"
            >
              <option value="AES">AES</option>
              <option value="TripleDES">Triple DES</option>
              <option value="Blowfish">Blowfish</option>
              <option value="Rabbit">Rabbit</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block font-semibold mb-1">Input Type</label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 w-full"
            >
              <option value="text">{mode === "encrypt" ? "Encrypt" : "Decrypt"} Text</option>
              <option value="file">{mode === "encrypt" ? "Encrypt" : "Decrypt"} File</option>
            </select>
          </div>
        </div>

        {/* Key */}
        <div className="mb-2">
          <label className="block font-semibold mb-1">{mode === "encrypt" ? "Encryption Key" : "Decryption Key"}</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 w-full"
            placeholder={`Enter key (min ${MIN_KEY_LEN} chars)`}
          />
        </div>
       

        {/* TEXT mode */}
        {inputType === "text" ? (
          <>
            <div className="mb-6">
              <label className="block font-semibold mb-1">
                {mode === "encrypt" ? "Text to Encrypt" : "Encrypted JSON"}
              </label>
              <textarea
                rows="7"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 w-full font-mono"
                placeholder={
                  mode === "encrypt"
                    ? "Type your text here…"
                    : 'Paste JSON here: {"version":1,"alg":"AES","saltHex":"...","ivHex":"...","ctB64":"...","kind":"text"}'
                }
              />
            </div>

            <button
              onClick={onProcessClick}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
            >
              {mode === "encrypt" ? "Encrypt Text" : "Decrypt Text"}
            </button>

            {!!outputText && (
              <div className="mt-6">
                <label className="block font-semibold mb-1">
                  {mode === "encrypt" ? "Encrypted Envelope (JSON)" : "Decrypted Output"}
                </label>
                <textarea
                  rows="8"
                  readOnly
                  value={outputText}
                  className={`bg-gray-900 border border-gray-600 rounded px-3 py-2 w-full font-mono ${
                    mode === "encrypt" ? "text-green-400" : "text-white"
                  }`}
                />
              </div>
            )}
          </>
        ) : (
          /* FILE mode */
          <>
            <div className="mb-4">
              <input
                type="file"
                accept={mode === "decrypt" ? ".enc,application/json,text/plain" : "*/*"}
                onChange={handleFileChange}
                className="text-white"
              />
              {mode === "encrypt" && (
                <p className="text-xs text-gray-400 mt-1">Max file size: {(MAX_FILE_BYTES/1024/1024)|0} MB.</p>
              )}
            </div>

            <button
              onClick={onProcessClick}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
            >
              {mode === "encrypt" ? "Encrypt File (downloads .enc)" : "Decrypt File"}
            </button>
            {/* Note: preview removed on purpose */}
          </>
        )}
      </div>
    </div>
  );
}

export default EncryptDecrypt;
