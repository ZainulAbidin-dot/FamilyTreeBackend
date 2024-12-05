import React from 'react';
import { motion } from 'framer-motion';

const DataPreview = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <motion.div
        className="mt-6 text-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        No data to preview. Please upload a CSV file.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mt-6 p-4 bg-white shadow-md rounded-lg overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {Object.keys(data[0]).map((key, index) => (
              <th key={index} className="p-2 border border-gray-300 text-left">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 5).map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {Object.values(row).map((value, idx) => (
                <td key={idx} className="p-2 border border-gray-300">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-gray-500">
        Showing first 5 rows. Upload more data to preview the rest.
      </p>
    </motion.div>
  );
};

export default DataPreview;
