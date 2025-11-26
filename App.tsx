import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { PublicLayout, AdminLayout } from './components/Layout';
import { isAdminLoggedIn, getArticles } from './services/mockDb';

// Pages
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Register from './pages/Register';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ArticleEditor from './pages/admin/ArticleEditor';
import AdminMembers from './pages/admin/Members'; // Imported the new file
import AdminSettings from './pages/admin/Settings'; // Imported the new file

// Admin Route Protection
const ProtectedAdminRoute = () => {
  return isAdminLoggedIn() ? (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

// Admin List pages (Article List remains simple for now, could be extracted too)
const AdminArticleList = () => {
    const [list, setList] = useState<any[]>([]);
    useEffect(() => { getArticles().then(setList) }, []);
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Articles</h1>
                <a href="#/admin/articles/new" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">Create New</a>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium text-slate-500">Title</th>
                            <th className="px-6 py-3 font-medium text-slate-500">Category</th>
                            <th className="px-6 py-3 font-medium text-slate-500 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {list.map(a => (
                            <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{a.title}</td>
                                <td className="px-6 py-4 text-slate-500">{a.category}</td>
                                <td className="px-6 py-4 text-right">
                                    <a href={`#/admin/articles/${a.id}`} className="text-blue-600 hover:text-blue-800 font-medium">Edit</a>
                                </td>
                            </tr>
                        ))}
                        {list.length === 0 && (
                            <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">No articles yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/article/:slug" element={<PublicLayout><ArticleDetail /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><div className="p-20 text-center">About Page Content</div></PublicLayout>} />
        
        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<AdminArticleList />} />
          <Route path="articles/:id" element={<ArticleEditor />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}
