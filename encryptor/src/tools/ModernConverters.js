import React, { useEffect, useMemo, useState } from "react"; 
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { logToolActivity } from "../utils/logger";

/* requireLogin: simple gate to prevent anonymous use of sensitive tools */
const requireLogin = () => {
  const isLoggedIn =
    !!localStorage.getItem("user") || !!localStorage.getItem("currentUser");
  if (!isLoggedIn) {
    alert("Please log in to use this tool.");
    window.location.href = "/login";
    return false;
  }
  return true;
};

/* -----------------------------------------------------------
   Component: EducationalTools
   Tabs:
     1) URL Encoder / Decoder
     2) Base64 encoder/decoder
     3) Text ↔ Binary/Hex converter
----------------------------------------------------------- */
function EducationalTools() {
  // Read ?alg=... from URL so /tools?alg=url lands on the URL tab
  const location = useLocation();
  const urlAlg = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("alg");
  }, [location.search]);

  // Default to "base64" unless URL asks for url
  const [activeTool, setActiveTool] = useState(
    urlAlg && urlAlg.toLowerCase() === "url" ? "url" : "base64"
  );

  /* ---------- URL Encoder / Decoder state ---------- */
  const [urlInput, setUrlInput] = useState("");       // text to encode/decode
  const [urlResult, setUrlResult] = useState("");     // output after operation
  const [urlMode, setUrlMode] = useState("encode");   // "encode" | "decode"

  /* ---------- Base64 state ---------- */
  const [base64Input, setBase64Input] = useState("");
  const [base64Result, setBase64Result] = useState("");
  const [base64Mode, setBase64Mode] = useState("encode");

  /* ---------- Binary/Hex state ---------- */
  const [binaryHexInput, setBinaryHexInput] = useState("");
  const [binaryHexResult, setBinaryHexResult] = useState("");
  const [convertMode, setConvertMode] = useState("text-to-binary");

  // If URL query contains alg=url, switch tab
  useEffect(() => {
    if (urlAlg && urlAlg.toLowerCase() === "url") {
      setActiveTool("url");
    }
  }, [urlAlg]);

  /* -------------------------------
     URL Handlers (encode/decode)
  --------------------------------*/
  const handleUrl = () => {
    if (!requireLogin()) return;
    try {
      if (!urlInput) {
        alert(
          urlMode === "encode"
            ? "Enter text to URL-encode."
            : "Enter text to URL-decode."
        );
        return;
      }

      if (urlMode === "encode") {
        // Encode text so it can safely appear in a URL or query string
        const encoded = encodeURIComponent(urlInput);
        setUrlResult(encoded);
        logToolActivity("URL", "encode");
      } else {
        // Decode URL-encoded text back to its original form
        const decoded = decodeURIComponent(urlInput);
        setUrlResult(decoded);
        logToolActivity("URL", "decode");
      }
    } catch (e) {
      console.error(e);
      setUrlResult(
        urlMode === "encode"
          ? "Encoding failed."
          : "Decoding failed. Input is not valid URL-encoded text."
      );
      logToolActivity("URL", urlMode, "failed");
    }
  };

  /* -------------------------------
     Base64 Handlers
  --------------------------------*/
  const handleBase64 = () => {
    if (!requireLogin()) return;
    try {
      if (base64Mode === "encode") {
        const encoded = btoa(base64Input);
        setBase64Result(encoded);
        logToolActivity("Base64", "encode");
      } else {
        const decoded = atob(base64Input);
        setBase64Result(decoded);
        logToolActivity("Base64", "decode");
      }
    } catch (e) {
      setBase64Result("Invalid input for decoding.");
      logToolActivity(
        "Base64",
        base64Mode === "encode" ? "encode" : "decode",
        "failed"
      );
    }
  };

  /* -------------------------------
     Binary/Hex Handlers
  --------------------------------*/
  const handleBinaryHexConvert = () => {
    if (!requireLogin()) return;
    try {
      let result = "";
      if (convertMode === "text-to-binary") {
        result = binaryHexInput
          .split("")
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
          .join(" ");
      } else if (convertMode === "binary-to-text") {
        result = binaryHexInput
          .split(" ")
          .map((bin) => String.fromCharCode(parseInt(bin, 2)))
          .join("");
      } else if (convertMode === "text-to-hex") {
        result = binaryHexInput
          .split("")
          .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(" ");
      } else if (convertMode === "hex-to-text") {
        result = binaryHexInput
          .split(" ")
          .map((hex) => String.fromCharCode(parseInt(hex, 16)))
          .join("");
      }
      setBinaryHexResult(result);
      logToolActivity("Binary/Hex Converter", convertMode);
    } catch (e) {
      setBinaryHexResult("Invalid conversion input.");
      logToolActivity("Binary/Hex Converter", convertMode, "failed");
    }
  };

  /* -------------------------------
     Renderers
  --------------------------------*/
  const renderUrl = () => (
    <>
      <textarea
        className="w-full bg-gray-700 p-2 mb-3 rounded"
        placeholder={
          urlMode === "encode"
            ? "Enter text to URL-encode (e.g., Hello World!)"
            : "Enter URL-encoded text to decode (e.g., Hello%20World%21)"
        }
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
      />
      <div className="flex gap-3 mb-3">
        <select
          className="bg-gray-700 p-2 rounded"
          value={urlMode}
          onChange={(e) => setUrlMode(e.target.value)}
        >
          <option value="encode">Encode (make URL-safe)</option>
          <option value="decode">Decode (readable text)</option>
        </select>
        <button
          onClick={handleUrl}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Run URL Tool
        </button>
      </div>
      {urlResult && (
        <div className="mt-4 p-3 bg-gray-800 rounded text-green-300 font-mono break-all">
          {urlResult}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-2">
        Tip: <code>encodeURIComponent</code> encodes characters like spaces, ?, &amp;, = for
        safe use in query strings. <code>decodeURIComponent</code> reverses it.
      </p>
    </>
  );

  const renderBase64 = () => (
    <>
      <textarea
        className="w-full bg-gray-700 p-2 mb-3 rounded"
        placeholder="Enter text to encode or decode"
        value={base64Input}
        onChange={(e) => setBase64Input(e.target.value)}
      />
      <select
        className="bg-gray-700 p-2 rounded mb-3 w-full"
        value={base64Mode}
        onChange={(e) => setBase64Mode(e.target.value)}
      >
        <option value="encode">Encode to Base64</option>
        <option value="decode">Decode from Base64</option>
      </select>
      <button
        onClick={handleBase64}
        className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
      >
        Run Base64
      </button>
      {base64Result && (
        <div className="mt-4 p-3 bg-gray-800 rounded text-blue-300 font-mono break-all">
          {base64Result}
        </div>
      )}
    </>
  );

  const renderBinaryHex = () => (
    <>
      <textarea
        className="w-full bg-gray-700 p-2 mb-3 rounded"
        placeholder="Enter text, binary, or hex depending on mode"
        value={binaryHexInput}
        onChange={(e) => setBinaryHexInput(e.target.value)}
      />
      <select
        className="bg-gray-700 p-2 rounded mb-3 w-full"
        value={convertMode}
        onChange={(e) => setConvertMode(e.target.value)}
      >
        <option value="text-to-binary">Text → Binary</option>
        <option value="binary-to-text">Binary → Text</option>
        <option value="text-to-hex">Text → Hex</option>
        <option value="hex-to-text">Hex → Text</option>
      </select>
      <button
        onClick={handleBinaryHexConvert}
        className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
      >
        Convert
      </button>
      {binaryHexResult && (
        <div className="mt-4 p-3 bg-gray-800 rounded text-pink-300 font-mono break-all">
          {binaryHexResult}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">🧪 Educational Tools</h2>
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTool("url")}
            className={`px-4 py-2 rounded ${activeTool === "url" ? "bg-green-600" : "bg-gray-700"}`}
          >
            URL Encoder / Decoder
          </button>
          <button
            onClick={() => setActiveTool("base64")}
            className={`px-4 py-2 rounded ${activeTool === "base64" ? "bg-indigo-600" : "bg-gray-700"}`}
          >
            Base64 Encoder / Decoder
          </button>
          <button
            onClick={() => setActiveTool("binary")}
            className={`px-4 py-2 rounded ${activeTool === "binary" ? "bg-purple-600" : "bg-gray-700"}`}
          >
            Text ↔ Binary / Hex
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded shadow">
          {activeTool === "url" && renderUrl()}
          {activeTool === "base64" && renderBase64()}
          {activeTool === "binary" && renderBinaryHex()}
        </div>
      </div>
    </div>
  );
}

export default EducationalTools;
