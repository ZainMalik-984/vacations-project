import { useState } from 'react';
import api from '../utils/axios';
import { Link } from 'react-router-dom';

function VerifyOTP() {
  const [form, setForm] = useState({ email: '', otp: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/password-reset-verify/', form);
      setMessage('✅ Password reset successful. You can now login.');
    } catch {
      setMessage('❌ Invalid OTP or error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold">Reset Password</h2>
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        name="otp"
        placeholder="OTP"
        value={form.otp}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        name="password"
        placeholder="New Password"
        type="password"
        value={form.password}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
        Reset Password
      </button>
      <Link to = '/' className="bg-green-600 text-white px-4 py-2 rounded ml-8">Login</Link>
      <p>{message}</p>
    </form>

  );
}

export default VerifyOTP;
