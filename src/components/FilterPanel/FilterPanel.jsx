import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FilterForm from './FilterForm';

const FilterPanel = ({ onFilterSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={togglePanel}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 focus:outline-none"
      >
        {isOpen ? 'Close Filters' : 'Open Filters'}
      </button>

      {isOpen && (
        <motion.div
  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" // Ensure z-index is high
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={togglePanel}
>
  <motion.div
    className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg z-50" // Ensure this also has a z-index
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    onClick={(e) => e.stopPropagation()}
  >
    <h2 className="text-lg font-bold mb-4">Filter Options</h2>
    <FilterForm onSubmit={(data)=>{
      onFilterSubmit(data);
      togglePanel();
    }} />
  </motion.div>
</motion.div>

      )}
    </>
  );
};

export default FilterPanel;
