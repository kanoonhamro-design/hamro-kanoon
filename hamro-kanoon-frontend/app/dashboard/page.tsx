"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UnifrakturMaguntia } from 'next/font/google';
import api from '../../lib/axios';

const nytFont = UnifrakturMaguntia({ 
  weight: '400', 
  subsets: ['latin'],
  display: 'swap',
});

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // LocalStorage bata user check garne
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
          router.push('/login'); // Login chaina bhane login page ma pathaidine
          return;
        }

        // Backend bata user ko sabai details ra bookmarks tanne
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile. Please log in again.');
        localStorage.removeItem('userInfo');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] text-gray-500 font-sans tracking-widest uppercase text-sm">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-serif pb-20">
      
      {/* Header */}
      <header className="border-b border-gray-400 py-6 mb-10 flex flex-col items-center">
        <h1 className={`${nytFont.className} text-4xl mb-4`}>
          <Link href="/">Hamro Kanoon</Link>
        </h1>
        <nav className="text-xs font-sans tracking-widest uppercase text-gray-500 flex gap-6">
          <Link href="/" className="hover:text-black">Home</Link>
          <button onClick={handleLogout} className="hover:text-red-700">Logout</button>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* User Info Section */}
        <div className="bg-white border border-gray-300 p-6 mb-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold italic mb-1">{user?.name}</h2>
            <p className="text-sm font-sans text-gray-600">{user?.email}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-block bg-gray-200 text-gray-800 text-xs font-bold font-sans uppercase px-3 py-1 rounded tracking-wider">
              Role: {user?.role}
            </span>
            {/* Yadi Editor ya Admin ho bhane Create Law ko button dekhaune */}
            {(user?.role === 'admin' || user?.role === 'editor') && (
              <Link href="/dashboard/create-law" className="ml-4 inline-block bg-[#567b95] text-white text-xs font-bold font-sans uppercase px-3 py-1 rounded shadow hover:bg-[#326891] transition-colors">
                + Post Law
              </Link>
            )}
          </div>
        </div>

        {/* Bookmarked Laws Section */}
        <div>
          <h3 className="text-lg font-bold font-sans border-b-2 border-black pb-2 mb-6 uppercase tracking-widest">
            Your Saved Articles
          </h3>
          
          <div className="flex flex-col gap-6">
            {user?.savedLaws && user.savedLaws.length > 0 ? (
              user.savedLaws.map((law: any) => (
                <article key={law._id} className="border-b border-gray-200 pb-6 last:border-0 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-gray-500 font-sans mb-2 uppercase font-bold tracking-wider">
                      {law.category}
                    </div>
                    <h4 className="text-xl font-bold hover:text-gray-600 cursor-pointer">
                      <Link href={`/law/${law.slug}`}>{law.title}</Link>
                    </h4>
                  </div>
                  <Link href={`/law/${law.slug}`} className="text-sm font-sans text-blue-700 hover:underline hidden sm:block ml-4">
                    Read &rarr;
                  </Link>
                </article>
              ))
            ) : (
              <p className="text-gray-500 italic font-serif">
                You haven't saved any laws yet. Browse the <Link href="/" className="text-blue-700 hover:underline">homepage</Link> to find articles.
              </p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}