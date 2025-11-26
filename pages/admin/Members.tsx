import React, { useEffect, useState } from 'react';
import { getMembers, updateMemberStatus } from '../../services/mockDb';
import { Member } from '../../types';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { Check, X, Search } from 'lucide-react';

export default function AdminMembers() {
    const [members, setMembers] = useState<Member[]>([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    const loadMembers = async () => {
        setLoading(true);
        const data = await getMembers();
        setMembers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const handleStatusChange = async (id: string, newStatus: Member['status']) => {
        await updateMemberStatus(id, newStatus);
        loadMembers(); // Reload to refresh list
    };

    const filteredMembers = members.filter(m => 
        m.fullName.toLowerCase().includes(filter.toLowerCase()) || 
        m.email.toLowerCase().includes(filter.toLowerCase()) ||
        m.plateNumber.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Member Management</h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search members..." 
                        className="pl-8 h-10 w-full rounded-md border border-slate-300 text-sm focus:ring-2 focus:ring-slate-950 outline-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Name / Email</th>
                                    <th className="px-4 py-3">Car Details</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Joined Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredMembers.map(member => (
                                    <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900">{member.fullName}</div>
                                            <div className="text-slate-500 text-xs">{member.email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-slate-900">{member.carType}</div>
                                            <div className="text-slate-500 text-xs bg-slate-100 inline-block px-1 rounded mt-1">{member.plateNumber}</div>
                                        </td>
                                        <td className="px-4 py-3">{member.phone}</td>
                                        <td className="px-4 py-3 text-slate-500">
                                            {new Date(member.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
                                                ${member.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                                  member.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                                  'bg-orange-100 text-orange-700'}`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            {member.status === 'pending' && (
                                                <>
                                                    <Button size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(member.id, 'approved')} title="Approve">
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="danger" className="h-8 w-8 p-0" onClick={() => handleStatusChange(member.id, 'rejected')} title="Reject">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            {member.status !== 'pending' && (
                                                <Button size="sm" variant="outline" className="h-8 text-xs px-2" onClick={() => handleStatusChange(member.id, 'pending')}>
                                                    Reset
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredMembers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-slate-500">No members found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
