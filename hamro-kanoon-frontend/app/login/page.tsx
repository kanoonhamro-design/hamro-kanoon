"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UnifrakturMaguntia } from 'next/font/google';
import api from '../../lib/axios';

const nytFont = UnifrakturMaguntia({ 
  weight: '400', 
  subsets: ['latin'],
  display: 'swap',
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend api/auth/login ma request pathaune
      const { data } = await api.post('/auth/login', { email, password });
      
      // Token ra user details local storage ma save garne
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Login pachi homepage ma pathaune
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fcfcfc] text-gray-900 font-sans px-4">
      <div className="w-full max-w-md bg-white p-8 border border-gray-300 shadow-sm">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className={`${nytFont.className} text-4xl mb-2`}>
            <Link href="/">Hamro Kanoon</Link>
          </h1>
          <p className="text-sm text-gray-600 font-serif italic">Log in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-1 uppercase tracking-wider text-gray-700">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 uppercase tracking-wider text-gray-700">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#567b95] hover:bg-[#326891] text-white font-bold py-2.5 px-4 rounded shadow transition-colors disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-200 pt-6">
          Don't have an account? <Link href="/register" className="text-blue-700 font-semibold hover:underline">Subscribe now</Link>
        </div>
      </div>
    </div>
  );
}