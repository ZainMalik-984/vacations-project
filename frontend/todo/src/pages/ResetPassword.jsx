// pages/ResetPassword.jsx
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../utils/axios';

function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage('❌ Passwords do not match.');
      return;
    }

    try {
      await api.post('/password-reset-confirm/', { uid, token, password });
      setMessage('✅ Password reset successful. You can now log in.');
    } catch {
      setMessage('❌ Reset failed. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 border shadow rounded">
      <h2 className="text-2xl font-bold">Reset Your Password</h2>
      <form onSubmit={handleReset} className="space-y-3">
        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Reset Password
        </button>
      </form>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default ResetPassword;
