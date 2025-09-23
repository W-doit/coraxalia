import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../../supabase/client';
import { useTranslation } from "react-i18next";

function Login() {
  const { t } = useTranslation();
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
        title: t("login.errorTitle"),
        text: error.message,
        customClass: {
          confirmButton: 'my-swal-btn'
        }
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: t("login.successTitle"),
      showConfirmButton: false,
      timer: 1500,
    });

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (userData?.role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/member');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-400 to-orange-400">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          {t("login.title")}
        </h2>
        <form onSubmit={handlerLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              {t("login.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.emailPlaceholder")}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              {t("login.passwordLabel")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordPlaceholder")}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-orange-500 text-white py-2 rounded-xl transition duration-300"
          >
            {t("login.button")}
          </button>
          <p className="text-sm text-center mt-4 text-gray-600">
            {t("login.noAccount")}{' '}
            <Link to="/register" className="text-orange-600 hover:underline">
              {t("login.registerLink")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
