import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import UserManagementPage from './pages/UserManagementPage';
import ExportDataPage from './components/ExportButton/ExportDataPage';
import FamilyManagementPage from './pages/FamilyManagementPage';

function App() {
  const [filteredData, setFilteredData] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', city: 'New York', zip: '10001', phoneNumber: '123-456-7890',state:'New York' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', city: 'Los Angeles', zip: '90001', phoneNumber: '987-654-3210',state:'California' },
    { id: 3, firstName: 'Alice', lastName: 'Johnson', city: 'Chicago', zip: '60601', phoneNumber: '456-123-7890',state:'Illinois' },
  ]);

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex flex-grow">
            <main className="flex-grow p-4">
              <Routes>
                <Route path="/" element={<Dashboard exportCount={5} importCount={1250} userCount={150} />} />
                <Route path="/map" element={<MapPage filteredData={filteredData} setFilteredData={setFilteredData}/>} />
                <Route path="/user-management" element={<UserManagementPage filteredData={filteredData} setFilteredData={setFilteredData} />} />
                <Route path="/family-management" element={<FamilyManagementPage filteredData={filteredData} setFilteredData={setFilteredData} />} />
                <Route path="/export" element={<ExportDataPage filteredData={filteredData} />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
