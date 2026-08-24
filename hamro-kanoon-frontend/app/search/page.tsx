"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UnifrakturMaguntia } from 'next/font/google';
import api from '../../lib/axios';

const nytFont = UnifrakturMaguntia({ 
  weight: '400', 
  subsets: ['latin'],
  display: 'swap',
});

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL bata 'q' parameter nikalne (yadi cha bhane)
  const initialQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // API call garne function
  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setHasSearched(true);
    
    try {
      const { data } = await api.get(`/laws/search?q=${query}`);
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError('Search garda samasya aayo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Page load huda URL ma query cha bhane aafai search garne
  useEffect(() => {
    if (initialQuery) {
      fetchSearchResults(initialQuery);
    }
  }, [initialQuery]);

  // Form submit garda (Enter thichda)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // URL update garne jasle garda search link share garna milcha
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-serif pb-20">
      
      {/* Header Minimal */}
      <header className="border-b border-gray-400 py-6 mb-10 flex flex-col items-center">
        <h1 className={`${nytFont.className} text-4xl mb-4`}>
          <Link href="/">Hamro Kanoon</Link>
        </h1>
        <Link href="/" className="text-xs font-sans tracking-widest uppercase text-gray-500 hover:text-black">
          &larr; Back to Home
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Search Input Box */}
        <div className="mb-12">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search laws, court decisions, categories..." 
              className="w-full border-b-2 border-black bg-transparent text-2xl md:text-4xl py-4 pl-2 pr-12 focus:outline-none placeholder-gray-300 italic transition-colors"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </form>
        </div>

        {/* Loading / Error States */}
        {loading && <div className="text-center text-gray-500 font-sans uppercase tracking-widest text-sm">Searching our database...</div>}
        {error && <div className="text-center text-red-600 font-sans">{error}</div>}

        {/* Search Results Display */}
        {!loading && hasSearched && !error && (
          <div>
            <h2 className="text-xs font-bold font-sans border-b border-gray-300 pb-2 mb-6 uppercase tracking-widest text-gray-600">
              {results.length} Results Found
            </h2>
            
            <div className="flex flex-col gap-8">
              {results.length > 0 ? (
                results.map((law) => (
                  <article key={law._id} className="border-b border-gray-200 pb-6 last:border-0 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="md:w-3/4">
                      <div className="text-[10px] text-gray-500 font-sans mb-1 uppercase font-bold tracking-wider">
                        {law.category}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 hover:text-gray-600 cursor-pointer italic text-black">
                        <Link href={`/law/${law.slug}`}>{law.title}</Link>
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        {law.summary}
                      </p>
                    </div>
                    <div className="md:w-1/4 flex justify-start md:justify-end">
                      <div className="text-[11px] font-sans text-gray-400">
                        {new Date(law.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center text-gray-500 text-lg italic mt-10">
                  No articles found for "{searchTerm}". Try a different keyword.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Next.js ma useSearchParams use garda Suspense boundary bhitra rakhna parcha
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}