"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, Check, Loader2, FileIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function ReceiveCard() {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  
  const [isLoading, setIsLoading] = useState(false);
  const [shareData, setShareData] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
    if (pastedData) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);
      if (pastedData.length < 4) {
        inputRefs[pastedData.length].current?.focus();
      } else {
        inputRefs[3].current?.focus();
      }
    }
  };

  const handleReceive = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 4) {
      toast.error("Please enter a 4-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/share/${fullCode}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to retrieve share");
      }

      setShareData({ ...data, code: fullCode });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (shareData?.code && !shareData.isText) {
      window.location.href = `/api/share/${shareData.code}/download`;
    }
  };

  const copyText = () => {
    if (shareData?.textContent) {
      navigator.clipboard.writeText(shareData.textContent);
      setIsCopied(true);
      toast.success("Text copied!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="glass-panel rounded-2xl p-8 w-full max-w-md mx-auto relative overflow-hidden transition-all duration-300"
    >
      <AnimatePresence mode="wait">
        {!shareData ? (
          <motion.div key="input" exit={{ opacity: 0, scale: 0.95 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-[#06b6d4]/20 text-[#06b6d4]">
                <Download size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Receive</h2>
                <p className="text-sm text-gray-400">Enter the 4-digit code.</p>
              </div>
            </div>

            <div className="flex justify-between gap-3 mb-8">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={inputRefs[i]}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  className="w-16 h-20 bg-black/40 border border-gray-600 rounded-xl text-center text-4xl font-bold focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-all"
                  maxLength={1}
                />
              ))}
            </div>

            <button 
              onClick={handleReceive}
              disabled={isLoading || code.join("").length !== 4}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#06b6d4]/20"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Receive File"
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
              <button 
                onClick={() => {
                  setShareData(null);
                  setCode(["", "", "", ""]);
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                ← Back
              </button>
              <h2 className="text-lg font-bold ml-auto">Received Content</h2>
            </div>
            
            {shareData.isText ? (
              <div className="mb-6">
                <div className="bg-black/40 border border-gray-700 rounded-xl p-4 max-h-48 overflow-y-auto mb-4 text-sm whitespace-pre-wrap">
                  {shareData.textContent}
                </div>
                <button 
                  onClick={copyText}
                  className="w-full py-3 rounded-xl font-medium border border-gray-600 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  {isCopied ? <Check size={18} className="text-green-400"/> : <Copy size={18} />}
                  {isCopied ? "Copied!" : "Copy Text"}
                </button>
              </div>
            ) : (
              <div className="text-center mb-6 py-6 bg-black/20 rounded-xl border border-gray-800">
                <FileIcon className="w-16 h-16 text-[#06b6d4] mx-auto mb-4" />
                <h3 className="font-medium text-lg px-4 truncate mb-1">{shareData.fileName}</h3>
                <p className="text-sm text-gray-400 mb-6">{(shareData.fileSize / 1024 / 1024).toFixed(2)} MB • {shareData.fileType}</p>
                
                <button 
                  onClick={handleDownload}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#06b6d4]/20"
                >
                  <Download size={20} />
                  Download File
                </button>
              </div>
            )}
            
            <p className="text-xs text-center text-gray-500">
              Expires at {new Date(shareData.expiresAt).toLocaleTimeString()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
