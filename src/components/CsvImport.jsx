import React, { useState } from 'react';
import Papa from 'papaparse';

const CsvImport = ({ onDataImported }) => {
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          onDataImported(results.data);
        },
        skipEmptyLines: true,
      });
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-2">Import CSV</h3>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="w-full p-2 border border-gray-300 rounded"
      />
      {fileName && <p className="mt-2 text-gray-500">Selected file: {fileName}</p>}
    </div>
  );
};

export default CsvImport;
