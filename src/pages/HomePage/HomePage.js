import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLoginRedirect = () => {
    navigate(`/login`);
  };
  const handleRegisterAdminRedirect = () => {
    navigate(`/register`);
  }

  return (
    <div className="font-sans scroll-smooth bg-gray-50 text-black">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white text-center py-28 px-6 shadow-sm"
      >
        <h2 className="text-5xl font-bold mb-4">{t("hero.title")}</h2>
        <p className="text-lg mb-8 text-gray-600">{t("hero.subtitle")}</p>
        <a
          href="#choirs"
          className="bg-black text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-800 transition"
        >
          {t("hero.button")}
        </a>
      </motion.section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-gray-50 text-center px-4">
        <h3 className="text-3xl font-semibold mb-10">{t("how.title")}</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            [t("how.steps.choose.title"), t("how.steps.choose.desc")],
            [t("how.steps.join.title"), t("how.steps.join.desc")],
            [t("how.steps.stay.title"), t("how.steps.stay.desc")],
          ].map(([title, desc], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h4 className="text-xl font-bold mb-2">{title}</h4>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Choirs Section */}
      <section id="choirs" className="py-20 px-4 bg-white">
        <h3 className="text-3xl font-semibold text-center mb-12">
          {t("choirs.title")}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {["Coraxalia", "Melodia Voices", "Harmony Waves"].map((choir, i) => (
            <motion.div
              key={choir}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
            >
              <h4 className="text-xl font-bold mb-2">{choir}</h4>
              <p className="text-sm text-gray-500 mb-4">
                {t("choirs.chooseRole")}
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleLoginRedirect(choir, "admin")}
                  className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                  {t("choirs.admin")}
                </button>
                <button
                  onClick={() => handleLoginRedirect(choir, "member")}
                  className="bg-gray-100 text-black py-2 rounded hover:bg-gray-200 transition"
                >
                  {t("choirs.member")}
                </button>
              </div>
              
            </motion.div>
          ))}
          
         
        </div>
        <div className="text-center mt-12">
         <button
                  onClick={() => handleRegisterAdminRedirect()}
                  className="bg-black text-white py-2 rounded hover:bg-gray-800 transition py-2 px-4 text-center "
                >
                  {t("choirs.CreateYourOwn")}
                </button>
                </div>
      </section>

      {/* Q&A Section */}
      <section id="faq" className="py-20 bg-gray-50 px-4">
        <h3 className="text-3xl font-semibold text-center mb-10">{t("faq.title")}</h3>
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            [t("faq.q1"), t("faq.a1")],
            [t("faq.q2"), t("faq.a2")],
            [t("faq.q3"), t("faq.a3")],
          ].map(([q, a]) => (
            <div
              key={q}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h4 className="font-semibold">{q}</h4>
              <p className="text-gray-600 mt-1">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white text-center">
        <h3 className="text-3xl font-semibold mb-6">{t("contact.title")}</h3>
        <p className="text-gray-600 mb-2">
          {t("contact.email")}:{" "}
          <a
            href="mailto:support@choirconnect.com"
            className="text-black underline hover:text-gray-700"
          >
            support@Notae.com
          </a>
        </p>
        <p className="text-gray-600">
          {t("contact.phone")}: +1 (123) 456-7890
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center py-6 shadow-inner">
        <p>
          © {new Date().getFullYear()} Notae. {t("footer.rights")}
        </p>
      </footer>
    </div>
  );
};

export default Home;
