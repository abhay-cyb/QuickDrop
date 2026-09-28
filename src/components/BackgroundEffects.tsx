"use client";
import React from 'react';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] opacity-20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-secondary)] opacity-20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-[var(--color-accent)] opacity-20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />
    </div>
  );
}
