import React from "react";
import Navbar from "../components/Navbar";
import { FaEnvelope, FaPhone, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 tracking-tight">
            Contact Us
          </h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto">
            We’re here to help. Reach us via email or phone, or connect on social.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email Card */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/10 transition">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-900/40 border border-cyan-800">
                <FaEnvelope className="text-cyan-400 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Email</h3>
                <p className="text-gray-300 mt-1">
                  For support, billing, or general inquiries.
                </p>
                <a
                  href="mailto:support@securefile.com"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition"
                >
                  <FaEnvelope /> support@securefile.com
                </a>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/10 transition">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-900/40 border border-cyan-800">
                <FaPhone className="text-cyan-400 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Phone</h3>
                <p className="text-gray-300 mt-1">
                  Mon–Fri, 9:00–17:00 (EAT)
                </p>
                <a
                  href="tel:+1234567890"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition"
                >
                  <FaPhone /> +123 456 7890
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social + Meta */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
            <p className="text-gray-300 mb-5">
              Get product updates, tips, and security best practices.
            </p>
            <div className="flex justify-center gap-6 text-2xl">
              <a
                href="#"
                className="text-blue-400 hover:text-blue-500 transition"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-pink-400 hover:text-pink-500 transition"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-cyan-400 hover:text-cyan-500 transition"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>

            <div className="mt-6 text-sm text-gray-400">
              © 2025 SecureFile Encryptor. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
