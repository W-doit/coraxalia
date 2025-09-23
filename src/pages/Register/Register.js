import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../../supabase/client';
import { useTranslation } from "react-i18next";

function Register() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      Swal.fire({
        icon: 'error',
        title: t("register.errorRegistration"),
        text: signUpError.message,
        customClass: {
          confirmButton: 'my-swal-btn'
        }
      });
      return;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session?.user) {
      Swal.fire({
        icon: 'error',
        title: t("register.errorSession"),
        text: sessionError?.message || "No session found",
      });
      return;
    }

    const user = sessionData.session.user;

    const { error: insertError } = await supabase.from('users').insert([
      {
        id: user.id,
        username,
        role,
        choir_id: null,
      }
    ]);

    if (insertError) {
      Swal.fire({
        icon: 'error',
        title: t("register.errorUserMeta"),
        text: insertError.message
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: t("register.successTitle"),
      text: t("register.successText"),
      showConfirmButton: false,
      timer: 1500,
    });

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
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          {t("register.title")}
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              {t("register.usernameLabel")}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("register.usernamePlaceholder")}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              {t("register.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("register.emailPlaceholder")}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              {t("register.passwordLabel")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("register.passwordPlaceholder")}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="role">
              {t("register.roleLabel")}
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="member">{t("register.roleMember")}</option>
              <option value="admin">{t("register.roleAdmin")}</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-orange-500 text-white py-2 rounded-xl transition duration-300"
          >
            {t("register.button")}
          </button>
          <p className="text-sm text-center mt-4 text-gray-600">
            {t("register.alreadyAccount")}{' '}
            <Link to="/login" className="text-orange-600 hover:underline">
              {t("register.loginLink")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
