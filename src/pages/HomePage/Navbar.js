import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/images/Notae_onlyimage_black.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [langOpen, setLangOpen] = useState(false); // desktop lang dropdown
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  // detect current language for flag
  const currentLang = i18n.language || "es";
  const currentFlag = currentLang.startsWith("es") ? "🇪🇸" : "🇺🇸";

  return (
    <nav className="sticky top-0 bg-white shadow z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 tracking-tight">
          <img src={logo} alt="logo" className="w-10 h-10 animate-bounce-slow" />
          <span className="bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
            Notae
          </span>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-800">
          {[
            [t("navbar.how"), "#how"],
            [t("navbar.choirs"), "#choirs"],
            [t("navbar.faq"), "#faq"],
            [t("navbar.contact"), "#contact"],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href} className="relative hover:text-black transition">
                {label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Language Switch Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 border px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <span className="text-xl">{currentFlag}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded-md shadow-md">
              <button
                onClick={() => changeLanguage("es")}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
              >
                🇪🇸 Español
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
              >
                🇺🇸 English
              </button>
            </div>
          )}
        </div>

        {/* Hamburger (mobile menu button) */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow px-4 py-4 space-y-3 text-sm font-medium text-gray-800">
          {[
            [t("navbar.how"), "#how"],
            [t("navbar.choirs"), "#choirs"],
            [t("navbar.faq"), "#faq"],
            [t("navbar.contact"), "#contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="block hover:text-black"
            >
              {label}
            </a>
          ))}

          {/* Language Switch inside mobile menu */}
          <div className="border-t pt-3">
            <p className="text-gray-500 text-xs mb-1">Language</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { changeLanguage("es"); setIsOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
              >
                🇪🇸 Español
              </button>
              <button
                onClick={() => { changeLanguage("en"); setIsOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
              >
                🇺🇸 English
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
