import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      className='bg-white shadow-md w-full'
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='max-w-5xl mx-auto h-24 flex justify-between items-center py-4 px-6 relative'>
        {/* Logo */}
        <Link to='/' className='text-2xl font-bold text-gray-800 hover:text-gray-600'>
          Family Tree Admin Panel
        </Link>

        {/* Navigation Links */}
        <nav className='hidden md:flex space-x-6 text-[18px]'>
          <Link
            to='/'
            className='text-gray-600 hover:text-gray-900 transition duration-300'
          >
            Dashboard
          </Link>
          <Link
            to='/family-management'
            className='text-gray-600 hover:text-gray-900 transition duration-300'
          >
            Families
          </Link>
          <Link
            to='/user-management'
            className='text-gray-600 hover:text-gray-900 transition duration-300'
          >
            Users
          </Link>
          <Link
            to='/song-management'
            className='text-gray-600 hover:text-gray-900 transition duration-300'
          >
            Songs
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <button className='text-gray-600 focus:outline-none focus:text-gray-900'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16M4 18h16'
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
