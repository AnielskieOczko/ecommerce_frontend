import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-black text-white px-4 py-2 flex justify-between text-sm">
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-300">Facebook</a>
          <a href="#" className="hover:text-gray-300">Instagram</a>
        </div>
        <div>Darmowa wysyłka od 299zł</div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between border-b">
        {/* Left menu */}
        <div className="hidden lg:flex space-x-6">
          <Link to="/about-me" className="hover:text-gray-600">About me</Link>
          <Link to="/products" className="hover:text-gray-600">Products</Link>
          <Link to="/blog" className="hover:text-gray-600">Blog</Link>
        </div>

        {/* Logo */}
        <Link to="/" className="text-2xl font-light">
          LOGO MOJEGO SKLEPU
        </Link>

        {/* Right menu */}
        <div className="flex items-center space-x-6">
          <div className="hidden lg:flex space-x-6">
            <Link to="/konto" className="hover:text-gray-600">My account</Link>
            <button className="hover:text-gray-600">Search</button>
          </div>
          <Link to="/koszyk" className="flex items-center hover:text-gray-600">
            Cart (0)
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;