import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 p-3 focus:outline-none md:hidden"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? '0' : '-100%' }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 h-full bg-white shadow-md w-64 z-20 md:static md:translate-x-0 transform transition-transform`}
      >
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={toggleSidebar} className="text-white md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/map"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
              >
                Map
              </Link>
            </li>
            <li>
              <Link
                to="/family-management"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
              >
                Family Management
              </Link>
            </li>
            <li>
              <Link
                to="/user-management"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
              >
                User Management
              </Link>
            </li>
          </ul>
        </nav>
      </motion.aside>
    </div>
  );
};

export default Sidebar;
