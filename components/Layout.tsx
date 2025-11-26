import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, LayoutDashboard, FileText, Users, Settings, LogOut, LogIn } from 'lucide-react';
import { Button } from './ui';
import { isAdminLoggedIn, logoutAdmin } from '../services/mockDb';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = isAdminLoggedIn();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-slate-900" />
            <span className="text-xl font-bold tracking-tight">AutoBlog Pro</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-slate-900 text-slate-600 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-slate-900 text-slate-600 transition-colors">About</Link>
            <Link to="/register" className="hover:text-slate-900 text-slate-600 transition-colors">Join Us</Link>
            {isLoggedIn ? (
               <Link to="/admin" className="text-blue-600 hover:text-blue-700">Dashboard</Link>
            ) : (
               <Link to="/admin/login" className="flex items-center text-slate-500 hover:text-slate-900"><LogIn className="w-4 h-4 mr-1"/> Login</Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
            <Link to="/" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/about" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/register" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Join Membership</Link>
             <Link to="/admin" className="block text-sm font-medium text-blue-600" onClick={() => setIsMenuOpen(false)}>Admin</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} AutoBlog Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900';

  const handleLogout = () => {
    logoutAdmin();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white hidden md:block fixed h-full">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <nav className="p-4 space-y-1">
          <Link to="/admin" className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin')}`}>
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/articles" className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/articles')}`}>
            <FileText className="h-4 w-4" />
            <span>Articles</span>
          </Link>
          <Link to="/admin/members" className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/members')}`}>
            <Users className="h-4 w-4" />
            <span>Members</span>
          </Link>
          <Link to="/admin/settings" className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/settings')}`}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
