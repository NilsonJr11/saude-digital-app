import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
      <div className="text-center -mt-12">
        <h2 className="text-3xl font-bold text-secondary mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-8">Parece que você se perdeu no hospital digital!</p>
        <Link to="/" className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/30">
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}