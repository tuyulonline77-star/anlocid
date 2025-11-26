import React, { useEffect, useState } from 'react';
import { getArticles, getMembers } from '../../services/mockDb';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { Users, FileText, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ articles: 0, members: 0, pendingMembers: 0 });

  useEffect(() => {
    const load = async () => {
      const [articles, members] = await Promise.all([getArticles(), getMembers()]);
      setStats({
        articles: articles.length,
        members: members.length,
        pendingMembers: members.filter(m => m.status === 'pending').length
      });
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.articles}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingMembers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">System initialization complete. Monitoring user activity...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}