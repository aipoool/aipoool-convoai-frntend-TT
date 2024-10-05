"use client";

import { Button } from "@/components/ui/button";
import { FiLinkedin, FiTwitter } from "react-icons/fi";
import { RiTwitterXLine } from "react-icons/ri";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const GridBackground = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridSize = 50;
  const columns = Math.ceil(windowSize.width / gridSize);
  const rows = Math.ceil(windowSize.height / gridSize);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[...Array(rows)].map((_, rowIndex) =>
          [...Array(columns)].map((_, colIndex) => (
            <motion.line
              key={`${rowIndex}-${colIndex}`}
              x1={colIndex * gridSize}
              y1={rowIndex * gridSize}
              x2={(colIndex + 1) * gridSize}
              y2={rowIndex * gridSize}
              stroke="#4f89b7"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: (rowIndex + colIndex) * 0.1,
              }}
            />
          ))
        )}
        {[...Array(columns)].map((_, colIndex) =>
          [...Array(rows)].map((_, rowIndex) => (
            <motion.line
              key={`${colIndex}-${rowIndex}-vertical`}
              x1={colIndex * gridSize}
              y1={rowIndex * gridSize}
              x2={colIndex * gridSize}
              y2={(rowIndex + 1) * gridSize}
              stroke="#4f89b7"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: (rowIndex + colIndex) * 0.1,
              }}
            />
          ))
        )}
      </svg>
    </div>
  );
};

const extensionId = 'dnjmipaneoddchfeamgdabpiomihncii';
interface UserData {
  [key: string]: unknown;
}

export default function RegistrationCompletePage() {
  const [userjwt, setUserjwt] = useState<string>('');

  const handleAboutClick = () => {
    window.location.href = "https://aipoool.com/";
  };

  function hexStringToArrayBuffer(hexString: string): ArrayBuffer {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return bytes.buffer;
  }

  async function getKeyMaterial(password: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
  }

  async function deriveKey(keyMaterial: CryptoKey, salt: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const saltBuffer = enc.encode(salt);
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async function decryptToken(encryptedTokenWithIv: string): Promise<string> {
    const password = "ConvoAI@2096"; // Replace with your actual secret
    const keyMaterial = await getKeyMaterial(password);
    const salt = "ConvoSalty@2096"; // Replace with your actual salt

    const key = await deriveKey(keyMaterial, salt);
    const encryptedData = hexStringToArrayBuffer(encryptedTokenWithIv);
    const iv = encryptedData.slice(0, 12);
    const ciphertext = encryptedData.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  }

  function decodeJwtToken(token: string): UserData | null {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  }

  const fetchSessionData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedTokenWithIv = urlParams.get('token');

    if (encryptedTokenWithIv) {
      try {
        const jwtToken = await decryptToken(encryptedTokenWithIv);
        console.log("jwtToken", jwtToken);
        setUserjwt(jwtToken);
        const tokenData = decodeJwtToken(jwtToken);
        if (tokenData) {

          // Message sent to the extension
          if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage(
              extensionId,
              {
                type: "convoai-login-data",
                info: tokenData,
                jwtToken: jwtToken,
              },
              function (response: { success: boolean }) {
                if (!response || !response.success) {
                  console.log("Error sending message", response);
                }
              }
            );
          }
        }
      } catch (error) {
        console.error("Failed to decrypt token:", error);
      }
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  useEffect(() => {
    if (userjwt) {
      localStorage.setItem('convoaiUserProfData', JSON.stringify(userjwt));
    }
  }, [userjwt]);

    return (
      <div className="flex flex-col min-h-screen bg-white overflow-hidden">
        <GridBackground />

        <header className="flex justify-between items-center p-4 bg-white bg-opacity-80 shadow-sm z-10">
          <Image src="" alt="Logo" width={100} height={40} />
          <div className="flex space-x-4">
            <FiLinkedin className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
            <FiTwitter className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
            <RiTwitterXLine className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-4 z-10">
          <div className="w-full max-w-6xl flex items-center justify-between">
            <div className="w-1/2 space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-[#4f89b7]">
                  Registration Complete!
                </h2>
                <p className="mt-2 text-gray-600">
                  Thank you for joining ConvoAI
                </p>
              </div>

              <motion.div
                className="w-full py-2 px-4 bg-[#4f89b7] text-white rounded-md shadow-lg flex items-center justify-center space-x-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="text-2xl inline-block"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    delay: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  ✓
                </motion.span>
                <span>Your account has been created successfully</span>
              </motion.div>

              <div className="flex justify-between mt-4">
                <motion.div
                  className="w-[48%]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="w-full">
                    Go to Main Page
                  </Button>
                </motion.div>
                <motion.div
                  className="w-[48%]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAboutClick}
                >
                  <Button variant="outline" className="w-full">
                    About AIPoool
                  </Button>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="w-1/2 flex justify-center"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Image
                src="/reg_suc.png"
                alt="Woman working on laptop"
                width={400}
                height={400}
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.1))" }}
              />
            </motion.div>
          </div>
        </main>

        <footer className="bg-white bg-opacity-80 shadow-sm mt-8 z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              <a href="#" className="text-[#4f89b7] hover:text-[#3a6d94]">
                Terms & Conditions
              </a>
              <a href="#" className="text-[#4f89b7] hover:text-[#3a6d94]">
                Privacy Policy
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <Image src="" alt="Logo" width={80} height={32} />
            </div>
          </div>
        </footer>
      </div>
    );
  }
