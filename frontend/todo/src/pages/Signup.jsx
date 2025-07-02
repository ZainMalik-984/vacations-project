import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ first_name: '', email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:8000/api/register/admin/`, form);
      navigate('/');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Admin Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="first_name" onChange={handleChange} placeholder="First Name" className="w-full border p-2" />
        <input name="email" onChange={handleChange} placeholder="Email" className="w-full border p-2" />
        <input type="password" name="password" onChange={handleChange} placeholder="Password" className="w-full border p-2" />
        <button className="bg-green-500 text-white px-4 py-2" type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
