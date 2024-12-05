import React from 'react';
import ExportButton from './ExportButton';

const ExportDataPage = ({ filteredData }) => {
  return (
    <div className="container mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-4">Export Filtered Data</h1>
      {filteredData && filteredData.length > 0 ? (
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(filteredData[0]).map((key, index) => (
                  <th key={index} className="p-2 border border-gray-300 text-left">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {Object.values(item).map((value, subIndex) => (
                    <td key={subIndex} className="p-2 border border-gray-300">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <ExportButton data={filteredData} />
        </div>
      ) : (
        <p className="text-gray-600">No data available for export. Please filter data on the map first.</p>
      )}
    </div>
  );
};

export default ExportDataPage;
