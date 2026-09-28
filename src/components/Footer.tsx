export default function Footer() {
  return (
    <footer className="relative z-50 border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] mb-2">
          QuickDrop
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Fast temporary sharing using a simple 4-digit code.
        </p>
        <div className="flex justify-center gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Security</a>
        </div>
      </div>
    </footer>
  );
}
