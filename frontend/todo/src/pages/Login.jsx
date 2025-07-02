import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login/', form);
      const role = res.data?.user?.role;

      if (role) {
        dispatch(loginSuccess({ role }));
        if (role === 'admin') {
          navigate('/admin-panel');
        } else {
          navigate('/vacations');
        }
      } else {
        alert('Unexpected response from server');
        console.error('Login success but role missing:', res.data);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2"
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          className="w-full border p-2"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 w-full"
          type="submit"
        >
          Login
        </button>
      </form>

      {/* Forgot Password Options */}
      <div className="mt-3 text-sm text-right space-x-2">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot by Link
        </Link>
        <span className="text-gray-400">|</span>
        <Link to="/request-otp" className="text-blue-600 hover:underline">
          Forgot by Code
        </Link>
      </div>
    </div>
  );
}

export default Login;
