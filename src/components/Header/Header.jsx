import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaMusic, FaHome, FaBars } from 'react-icons/fa';
import { FaUserGroup, FaXmark } from 'react-icons/fa6';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { href: '/', label: 'Home', icon: FaHome },
    { href: '/family-management', label: 'Families', icon: FaUserGroup },
    { href: '/user-management', label: 'Users', icon: FaUser },
    { href: '/song-management', label: 'Songs', icon: FaMusic },
  ];

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='bg-white shadow-md'>
      <div className='max-w-7xl w-full mx-auto h-24 flex justify-between items-center py-4 px-6 relative'>
        <Link to='/' className='text-xl font-bold text-gray-800 hover:text-gray-600'>
          Family Tree Admin
        </Link>

        {/* Navigation Links */}
        <nav className='hidden md:flex space-x-6 text-lg'>
          {menuItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className='md:hidden flex items-center'>
          <button className='text-gray-800' onClick={() => setIsMobileMenuOpen(true)}>
            <FaBars className='w-6 h-6' />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className='absolute top-0 right-0 w-80 h-screen bg-white shadow-md z-10 px-6 py-8'>
            <div className='flex flex-col h-full gap-6'>
              <div className='flex items-center'>
                <button
                  className='text-gray-800 hover:text-gray-600 ml-auto'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaXmark className='w-6 h-6' />
                </button>
              </div>
              <nav className='flex flex-col gap-4 justify-between w-full text-lg'>
                {menuItems.map((item, index) => (
                  <NavItem key={index} {...item} />
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function NavItem({ href, label, icon: Icon }) {
  return (
    <Link
      to={href}
      className='text-gray-600 hover:text-gray-900 transition duration-300 flex items-center gap-2'
    >
      <Icon className='w-4 h-4' />
      {label}
    </Link>
  );
}

export default Header;
