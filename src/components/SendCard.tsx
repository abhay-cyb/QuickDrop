"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File as FileIcon, X, Copy, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SendCard() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setText("");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setText("");
    }
  };

  const handleUpload = async () => {
    if (!file && !text.trim()) {
      toast.error("Please provide a file or some text");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else if (text) {
        formData.append("textContent", text);
      }

      const res = await fetch("/api/share", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate code");
      }

      setShareCode(data.code);
      toast.success("Ready to share!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    if (shareCode) {
      navigator.clipboard.writeText(shareCode);
      setIsCopied(true);
      toast.success("Code copied!");
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
        {!shareCode ? (
          <motion.div key="upload" exit={{ opacity: 0, scale: 0.95 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6]">
                <UploadCloud size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Send</h2>
                <p className="text-sm text-gray-400">Upload a file or share text.</p>
              </div>
            </div>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center mb-4 min-h-[160px]
                ${isDragging ? "border-[#8b5cf6] bg-[#8b5cf6]/10" : "border-gray-600 hover:border-[#8b5cf6]/50 hover:bg-white/5"}
                ${file ? "border-[#06b6d4]/50 bg-[#06b6d4]/5 cursor-default" : ""}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-2 relative w-full">
                  <FileIcon className="text-[#06b6d4] w-12 h-12" />
                  <span className="text-sm font-medium truncate w-full px-4">{file.name}</span>
                  <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="absolute -top-4 -right-4 p-1 bg-gray-800 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="font-medium">Drop your file here</p>
                  <p className="text-xs text-gray-500 mt-1">Maximum file size: 100 MB</p>
                </>
              )}
            </div>

            {!file && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px bg-gray-700 flex-1"></div>
                  <span className="text-xs text-gray-500 uppercase">Or paste text</span>
                  <div className="h-px bg-gray-700 flex-1"></div>
                </div>
                
                <textarea 
                  placeholder="Paste text to share..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-black/30 border border-gray-700 rounded-xl p-4 text-sm focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all resize-none h-24 mb-6"
                />
              </>
            )}

            <button 
              onClick={handleUpload}
              disabled={isLoading || (!file && !text.trim())}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8b5cf6]/20"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Generate 4-Digit Code
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Ready to Share</h2>
            <p className="text-sm text-gray-400 mb-8">Share this 4-digit code with the receiver.</p>
            
            <div className="bg-black/50 border border-gray-700 rounded-2xl py-6 px-8 mb-8 relative group">
              <div className="text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]">
                {shareCode}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={copyCode}
                className="flex-1 py-3 rounded-xl font-medium border border-gray-600 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                {isCopied ? <Check size={18} className="text-green-400"/> : <Copy size={18} />}
                {isCopied ? "Copied!" : "Copy Code"}
              </button>
              <button 
                onClick={() => {
                  setShareCode(null);
                  setFile(null);
                  setText("");
                }}
                className="flex-1 py-3 rounded-xl font-medium bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Send Another
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-6">Available for 30 minutes</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
