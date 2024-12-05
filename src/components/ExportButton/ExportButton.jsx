import React from 'react';
import * as XLSX from 'xlsx';

const ExportButton = ({ data }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No data available for export.');
      return;
    }

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Convert worksheet to CSV
    const csvData = XLSX.utils.sheet_to_csv(worksheet);

    // Create a Blob for the CSV file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filtered_data.csv';

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="mt-4 p-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500 transition"
    >
      Export Filtered Data
    </button>
  );
};

export default ExportButton;
