"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UnifrakturMaguntia } from 'next/font/google';
import api from '../lib/axios'; 

const nytFont = UnifrakturMaguntia({ 
  weight: '400', 
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const [headline, setHeadline] = useState<any>(null);
  const [latestLaws, setLatestLaws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [headlinesRes, lawsRes] = await Promise.all([
          api.get('/laws/headlines'),
          api.get('/laws') 
        ]);

        if (headlinesRes.data && headlinesRes.data.length > 0) {
          setHeadline(headlinesRes.data[0]);
        }

        if (lawsRes.data && lawsRes.data.laws) {
          const filteredLaws = lawsRes.data.laws.filter(
            (law: any) => law._id !== headlinesRes.data[0]?._id
          );
          setLatestLaws(filteredLaws.slice(0, 5)); 
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] text-black">
        <h1 className={`${nytFont.className} text-5xl animate-pulse`}>Hamro Kanoon</h1>
        <p className="mt-4 font-sans text-sm text-gray-500 uppercase tracking-widest">Fetching Latest Laws...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-serif pb-20">
      
      {/* 1. Top Utility Nav */}
      <div className="border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-1 flex justify-center md:justify-start gap-6 text-[11px] font-sans uppercase tracking-wider text-gray-600">
          <Link href="/search?q=practice areas" className="hover:text-black transition-colors">Practice Areas</Link>
          <Link href="/search?q=team" className="hover:text-black transition-colors">Our Team</Link>
          <Link href="/search?q=updates" className="hover:text-black transition-colors">Latest Updates</Link>
          <Link href="/search?q=blog" className="hover:text-black transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link>
        </div>
      </div>

      {/* 2. Header / Navbar */}
      <header className="border-b border-gray-400 py-6 mb-8 relative">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="text-xs text-gray-600 font-sans tracking-widest uppercase md:w-1/3 text-center md:text-left mb-4 md:mb-0">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          
          <h1 className={`text-6xl md:text-7xl font-normal text-center md:w-1/3`}>
            <Link href="/">Hamro Kanoon</Link>
          </h1>
          
          <div className="text-sm font-sans flex gap-4 md:w-1/3 justify-center md:justify-end items-center mt-4 md:mt-0">
            {/* Search Icon Added Here */}
            <Link href="/search" className="text-gray-700 hover:text-black mr-2 transition-colors" title="Search Laws">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </Link>
            
            <Link href="/login" className="hover:underline flex items-center font-semibold">Log in</Link>
            <Link href="/register" className="bg-[#567b95] text-white px-4 py-1.5 rounded shadow hover:bg-[#326891] transition-colors font-semibold">Subscribe</Link>
          </div>
        </div>
        
        {/* Categories Bar Updated to use Search Routing */}
        <nav className="border-t border-b border-black border-t-2 mt-6 py-2 mx-auto max-w-6xl">
          <ul className="flex flex-wrap justify-center gap-6 md:gap-10 text-[13px] font-sans uppercase font-medium text-gray-800">
            <Link href="/search?q=Sanbidhan" className="hover:text-gray-500 cursor-pointer">Sanbidhan</Link>
            <Link href="/search?q=Devani Kanoon" className="hover:text-gray-500 cursor-pointer">Devani Kanoon</Link>
            <Link href="/search?q=Faujdari Kanoon" className="hover:text-gray-500 cursor-pointer">Faujdari Kanoon</Link>
            <Link href="/search?q=Adalat ko Faisala" className="hover:text-gray-500 cursor-pointer">Adalat ko Faisala</Link>
          </ul>
        </nav>
      </header>

      {/* 3. Main Content Grid */}
      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left/Center Column: Main Headline */}
        <section className="md:col-span-8 md:border-r md:border-gray-300 pr-0 md:pr-8">
          {headline ? (
            <>
              <div className="mb-2 text-xs font-bold font-sans text-gray-500 uppercase tracking-widest">
                {headline.category}
              </div>
              <Link href={`/law/${headline.slug}`}>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4 hover:text-gray-600 cursor-pointer transition-colors text-black italic">
                  {headline.title}
                </h2>
              </Link>
              <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                {headline.summary}
              </p>
              <div className="text-xs text-gray-500 font-sans uppercase tracking-wide">
                By <span className="font-semibold text-black">{headline.author?.name || 'Hamro Kanoon Team'}</span> <span className="mx-2">|</span> {new Date(headline.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </>
          ) : (
            <div className="text-gray-500 italic">No headline story available right now.</div>
          )}
        </section>

        {/* Right Column: Latest Updates */}
        <section className="md:col-span-4 pl-0 md:pl-2">
          <h3 className="text-xs font-bold font-sans border-b border-black pb-1 mb-4 uppercase tracking-widest text-black">
            Latest Updates
          </h3>
          <div className="flex flex-col gap-5">
            {latestLaws.length > 0 ? latestLaws.map((law) => (
              <article key={law._id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="text-[10px] text-gray-500 font-sans mb-1 uppercase font-semibold">{law.category}</div>
                <h4 className="text-base font-bold text-gray-900 hover:text-gray-600 cursor-pointer leading-snug">
                  <Link href={`/law/${law.slug}`}>{law.title}</Link>
                </h4>
                <div className="text-[10px] text-gray-400 mt-2 font-sans">
                  {new Date(law.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </article>
            )) : (
              <div className="text-sm text-gray-500">No new updates found.</div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}