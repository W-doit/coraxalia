import { useState } from "react";
import logo from '../../assets/images/Notae_onlyimage_black.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white shadow z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
       <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 tracking-tight">
  {/* Logo */}
  <img 
    src={logo} 
    alt="logo" 
    className="w-10 h-10 animate-bounce-slow"
  />
  
  {/* Text */}
  <span className="bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
    Notae
  </span>
</h1>


        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-800">
          {[
            ["How it Works", "#how"],
            ["Choirs", "#choirs"],
            ["Q&A", "#faq"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="relative hover:text-black transition"
              >
                {label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow px-4 py-4 space-y-3 text-sm font-medium text-gray-800">
          {[
            ["How it Works", "#how"],
            ["Choirs", "#choirs"],
            ["Q&A", "#faq"],
            ["Contact", "#contact"],
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
