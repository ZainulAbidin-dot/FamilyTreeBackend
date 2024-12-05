import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DataImportForm = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        onFileUpload(csvData);
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      className="p-4 bg-white shadow-md rounded-lg w-full max-w-md mx-auto mt-6"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Import CSV File</h2>
      <label className="block mb-2 text-gray-600">
        Choose a CSV file:
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mt-2 w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />
      </label>
      {fileName && (
        <p className="mt-2 text-gray-500">
          Selected file: <span className="font-medium">{fileName}</span>
        </p>
      )}
    </motion.div>
  );
};

export default DataImportForm;
