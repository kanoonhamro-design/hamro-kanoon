"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UnifrakturMaguntia } from 'next/font/google';
import api from '../../../lib/axios';

const nytFont = UnifrakturMaguntia({ 
  weight: '400', 
  subsets: ['latin'],
  display: 'swap',
});

export default function CreateLawPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Legal News'); // Default category
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isHeadline, setIsHeadline] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Security Check: Editor ya Admin matra auna paune
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.role !== 'admin' && user.role !== 'editor') {
        router.push('/dashboard'); // Citizen ho bhane dashboard mai farta pathaidine
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  // Title type garda automatic URL slug banaune function
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // File upload ko lagi FormData use garna parcha
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('category', category);
      formData.append('summary', summary);
      formData.append('content', content);
      formData.append('tags', tags);
      formData.append('isHeadline', String(isHeadline));
      
      if (pdfFile) {
        formData.append('officialPdf', pdfFile); // Multer le yo 'officialPdf' name khojcha backend ma
      }

      // API request pathaune (Axios le FormData dekhne bittikai aafai 'multipart/form-data' header set garcha)
      await api.post('/laws', formData);

      setSuccess('Article successfully published!');
      
      // 2 second pachi dashboard ma farta pathaune
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans pb-20">
      
      {/* Minimal Header */}
      <header className="border-b border-gray-300 py-4 mb-8 flex justify-between items-center px-6 max-w-4xl mx-auto">
        <h1 className={`${nytFont.className} text-3xl`}>
          <Link href="/">Hamro Kanoon</Link>
        </h1>
        <Link href="/dashboard" className="text-sm font-bold text-gray-600 hover:text-black uppercase tracking-wider">
          &larr; Back to Dashboard
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4">
        <div className="mb-8 border-b-2 border-black pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-widest">Publish New Article</h2>
          <p className="text-gray-600 font-serif italic mt-1">Add a new law, court decision, or legal news.</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-6 border border-red-200">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 px-4 py-3 rounded mb-6 border border-green-200 font-bold">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-700">Headline / Title *</label>
              <input type="text" value={title} onChange={handleTitleChange} required className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black font-serif text-lg" placeholder="Enter article title..." />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-700">URL Slug *</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black bg-gray-50" placeholder="e.g. naya-kanoon-2080" />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-700">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black bg-white">
                <option value="Sanbidhan">Sanbidhan</option>
                <option value="Devani Kanoon">Devani Kanoon</option>
                <option value="Faujdari Kanoon">Faujdari Kanoon</option>
                <option value="Adalat ko Faisala">Adalat ko Faisala</option>
                <option value="Legal News">Legal News</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-700">Tags (Comma separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black" placeholder="e.g. Cyber Crime, Supreme Court" />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-700">Short Summary *</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required rows={3} className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black font-serif" placeholder="A brief overview for the homepage..."></textarea>
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-700">Full Content (HTML allowed) *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={10} className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black font-serif" placeholder="<p>Write the full law details here...</p>"></textarea>
          </div>

          {/* Checkbox & File Upload */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-b border-gray-300 py-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isHeadline} onChange={(e) => setIsHeadline(e.target.checked)} className="w-5 h-5 cursor-pointer accent-black" />
              <span className="font-bold uppercase tracking-wider text-sm">Feature on Front Page (Headline)</span>
            </label>

            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-700">Official PDF (Optional)</label>
              <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} className="text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer" />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-3 bg-[#567b95] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#326891] transition-colors disabled:opacity-50">
            {loading ? 'Publishing...' : 'Publish Article'}
          </button>

        </form>
      </main>
    </div>
  );
}