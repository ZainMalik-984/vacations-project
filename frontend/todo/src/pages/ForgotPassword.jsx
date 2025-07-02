// pages/ForgotPassword.jsx
import { useState } from 'react';
import api from '../utils/axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/password-reset/', { email });
      setMessage('✅ Reset link sent to your email.');
    } catch {
      setMessage('❌ Failed to send reset link. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 border shadow rounded">
      <h2 className="text-2xl font-bold">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Send Reset Link
        </button>
      </form>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default ForgotPassword;
