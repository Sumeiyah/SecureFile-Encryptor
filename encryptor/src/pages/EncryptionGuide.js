const EncryptionGuide = {
  "Symmetric Encryption": {
    "AES": {
      summary: "AES (Advanced Encryption Standard) is a widely used symmetric encryption algorithm for securing data.",
      details: `OVERVIEW:
Advanced Encryption Standard (AES) was established by NIST in 2001 as a replacement for the outdated DES algorithm. It is a block cipher that encrypts data in fixed blocks of 128 bits, and supports key sizes of 128, 192, or 256 bits.

HOW IT WORKS:
AES performs multiple rounds (10, 12, or 14 depending on key size) of substitution, permutation, mixing, and key addition. It uses a symmetric key, meaning the same key is used to encrypt and decrypt the data.

USAGE IN REACT APP:
Library: crypto-js
Install: npm install crypto-js
Code Example:
import CryptoJS from 'crypto-js';
const encrypted = CryptoJS.AES.encrypt("Hello World", "mySecretKey").toString();
const bytes = CryptoJS.AES.decrypt(encrypted, "mySecretKey");
const originalText = bytes.toString(CryptoJS.enc.Utf8);

BEST USE CASES:
- Encrypting large files
- Securing data in storage or transit
- Real-time secure communication (VoIP, messaging)

INVENTORS:
Joan Daemen and Vincent Rijmen (1998)`
    },
    "Blowfish": {
      summary: "Blowfish is a symmetric block cipher known for its speed and effectiveness.",
      details: `OVERVIEW:
Blowfish was designed by Bruce Schneier in 1993 as a general-purpose symmetric key algorithm to replace DES.

HOW IT WORKS:
Blowfish divides messages into 64-bit blocks and uses a variable-length key from 32 bits up to 448 bits. It consists of 16 rounds of encryption involving key-dependent S-boxes and permutations.

USAGE IN REACT APP:
Library: crypto-js (some plugins or custom implementations may be used)
Note: Not natively supported in crypto-js. You can integrate a WebAssembly-based Blowfish library or use backend support.

BEST USE CASES:
- Embedded systems
- Fast encryption with configurable security

INVENTOR:
Bruce Schneier (1993)`
    },
    "Triple DES": {
      summary: "Triple DES applies the DES algorithm three times to each data block.",
      details: `OVERVIEW:
Triple DES (3DES) was introduced as an enhancement to DES by applying the DES cipher algorithm three times to each data block.

HOW IT WORKS:
Encrypt-Decrypt-Encrypt (EDE) with three 56-bit keys (168-bit effective key). It increases security over traditional DES.

USAGE IN REACT APP:
Library: crypto-js
Install: npm install crypto-js
Code Example:
import CryptoJS from 'crypto-js';
const encrypted = CryptoJS.TripleDES.encrypt("Hello", "secretKey").toString();
const bytes = CryptoJS.TripleDES.decrypt(encrypted, "secretKey");
const text = bytes.toString(CryptoJS.enc.Utf8);

USE CASES:
- Legacy systems
- Financial applications`
    },
    "Rabbit Encrypt / Decrypt": {
      summary: "Rabbit is a high-speed stream cipher known for its strong security and low memory requirements.",
      details:
        "Rabbit is a stream cipher that encrypts data one bit or byte at a time using a pseudo-random keystream. It is designed for software efficiency and is part of the eSTREAM portfolio.\n\nIn this app, Rabbit encryption is implemented via CryptoJS. It’s useful when processing data on constrained devices and ensures both speed and security.",
    }
  },
  "Asymmetric Encryption": {
    "RSA": {
      summary: "RSA is a widely used public-key cryptosystem for secure data transmission.",
      details: `OVERVIEW:
RSA was invented in 1977 and relies on the mathematical difficulty of factoring large integers. It uses a pair of keys: public for encryption, private for decryption.

HOW IT WORKS:
- Generates two large prime numbers
- Computes modulus and totient
- Selects public exponent and derives private key

USAGE IN REACT APP:
Library: jsencrypt
Install: npm install jsencrypt
Code Example:
import JSEncrypt from 'jsencrypt';
const encryptor = new JSEncrypt();
encryptor.setPublicKey(publicKey);
const encrypted = encryptor.encrypt("message");

const decryptor = new JSEncrypt();
decryptor.setPrivateKey(privateKey);
const decrypted = decryptor.decrypt(encrypted);

USE CASES:
- Key exchange
- Secure email
- Digital signatures

INVENTORS:
Rivest, Shamir, Adleman (1977)`
    },
    "ECC": {
      summary: "Elliptic Curve Cryptography offers secure encryption with smaller keys.",
      details: `OVERVIEW:
ECC is based on the mathematics of elliptic curves over finite fields. It offers same security as RSA with much smaller key sizes.

HOW IT WORKS:
It leverages the difficulty of the Elliptic Curve Discrete Logarithm Problem (ECDLP). Key generation and encryption/decryption are faster and use less power.

USAGE IN APP:
ECC operations often handled via WebAssembly or backend.
Libraries: elliptic.js, OpenPGP.js

USE CASES:
- Mobile devices
- Blockchain
- Secure messaging

INVENTORS:
Neal Koblitz and Victor Miller (1985)`
    },
    "ElGamal": {
      summary: "ElGamal encryption is a public-key cryptosystem based on Diffie-Hellman.",
      details: `OVERVIEW:
ElGamal encryption is used for securing data and digital signatures. It is probabilistic and based on discrete logarithms.

HOW IT WORKS:
- Uses random number during encryption for each message
- Produces different ciphertexts for same plaintext

REACT IMPLEMENTATION:
Not natively available, use server-side implementation or cryptographic packages like OpenPGP.js

USE CASES:
- PGP encryption
- Digital voting

INVENTOR:
Taher ElGamal (1985)`
    }
  },
  "Hybrid Encryption": {
    "Hybrid AES + RSA": {
      summary: "Combines the speed of AES with the security of RSA.",
      details: `OVERVIEW:
Hybrid encryption uses RSA to encrypt the AES key and AES to encrypt the actual data.

HOW IT WORKS:
1. Generate a random AES key
2. Encrypt file with AES
3. Encrypt AES key with RSA public key
4. Send both encrypted file and encrypted key

USAGE IN REACT APP:
AES: crypto-js
RSA: jsencrypt
File encryption + key packaging manually managed

USE CASES:
- Email encryption
- SSL/TLS (used in HTTPS)`
    },
    "Hybrid ECC + AES": {
      summary: "Leverages ECC for key exchange and AES for data security.",
      details: `OVERVIEW:
Similar to RSA hybrid, but ECC is used instead of RSA for more efficiency in mobile devices.

HOW IT WORKS:
ECC generates shared key
AES encrypts data using the shared key

IMPLEMENTATION:
ECC via elliptic.js
AES via crypto-js

USE CASES:
- Secure messaging
- IoT devices`
    }
  },
  "Hashing": {
    "SHA-256": {
      summary: "SHA-256 is a cryptographic hash function producing a 256-bit output.",
      details: `OVERVIEW:
SHA-256 is part of the SHA-2 family designed by NSA and published in 2001. It’s widely used for data integrity.

HOW IT WORKS:
Takes arbitrary input and produces a fixed 256-bit hash.

USAGE IN REACT APP:
Library: crypto-js
Code:
import CryptoJS from 'crypto-js';
const hash = CryptoJS.SHA256("Hello").toString();

USE CASES:
- Verifying file integrity
- Blockchain
- Password hashing (combined with salt)`
    },
    "SHA-3": {
      summary: "SHA-3 is the latest SHA standard based on Keccak algorithm.",
      details: `OVERVIEW:
SHA-3 was standardized in 2015. It uses a sponge construction which is different from SHA-2’s Merkle-Damgård.

USAGE IN REACT APP:
Library: crypto-js
Code:
import CryptoJS from 'crypto-js';
const hash = CryptoJS.SHA3("Hello", { outputLength: 256 }).toString();

USE CASES:
- Cryptographic applications requiring SHA-3’s design`
    },
    "bcrypt": {
      summary: "bcrypt is used to securely hash passwords with salting and key stretching.",
      details: `OVERVIEW:
bcrypt was created for password hashing. It includes salt automatically and allows specifying work factor.

HOW IT WORKS:
- Hash includes salt
- Work factor (rounds) slows down brute-force attacks

USAGE IN REACT APP:
Library: bcryptjs
Install: npm install bcryptjs
Code:
import bcrypt from 'bcryptjs';
const hash = bcrypt.hashSync("mypassword", 10);
const isMatch = bcrypt.compareSync("mypassword", hash);

USE CASES:
- Password storage in databases
- Authentication systems`
    }
  },
  "Educational Encryptors": {
    "ChaCha20 (Stream Cipher)": {
  summary: "Encrypt and decrypt text or files using the ChaCha20 stream cipher.",
  details: `OVERVIEW:
ChaCha20 is a modern, high-speed stream cipher known for its strong security and efficiency. It is widely used in protocols like TLS 1.3, SSH, and VPNs (WireGuard).

HOW IT WORKS:
ChaCha20 uses a secret key and a unique nonce (number used once) to generate a pseudorandom keystream. This keystream is XORed with the plaintext to produce ciphertext. The same process, using the same key and nonce, decrypts the ciphertext back into the original data.

REACT USAGE:
Implemented in our project using JavaScript libraries for ChaCha20 encryption and the Web Crypto API for secure key hashing and random nonce generation.  
Our UI accepts text or file uploads, processes them into binary form, applies ChaCha20 encryption, and outputs either encrypted text (Base64) or encrypted file blobs ready for download.

USE CASES IN OUR PROJECT:
- Encrypting sensitive messages directly in the browser before sending them
- Securing uploaded files without exposing the encryption key to the server
- Providing a fast, modern alternative to AES for privacy-focused users

WHY IT’S IMPORTANT:
ChaCha20 offers a high level of security and is designed to be faster than AES on devices without hardware acceleration. It also avoids some weaknesses of older ciphers like DES and Triple DES, making it a strong recommendation for modern encryption needs in our tool.`
},

    "Text ↔ Binary / Hex Converter": {
      summary: "Convert text to binary or hex and back.",
      details: `OVERVIEW:
Converts text to its binary or hexadecimal equivalent.

HOW IT WORKS:
Each character is translated to its ASCII value then to binary or hex.

REACT USAGE:
Handled using simple string and buffer logic.

USE CASES:
- Learning data encoding
- Debugging and low-level programming`
    }
  }
};

export default EncryptionGuide;
