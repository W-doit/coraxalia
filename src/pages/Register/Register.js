import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../../supabase/client';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // default role
  const navigate = useNavigate();

const handleRegister = async (e) => {
  e.preventDefault();

  // Step 1: Sign up the user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text: signUpError.message,
      customClass: {
        confirmButton: 'my-swal-btn'
      }
    });
    return;
  }

  // Step 2: Get the authenticated user's ID
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData.session?.user) {
    Swal.fire({
      icon: 'error',
      title: 'Session Error',
      text: sessionError?.message || "No session found",
    });
    return;
  }

  const user = sessionData.session.user;

  // Step 3: Insert user metadata into `users` table
  const { error: insertError } = await supabase.from('users').insert([
    {
      id: user.id,        // ✅ REQUIRED to satisfy RLS
      username,
      role,
      choir_id: null,
    }
  ]);

  if (insertError) {
    Swal.fire({
      icon: 'error',
      title: 'User Metadata Failed',
      text: insertError.message
    });
    return;
  }

  // Step 4: Registration successful
  Swal.fire({
    icon: 'success',
    title: 'Registration Successful!',
    text: 'Welcome to the choir platform!',
    showConfirmButton: false,
    timer: 1500,
  });

  // Step 5: Redirect based on role
  if (role === 'admin') {
    navigate('/dashboard/admin');
  } else if (role === 'member') {
    navigate('/dashboard/member');
  } else {
    navigate('/');
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-400 to-orange-400">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="role">Register As</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-orange-500 text-white py-2 rounded-xl transition duration-300"
          >
            Register
          </button>
          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
