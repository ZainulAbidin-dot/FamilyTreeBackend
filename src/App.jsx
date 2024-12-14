import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard';
import UserManagementPage from './pages/UserManagementPage';
import FamilyManagementPage from './pages/FamilyManagementPage';

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
