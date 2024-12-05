import React, { useState } from 'react';
import DataImportForm from '../components/DataImport/DataImportForm';
import DataPreview from '../components/DataImport/DataPreview';
import ExportButton from '../components/ExportButton/ExportButton';
import Papa from 'papaparse'; // CSV parsing library

const DataImportPage = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (csvData) => {
    const parsedData = Papa.parse(csvData, { header: true }).data;
    setData(parsedData);
  };

  return (
    <div className="container mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-4">Data Import Page</h1>
      <DataImportForm onFileUpload={handleFileUpload} />
      <DataPreview data={data} />
      {data.length > 0 && <ExportButton data={data} />}
    </div>
  );
};

export default DataImportPage;
