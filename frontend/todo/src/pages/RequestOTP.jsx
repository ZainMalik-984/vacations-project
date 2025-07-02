import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

function RequestOTP() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await api.post('/password-reset-code/', { email });
      setMessage('✅ OTP sent to your email.');

      // Wait 3 seconds, then navigate to verify page
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } }); // Pass email to next screen
      }, 3000);
    } catch {
      setMessage('❌ Failed to send OTP.');
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold">Request OTP</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Send OTP
      </button>
      <p>{message}</p>
    </form>
  );
}

export default RequestOTP;
