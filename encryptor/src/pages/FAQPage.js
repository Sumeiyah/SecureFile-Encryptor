import React from "react";
import Navbar from "../components/Navbar";

function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 pt-24">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center">
          Frequently Asked Questions
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-cyan-300">How do I encrypt a file?</h2>
          <p className="text-gray-300 mt-2">
            Go to the Encrypt tool, upload your file, select an algorithm, and click Encrypt.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-cyan-300">How do I decrypt a file?</h2>
          <p className="text-gray-300 mt-2">
            Use the Decrypt tool, upload the encrypted file, enter the correct key, and click Decrypt.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-cyan-300">How do I send encrypted files by email?</h2>
          <p className="text-gray-300 mt-2">
            Encrypt your file using our tool, then send it via email. Share the key separately for security.
          </p>
        </div>

        <div className="mt-12 bg-gray-900 bg-opacity-70 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Still need help?</h2>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <textarea
              rows="5"
              placeholder="Describe your issue..."
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded text-white font-semibold"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;
