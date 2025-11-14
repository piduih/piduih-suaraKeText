import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
        Transkripsi Masa Nyata
      </h1>
      <p className="text-slate-600 mt-2 text-lg">
        Tukar pertuturan anda kepada teks dalam masa nyata dengan Gemini.
      </p>
    </header>
  );
};