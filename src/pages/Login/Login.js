import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../../supabase/client';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handlerLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
        customClass: {
          confirmButton: 'my-swal-btn'
        }
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      showConfirmButton: false,
      timer: 1500,
    });

    // Optional: check user role from 'users' table
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();
      console.log("Role fetch result:", userData, roleError);
    if (userData?.role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/member');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-400 to-orange-400">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Login</h2>
        <form onSubmit={handlerLogin}>
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
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-orange-500 text-white py-2 rounded-xl transition duration-300"
          >
            Login
          </button>
          <p className="text-sm text-center mt-4 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-600 hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
