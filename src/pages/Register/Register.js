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
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    Swal.fire({
      icon: 'error',
      title: t("register.errorRegistration"),
      text: signUpError.message,
    });
    return;
  }

  // 🔥 ALWAYS show email confirmation alert
  Swal.fire({
    icon: "success",
    title: t("register.successTitle"),
    html: `
      <p>${t("register.successText")}</p>
      <p class="mt-2 text-sm text-gray-600">${t("register.confirmEmailText")}</p>
    `,
    confirmButtonText: t("register.goToLogin"),
      customClass: {
      confirmButton: 'my-swal-btn', // your blue style
    },
  }).then(() => {
    navigate('/login');
  });

  // ⚠️ Try to fetch session (may be null if email confirmation is required)
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;

  if (!user) return; // No session before email confirmation

  // Insert into DB ONLY if session exists
  await supabase.from('users').insert([
    { id: user.id, username, email, role: null, choir_id: null }
  ]);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-400 to-orange-400">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          {t("register.title")}
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">{t("register.usernameLabel")}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("register.usernamePlaceholder")}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">{t("register.emailLabel")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("register.emailPlaceholder")}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">{t("register.passwordLabel")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("register.passwordPlaceholder")}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>

          <button className="w-full bg-red-500 hover:bg-orange-500 text-white py-2 rounded-xl">
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
