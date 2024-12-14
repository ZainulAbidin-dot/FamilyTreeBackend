import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard';
import UserManagementPage from './pages/UserManagementPage';
import FamilyManagementPage from './pages/FamilyManagementPage';

function App() {
  return (
    <Router>
      <div className='flex flex-col md:flex-row min-h-screen'>
        <div className='flex-1 flex flex-col'>
          <Header />
          <div className='flex flex-grow'>
            <main className='flex-grow p-4'>
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/user-management' element={<UserManagementPage />} />
                <Route path='/family-management' element={<FamilyManagementPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
