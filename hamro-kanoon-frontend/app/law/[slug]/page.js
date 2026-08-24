"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UnifrakturMaguntia } from 'next/font/google';
import api from '../../../lib/axios';

const nytFont = UnifrakturMaguntia({ 
  weight: '400', 
  subsets: ['latin'],
  display: 'swap',
});

export default function LawDetailPage() {
  const params = useParams(); 
  const router = useRouter();
  
  const [law, setLaw] = useState(null); // <any> hatayeko
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchLawAndUserStatus = async () => {
      try {
        const { data: lawData } = await api.get(`/laws/${params.slug}`);
        setLaw(lawData);

        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const { data: userData } = await api.get('/auth/me');
          const alreadySaved = userData.savedLaws.some(
            // (savedLaw: any) ko satta yaha bata : any hatayeko cha
            (savedLaw) => savedLaw._id === lawData._id
          );
          setIsBookmarked(alreadySaved);
        }
      } catch (err) {
        console.error(err);
        setError('Kanoon ko vivaran bhetiyena ya server ma samasya cha.');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchLawAndUserStatus();
    }
  }, [params.slug]);

  const handleBookmark = async () => {
    const userInfo = localStorage.getItem('userInfo');
    
    if (!userInfo) {
      alert("Article save garna ko lagi paila login garna parcha!");
      router.push('/login');
      return;
    }

    setIsSaving(true);
    try {
      const { data } = await api.post(`/users/bookmark/${law._id}`);
      setIsBookmarked(data.bookmarked);
    } catch (err) {
      console.error(err);
      alert("Bookmark garna sakiyena, pheri try garnuhola.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] text-gray-500 font-sans tracking-widest uppercase text-sm">
        Loading Article...
      </div>
    );
  }

  if (error || !law) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] text-black">
        <h2 className="text-2xl font-bold font-serif">{error}</h2>
        <Link href="/" className="mt-4 text-blue-600 hover:underline font-sans">Go back to Homepage</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-serif pb-20">
      <header className="border-b border-gray-300 py-4 mb-10 flex justify-center">
        <h1 className={`${nytFont.className} text-4xl`}>
          <Link href="/">Hamro Kanoon</Link>
        </h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="text-[11px] font-bold font-sans text-gray-500 uppercase tracking-widest mb-4">
            {law.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 italic text-black">
            {law.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed italic">
            {law.summary}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-b border-gray-300 py-3 mb-10 font-sans text-sm">
          <div className="text-gray-600 mb-4 sm:mb-0">
            By <span className="font-semibold text-black">{law.author?.name || 'Hamro Kanoon Team'}</span> 
            <span className="mx-2">|</span> 
            {new Date(law.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleBookmark} 
              disabled={isSaving}
              className={`flex items-center gap-1 transition-colors font-semibold ${
                isBookmarked ? 'text-blue-700 hover:text-blue-900' : 'text-gray-600 hover:text-black'
              }`}
            >
              {isBookmarked ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
              )}
              {isSaving ? 'Saving...' : (isBookmarked ? 'Saved' : 'Save')}
            </button>

            {law.officialPdfUrl && (
              <a href={law.officialPdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors font-semibold border-l border-gray-300 pl-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                PDF
              </a>
            )}
          </div>
        </div>

        <article 
          className="text-lg md:text-xl text-gray-800 leading-relaxed space-y-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: law.content }}
        />
      </main>
    </div>
  );
}