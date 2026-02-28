// src/components/Layout.jsx
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;