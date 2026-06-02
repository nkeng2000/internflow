import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StatusBadge, StatsCard, Modal, EmptyState, FormSelect } from '../../components/Shared';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LayoutDashboard, Users, Building2, GraduationCap, Briefcase, FileText, LinkIcon, BarChart3, Bell, CheckCircle, XCircle, UserPlus, Eye, TrendingUp, Award, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Students', path: '/admin/students', icon: <GraduationCap size={18} /> },
  { label: 'Companies', path: '/admin/companies', icon: <Building2 size={18} /> },
  { label: 'Supervisors', path: '/admin/supervisors', icon: <Users size={18} /> },
  { label: 'Internships', path: '/admin/internships', icon: <Briefcase size={18} /> },
  { label: 'Placements', path: '/admin/placements', icon: <LinkIcon size={18} /> },
  { label: 'Reports', path: '/admin/reports', icon: <FileText size={18} /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
  { label: 'Notifications', path: '/admin/notifications', icon: <Bell size={18} /> },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// ============================================================
// DASHBOARD
// ============================================================
const Dashboard: React.FC = () => {
  const { students, companies, internships, applications, placements, supervisors, weeklyReports } = useData();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard size={26} /> Admin Control Center</h2>
        <p className="text-slate-300 mt-1">Full overview of the InternFlow system.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={students.length} icon={<GraduationCap size={22} />} color="blue" />
        <StatsCard title="Companies" value={companies.length} icon={<Building2 size={22} />} color="green" subtitle={`${companies.filter(c => c.is_approved).length} approved`} />
        <StatsCard title="Active Internships" value={internships.length} icon={<Briefcase size={22} />} color="purple" />
        <StatsCard title="Active Placements" value={placements.filter(p => p.status === 'Active').length} icon={<LinkIcon size={22} />} color="orange" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Supervisors" value={supervisors.length} icon={<Users size={22} />} color="indigo" />
        <StatsCard title="Pending Applications" value={applications.filter(a => a.status === 'Pending').length} icon={<FileText size={22} />} color="red" />
        <StatsCard title="Weekly Reports" value={weeklyReports.length} icon={<FileText size={22} />} color="teal" />
        <StatsCard title="Pending Approvals" value={companies.filter(c => !c.is_approved).length} icon={<CheckCircle size={22} />} color="pink" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Application Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: applications.filter(a => a.status === 'Pending').length },
                    { name: 'Reviewed', value: applications.filter(a => a.status === 'Reviewed').length },
                    { name: 'Accepted', value: applications.filter(a => a.status === 'Accepted').length },
                    { name: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length },
                  ].filter(d => d.value > 0)}
                  cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}
                  dataKey="value"
                >
                  {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Student Status Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Unplaced', count: students.filter(s => s.status === 'Unplaced').length },
                { name: 'Pending', count: students.filter(s => s.status === 'Pending Validation').length },
                { name: 'Placed', count: students.filter(s => s.status === 'Placed').length },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {applications.slice(-5).reverse().map(app => {
            const student = students.find(s => s.id === app.student_id);
            const intern = internships.find(i => i.id === app.internship_id);
            return (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><GraduationCap size={14} /></div>
                  <div>
                    <p className="text-sm text-gray-900"><span className="font-semibold">{student?.full_name}</span> applied for <span className="font-semibold">{intern?.title}</span></p>
                    <p className="text-xs text-gray-500">{app.applied_at}</p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STUDENTS
// ============================================================
const AdminStudents: React.FC = () => {
  const { students, setStudents, placements } = useData();
  const { users } = useAuth();
  const [viewStudent, setViewStudent] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">All Students</h2>
        <span className="text-sm text-gray-500">{students.length} total</span>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Student</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">ID Code</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Department</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Level</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map(s => {
                const user = users.find(u => u.id === s.user_id);
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">{s.full_name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{s.full_name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{s.student_id_code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.level}</td>
                    <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewStudent(s.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
                        {s.status === 'Pending Validation' && (
                          <button onClick={() => setStudents(prev => prev.map(x => x.id === s.id ? { ...x, status: 'Placed' } : x))} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Details">
        {(() => {
          const s = students.find(x => x.id === viewStudent);
          const user = s ? users.find(u => u.id === s.user_id) : null;
          const p = s ? placements.find(x => x.student_id === s.id) : null;
          if (!s) return null;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold">{s.full_name.charAt(0)}</div>
                <div>
                  <h4 className="text-lg font-bold">{s.full_name}</h4>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <StatusBadge status={s.status} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Student ID', s.student_id_code],
                  ['Department', s.department],
                  ['Level', s.level],
                  ['Phone', s.phone],
                  ['Placement', p ? 'Yes' : 'No'],
                  ['Status', s.status],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// ============================================================
// COMPANIES
// ============================================================
const AdminCompanies: React.FC = () => {
  const { companies, setCompanies } = useData();
  const { users } = useAuth();

  const handleApproval = (companyId: number, approved: boolean) => {
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, is_approved: approved } : c));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">All Companies</h2>
        <span className="text-sm text-gray-500">{companies.length} total · {companies.filter(c => !c.is_approved).length} pending</span>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Company</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Industry</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Location</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Contact</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companies.map(c => {
                const user = users.find(u => u.id === c.user_id);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-sm">{c.company_name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{c.company_name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.industry}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.contact_person}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${c.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {c.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!c.is_approved && (
                          <button onClick={() => handleApproval(c.id, true)} className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"><CheckCircle size={12} /> Approve</button>
                        )}
                        {c.is_approved && (
                          <button onClick={() => handleApproval(c.id, false)} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"><XCircle size={12} /> Revoke</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SUPERVISORS
// ============================================================
const AdminSupervisors: React.FC = () => {
  const { supervisors, placements, students } = useData();
  const { users } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">All Supervisors</h2>
        <span className="text-sm text-gray-500">{supervisors.length} total</span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supervisors.map(sv => {
          const user = users.find(u => u.id === sv.user_id);
          const assigned = placements.filter(p => p.supervisor_id === sv.id);
          return (
            <div key={sv.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg font-bold">{sv.full_name.charAt(0)}</div>
                <div>
                  <p className="font-bold text-gray-900">{sv.full_name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Department:</span><span className="font-medium">{sv.department}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Assigned Students:</span><span className="font-medium">{assigned.length}</span></div>
              </div>
              {assigned.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  {assigned.map(a => {
                    const student = students.find(s => s.id === a.student_id);
                    return (
                      <p key={a.id} className="text-xs text-gray-500 flex items-center gap-1"><GraduationCap size={12} /> {student?.full_name}</p>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// INTERNSHIPS
// ============================================================
const AdminInternships: React.FC = () => {
  const { internships, companies, applications } = useData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">All Internships</h2>
        <span className="text-sm text-gray-500">{internships.length} total</span>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Title</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Company</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Duration</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Slots</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Deadline</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {internships.map(intern => {
                const comp = companies.find(c => c.id === intern.company_id);
                const appCount = applications.filter(a => a.internship_id === intern.id).length;
                return (
                  <tr key={intern.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{intern.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{comp?.company_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{intern.duration}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{intern.slots}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{intern.deadline}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{appCount}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PLACEMENTS
// ============================================================
const AdminPlacements: React.FC = () => {
  const { placements, setPlacements, students, internships, companies, supervisors, setStudents } = useData();
  const [assignModal, setAssignModal] = useState<number | null>(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');

  const handleAssignSupervisor = () => {
    if (!assignModal || !selectedSupervisor) return;
    const supId = parseInt(selectedSupervisor);
    setPlacements(prev => prev.map(p => p.id === assignModal ? { ...p, supervisor_id: supId } : p));
    const placement = placements.find(p => p.id === assignModal);
    if (placement) {
      setStudents(prev => prev.map(s => s.id === placement.student_id ? { ...s, status: 'Placed' } : s));
    }
    setAssignModal(null);
    setSelectedSupervisor('');
  };

  const handleStatusChange = (placementId: number, status: 'Active' | 'Completed' | 'Terminated') => {
    setPlacements(prev => prev.map(p => p.id === placementId ? { ...p, status } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">All Placements</h2>
        <span className="text-sm text-gray-500">{placements.length} total</span>
      </div>
      {placements.length === 0 ? (
        <EmptyState icon={<LinkIcon size={24} />} title="No Placements" description="Placements will appear here when companies accept student applications." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Student</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Internship</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Company</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Supervisor</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {placements.map(p => {
                  const student = students.find(s => s.id === p.student_id);
                  const intern = internships.find(i => i.id === p.internship_id);
                  const comp = intern ? companies.find(c => c.id === intern.company_id) : null;
                  const sup = p.supervisor_id ? supervisors.find(s => s.id === p.supervisor_id) : null;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">{student?.full_name.charAt(0)}</div>
                          <p className="text-sm font-semibold text-gray-900">{student?.full_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{intern?.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{comp?.company_name}</td>
                      <td className="px-6 py-4">
                        {sup ? (
                          <span className="text-sm text-gray-600">{sup.full_name}</span>
                        ) : (
                          <span className="text-xs text-orange-600 font-medium">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!sup && (
                            <button onClick={() => setAssignModal(p.id)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"><UserPlus size={12} /> Assign</button>
                          )}
                          {p.status === 'Active' && (
                            <button onClick={() => handleStatusChange(p.id, 'Completed')} className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors">Complete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title="Assign Supervisor" maxWidth="max-w-md">
        <form onSubmit={e => { e.preventDefault(); handleAssignSupervisor(); }} className="space-y-4">
          <FormSelect
            label="Select Supervisor"
            value={selectedSupervisor}
            onChange={setSelectedSupervisor}
            options={supervisors.map(s => ({ value: String(s.id), label: `${s.full_name} (${s.department})` }))}
            required
          />
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">Assign Supervisor</button>
        </form>
      </Modal>
    </div>
  );
};

// ============================================================
// REPORTS
// ============================================================
const AdminReports: React.FC = () => {
  const { weeklyReports, placements, students, internships, companies } = useData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">All Weekly Reports</h2>
        <span className="text-sm text-gray-500">{weeklyReports.length} total</span>
      </div>
      {weeklyReports.length === 0 ? (
        <EmptyState icon={<FileText size={24} />} title="No Reports" description="Weekly reports from students will appear here." />
      ) : (
        <div className="space-y-4">
          {weeklyReports.sort((a, b) => b.id - a.id).map(r => {
            const placement = placements.find(p => p.id === r.placement_id);
            const student = placement ? students.find(s => s.id === placement.student_id) : null;
            const intern = placement ? internships.find(i => i.id === placement.internship_id) : null;
            const comp = intern ? companies.find(c => c.id === intern.company_id) : null;
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">{student?.full_name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{student?.full_name} — Week {r.week_number}</p>
                      <p className="text-xs text-gray-500">{comp?.company_name} · {intern?.title} · {r.submitted_at}</p>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Tasks</p>
                    <p className="text-xs text-blue-900">{r.tasks_completed}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Skills</p>
                    <p className="text-xs text-green-900">{r.skills_learned}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-orange-700 mb-1">Challenges</p>
                    <p className="text-xs text-orange-900">{r.challenges}</p>
                  </div>
                </div>
                {r.feedback && (
                  <div className="mt-3 bg-purple-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-purple-700 mb-1">Supervisor Feedback</p>
                    <p className="text-xs text-purple-900">{r.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================
// ANALYTICS
// ============================================================
const AdminAnalytics: React.FC = () => {
  const { students, companies, internships, applications, placements, evaluations, weeklyReports } = useData();

  const deptData = Array.from(new Set(students.map(s => s.department))).map(dept => ({
    name: dept.length > 15 ? dept.substring(0, 15) + '...' : dept,
    students: students.filter(s => s.department === dept).length,
  }));

  const companyData = companies.filter(c => c.is_approved).map(c => ({
    name: c.company_name.length > 12 ? c.company_name.substring(0, 12) + '...' : c.company_name,
    internships: internships.filter(i => i.company_id === c.id).length,
    placements: placements.filter(p => internships.filter(i => i.company_id === c.id).map(i => i.id).includes(p.internship_id)).length,
  }));

  const avgScore = evaluations.length > 0
    ? (evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length).toFixed(1)
    : 'N/A';

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">System Analytics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Placement Rate" value={students.length > 0 ? `${Math.round((students.filter(s => s.status === 'Placed').length / students.length) * 100)}%` : '0%'} icon={<TrendingUp size={22} />} color="green" />
        <StatsCard title="Avg. Evaluation Score" value={avgScore} icon={<Award size={22} />} color="purple" />
        <StatsCard title="Reports This Month" value={weeklyReports.length} icon={<FileText size={22} />} color="blue" />
        <StatsCard title="Acceptance Rate" value={applications.length > 0 ? `${Math.round((applications.filter(a => a.status === 'Accepted').length / applications.length) * 100)}%` : '0%'} icon={<CheckCircle size={22} />} color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Students by Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="students" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Company Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="internships" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Internships" />
                <Bar dataKey="placements" fill="#10B981" radius={[8, 8, 0, 0]} name="Placements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Evaluation Scores</h3>
        {evaluations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No evaluations completed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Student</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Evaluator</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Score</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {evaluations.map(ev => {
                  const placement = placements.find(p => p.id === ev.placement_id);
                  const student = placement ? students.find(s => s.id === placement.student_id) : null;
                  return (
                    <tr key={ev.id}>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{student?.full_name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 capitalize">{ev.evaluator_type}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-bold">{ev.score}/10</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">{ev.evaluated_at}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// NOTIFICATIONS
// ============================================================
const AdminNotifications: React.FC = () => {
  const { user } = useAuth();
  const { notifications, setNotifications } = useData();
  const myNotifications = notifications.filter(n => n.user_id === user?.id).sort((a, b) => b.id - a.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        {myNotifications.some(n => !n.read) && (
          <button onClick={() => setNotifications(prev => prev.map(n => n.user_id === user?.id ? { ...n, read: true } : n))} className="text-sm text-blue-600 font-medium hover:text-blue-700">Mark all as read</button>
        )}
      </div>
      {myNotifications.length === 0 ? (
        <EmptyState icon={<Bell size={24} />} title="No Notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {myNotifications.map(n => (
            <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))} className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${n.read ? 'bg-white border border-gray-100' : 'bg-slate-50 border border-slate-200'}`}>
              <Bell size={16} className={n.read ? 'text-gray-400' : 'text-slate-600'} />
              <div className="flex-1">
                <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.created_at}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN ADMIN ROUTER
// ============================================================
const AdminPages: React.FC = () => {
  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="supervisors" element={<AdminSupervisors />} />
        <Route path="internships" element={<AdminInternships />} />
        <Route path="placements" element={<AdminPlacements />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminPages;
