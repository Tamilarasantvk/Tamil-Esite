import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { profile } = usePortfolio();

  return (
    <footer className="bg-[#050B14] border-t border-[#1E3A5F] py-12 text-[#94A3B8] font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left text-slate-500 text-[11px]">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </div>

        <div className="flex items-center gap-5 text-[#94A3B8]">
          <a href="#home" className="hover:text-[#F8FAFC] transition-colors">
            Top
          </a>
        </div>
      </div>
    </footer>
  );
};
