import SendCard from "@/components/SendCard";
import ReceiveCard from "@/components/ReceiveCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium text-gray-300">Secure temporary sharing</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
          Share Anything.<br/>Anywhere. Instantly.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-16">
          Send files or text with a simple 4-digit code. No complicated setup.
        </p>

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <SendCard />
          <ReceiveCard />
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-black/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">Three simple steps to share your content securely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-[2px] bg-gradient-to-r from-[#8b5cf6]/20 via-[#06b6d4]/20 to-[#8b5cf6]/20 -z-10"></div>
            
            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-black/40 border border-gray-700 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">01</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload</h3>
              <p className="text-gray-400">Choose a file or paste text to share.</p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-black/40 border border-gray-700 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">02</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Code</h3>
              <p className="text-gray-400">Receive a unique 4-digit code.</p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-black/40 border border-gray-700 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">03</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Download</h3>
              <p className="text-gray-400">Enter the code on another device and download.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
