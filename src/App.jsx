import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard';
import UserManagementPage from './pages/UserManagementPage';
import FamilyManagementPage from './pages/FamilyManagementPage';
import SongManagementPage from './pages/SongManagementPage';

function App() {
  return (
    <Router>
      <div className='h-screen flex flex-col'>
        <Header />
        <main className='overflow-y-auto flex-grow'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/user-management' element={<UserManagementPage />} />
            <Route path='/family-management' element={<FamilyManagementPage />} />
            <Route path='/song-management' element={<SongManagementPage />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
