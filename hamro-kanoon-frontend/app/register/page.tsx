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

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      // Backend api/auth/register ma request pathaune
      const { data } = await api.post('/auth/register', { name, email, password });
      
      // Token ra user details local storage ma save garne
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Account banayepachi homepage ma pathaune
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fcfcfc] text-gray-900 font-sans px-4">
      <div className="w-full max-w-md bg-white p-8 border border-gray-300 shadow-sm my-8">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className={`${nytFont.className} text-4xl mb-2`}>
            <Link href="/">Hamro Kanoon</Link>
          </h1>
          <p className="text-sm text-gray-600 font-serif italic">Create your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 uppercase tracking-wider text-gray-700">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>
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
              minLength={6}
              className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 uppercase tracking-wider text-gray-700">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#567b95] hover:bg-[#326891] text-white font-bold py-2.5 px-4 rounded shadow transition-colors mt-2 disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-200 pt-6">
          Already have an account? <Link href="/login" className="text-blue-700 font-semibold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}