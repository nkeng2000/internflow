import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StatusBadge, StatsCard, Modal, EmptyState, FormTextarea } from '../../components/Shared';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LayoutDashboard, Briefcase, FileText, ClipboardList, User, Bell, Search, Calendar, MapPin, Clock, Send, Eye, Building2, BookOpen, CheckCircle, GraduationCap } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/student', icon: <LayoutDashboard size={18} /> },
  { label: 'Internships', path: '/student/internships', icon: <Briefcase size={18} /> },
  { label: 'Applications', path: '/student/applications', icon: <ClipboardList size={18} /> },
  { label: 'Weekly Reports', path: '/student/reports', icon: <FileText size={18} /> },
  { label: 'Profile', path: '/student/profile', icon: <User size={18} /> },
  { label: 'Notifications', path: '/student/notifications', icon: <Bell size={18} /> },
];

// Helper to get current student
const useStudent = () => {
  const { user } = useAuth();
  const { students } = useData();
  return students.find(s => s.user_id === user?.id);
};

// ============================================================
// DASHBOARD
// ============================================================
const Dashboard: React.FC = () => {
  const student = useStudent();
  const { applications, placements, weeklyReports, internships, companies } = useData();
  const navigate = useNavigate();

  const myApps = applications.filter(a => a.student_id === student?.id);
  const myPlacement = placements.find(p => p.student_id === student?.id && p.status === 'Active');
  const myReports = myPlacement ? weeklyReports.filter(r => r.placement_id === myPlacement.id) : [];

  const placementInternship = myPlacement ? internships.find(i => i.id === myPlacement.internship_id) : null;
  const placementCompany = placementInternship ? companies.find(c => c.id === placementInternship.company_id) : null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2"><GraduationCap size={26} /> Welcome back, {student?.full_name || 'Student'}</h2>
        <p className="text-blue-100 mt-1">Here's an overview of your internship journey.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Applications" value={myApps.length} icon={<ClipboardList size={22} />} color="blue" />
        <StatsCard title="Accepted" value={myApps.filter(a => a.status === 'Accepted').length} icon={<CheckCircle size={22} />} color="green" />
        <StatsCard title="Reports Submitted" value={myReports.length} icon={<FileText size={22} />} color="purple" />
        <StatsCard title="Status" value={student?.status || 'N/A'} icon={<User size={22} />} color="orange" />
      </div>

      {myPlacement && placementInternship && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Current Placement</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Briefcase size={18} /></div>
              <div>
                <p className="text-xs text-gray-400">Position</p>
                <p className="text-sm font-semibold text-gray-900">{placementInternship.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600"><Building2 size={18} /></div>
              <div>
                <p className="text-xs text-gray-400">Company</p>
                <p className="text-sm font-semibold text-gray-900">{placementCompany?.company_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600"><Calendar size={18} /></div>
              <div>
                <p className="text-xs text-gray-400">Start Date</p>
                <p className="text-sm font-semibold text-gray-900">{myPlacement.start_date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600"><Clock size={18} /></div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <StatusBadge status={myPlacement.status} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
            <button onClick={() => navigate('/student/applications')} className="text-sm text-blue-600 font-medium hover:text-blue-700">View All →</button>
          </div>
          {myApps.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">No applications yet. Browse internships to apply!</p>
          ) : (
            <div className="space-y-3">
              {myApps.slice(0, 3).map(app => {
                const intern = internships.find(i => i.id === app.internship_id);
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{intern?.title}</p>
                      <p className="text-xs text-gray-500">{app.applied_at}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Reports</h3>
            <button onClick={() => navigate('/student/reports')} className="text-sm text-blue-600 font-medium hover:text-blue-700">View All →</button>
          </div>
          {myReports.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">No reports submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {myReports.slice(-3).reverse().map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Week {r.week_number}</p>
                    <p className="text-xs text-gray-500">{r.submitted_at}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// INTERNSHIPS BROWSE
// ============================================================
const Internships: React.FC = () => {
  const student = useStudent();
  const { internships, companies, applications, setApplications, setNotifications } = useData();
  const [search, setSearch] = useState('');
  const [selectedInternship, setSelectedInternship] = useState<number | null>(null);

  const approvedCompanyIds = companies.filter(c => c.is_approved).map(c => c.id);
  const availableInternships = internships.filter(i =>
    approvedCompanyIds.includes(i.company_id) &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()))
  );

  const hasApplied = (internshipId: number) =>
    applications.some(a => a.student_id === student?.id && a.internship_id === internshipId);

  const handleApply = (internshipId: number) => {
    if (!student || hasApplied(internshipId)) return;
    const newApp = {
      id: Math.max(0, ...applications.map(a => a.id)) + 1,
      student_id: student.id,
      internship_id: internshipId,
      status: 'Pending' as const,
      applied_at: new Date().toISOString().split('T')[0],
    };
    setApplications(prev => [...prev, newApp]);
    const intern = internships.find(i => i.id === internshipId);
    const comp = companies.find(c => c.id === intern?.company_id);
    setNotifications(prev => [...prev, {
      id: Math.max(0, ...prev.map(n => n.id)) + 1,
      user_id: comp?.user_id || 0,
      message: `New application received from ${student.full_name} for ${intern?.title}`,
      read: false,
      created_at: new Date().toISOString().split('T')[0],
      type: 'info' as const,
    }]);
    setSelectedInternship(null);
  };

  const selected = selectedInternship ? internships.find(i => i.id === selectedInternship) : null;
  const selectedCompany = selected ? companies.find(c => c.id === selected.company_id) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Available Internships</h2>
          <p className="text-sm text-gray-500">{availableInternships.length} opportunities available</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search internships..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
      </div>

      {availableInternships.length === 0 ? (
        <EmptyState icon={<Briefcase size={24} />} title="No Internships Found" description="No internship opportunities match your search criteria." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableInternships.map(intern => {
            const comp = companies.find(c => c.id === intern.company_id);
            const applied = hasApplied(intern.id);
            return (
              <div key={intern.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
                    {comp?.company_name.charAt(0)}
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{intern.slots} slots</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{intern.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{comp?.company_name}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><MapPin size={12} />{comp?.location}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{intern.duration}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} />Due: {intern.deadline}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{intern.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedInternship(intern.id)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                    <Eye size={14} /> View
                  </button>
                  {applied ? (
                    <span className="flex-1 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-xl text-center">Applied ✓</span>
                  ) : (
                    <button onClick={() => handleApply(intern.id)} className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                      <Send size={14} /> Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelectedInternship(null)} title={selected?.title || ''}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">{selectedCompany?.company_name.charAt(0)}</div>
              <div>
                <p className="font-semibold text-gray-900">{selectedCompany?.company_name}</p>
                <p className="text-sm text-gray-500">{selectedCompany?.industry} · {selectedCompany?.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-sm font-semibold">{selected.duration}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">Slots</p>
                <p className="text-sm font-semibold">{selected.slots}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">Deadline</p>
                <p className="text-sm font-semibold">{selected.deadline}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
              <p className="text-sm text-gray-600">{selected.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Requirements</h4>
              <p className="text-sm text-gray-600">{selected.requirements}</p>
            </div>
            {!hasApplied(selected.id) && (
              <button onClick={() => handleApply(selected.id)} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Apply Now
              </button>
            )}
            {hasApplied(selected.id) && (
              <p className="text-center text-green-600 font-medium py-3 bg-green-50 rounded-xl">You have already applied ✓</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// ============================================================
// APPLICATIONS
// ============================================================
const Applications: React.FC = () => {
  const student = useStudent();
  const { applications, internships, companies } = useData();

  const myApps = applications.filter(a => a.student_id === student?.id);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">My Applications</h2>

      {myApps.length === 0 ? (
        <EmptyState icon={<ClipboardList size={24} />} title="No Applications" description="You haven't applied to any internships yet. Browse available opportunities!" />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Position</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Company</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Applied</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myApps.map(app => {
                  const intern = internships.find(i => i.id === app.internship_id);
                  const comp = intern ? companies.find(c => c.id === intern.company_id) : null;
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{intern?.title}</p>
                        <p className="text-xs text-gray-500">{intern?.duration}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{comp?.company_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.applied_at}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// WEEKLY REPORTS
// ============================================================
const Reports: React.FC = () => {
  const student = useStudent();
  const { placements, weeklyReports, setWeeklyReports } = useData();
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState('');
  const [skills, setSkills] = useState('');
  const [challenges, setChallenges] = useState('');

  const myPlacement = placements.find(p => p.student_id === student?.id && p.status === 'Active');
  const myReports = myPlacement ? weeklyReports.filter(r => r.placement_id === myPlacement.id).sort((a, b) => b.week_number - a.week_number) : [];

  const nextWeek = myReports.length > 0 ? Math.max(...myReports.map(r => r.week_number)) + 1 : 1;

  const handleSubmit = () => {
    if (!myPlacement || !tasks || !skills || !challenges) return;
    const newReport = {
      id: Math.max(0, ...weeklyReports.map(r => r.id)) + 1,
      placement_id: myPlacement.id,
      week_number: nextWeek,
      tasks_completed: tasks,
      skills_learned: skills,
      challenges,
      status: 'Submitted' as const,
      feedback: null,
      submitted_at: new Date().toISOString().split('T')[0],
    };
    setWeeklyReports(prev => [...prev, newReport]);
    setTasks(''); setSkills(''); setChallenges('');
    setShowForm(false);
  };

  if (!myPlacement) {
    return (
      <EmptyState icon={<FileText size={24} />} title="No Active Placement" description="Weekly reports will be available once you have an active internship placement." />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Weekly Reports</h2>
          <p className="text-sm text-gray-500">{myReports.length} reports submitted</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Send size={16} /> Submit Report
        </button>
      </div>

      {myReports.length === 0 && !showForm ? (
        <EmptyState icon={<FileText size={24} />} title="No Reports Yet" description="Submit your first weekly report to track your progress." />
      ) : (
        <div className="space-y-4">
          {myReports.map(report => (
            <div key={report.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Week {report.week_number}</h3>
                  <p className="text-xs text-gray-500">Submitted: {report.submitted_at}</p>
                </div>
                <StatusBadge status={report.status} />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Tasks Completed</p>
                  <p className="text-sm text-blue-900">{report.tasks_completed}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-700 mb-1">Skills Learned</p>
                  <p className="text-sm text-green-900">{report.skills_learned}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-orange-700 mb-1">Challenges Faced</p>
                  <p className="text-sm text-orange-900">{report.challenges}</p>
                </div>
              </div>
              {report.feedback && (
                <div className="mt-4 bg-purple-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-purple-700 mb-1">Supervisor Feedback</p>
                  <p className="text-sm text-purple-900">{report.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={`Submit Week ${nextWeek} Report`}>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <FormTextarea label="Tasks Completed" value={tasks} onChange={setTasks} placeholder="Describe what you worked on this week..." rows={3} required />
          <FormTextarea label="Skills Learned" value={skills} onChange={setSkills} placeholder="What new skills did you learn?" rows={3} required />
          <FormTextarea label="Challenges Faced" value={challenges} onChange={setChallenges} placeholder="What challenges did you encounter?" rows={3} required />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            Submit Report
          </button>
        </form>
      </Modal>
    </div>
  );
};

// ============================================================
// PROFILE
// ============================================================
const Profile: React.FC = () => {
  const student = useStudent();
  const { user } = useAuth();
  const { setStudents } = useData();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(student?.phone || '');
  const [department, setDepartment] = useState(student?.department || '');

  const handleSave = () => {
    if (!student) return;
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, phone, department } : s));
    setEditing(false);
  };

  if (!student) {
    return <EmptyState icon={<User size={24} />} title="Profile Not Found" description="Please complete your profile setup." />;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-lg font-bold text-gray-900">My Profile</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {student.full_name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{student.full_name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <StatusBadge status={student.status} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium">Student ID</p>
            <p className="text-sm font-semibold text-gray-900">{student.student_id_code}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium">Department</p>
            {editing ? (
              <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
            ) : (
              <p className="text-sm font-semibold text-gray-900">{student.department}</p>
            )}
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium">Level</p>
            <p className="text-sm font-semibold text-gray-900">{student.level}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium">Phone</p>
            {editing ? (
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
            ) : (
              <p className="text-sm font-semibold text-gray-900">{student.phone}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          {editing ? (
            <>
              <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">Save Changes</button>
              <button onClick={() => setEditing(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// NOTIFICATIONS
// ============================================================
const Notifications: React.FC = () => {
  const { user } = useAuth();
  const { notifications, setNotifications } = useData();

  const myNotifications = notifications.filter(n => n.user_id === user?.id).sort((a, b) => b.id - a.id);

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => n.user_id === user?.id ? { ...n, read: true } : n));
  };

  const typeIcons = {
    info: <BookOpen size={16} className="text-blue-500" />,
    success: <CheckCircle size={16} className="text-green-500" />,
    warning: <Bell size={16} className="text-orange-500" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        {myNotifications.some(n => !n.read) && (
          <button onClick={markAllRead} className="text-sm text-blue-600 font-medium hover:text-blue-700">Mark all as read</button>
        )}
      </div>
      {myNotifications.length === 0 ? (
        <EmptyState icon={<Bell size={24} />} title="No Notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {myNotifications.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)} className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${n.read ? 'bg-white border border-gray-100' : 'bg-blue-50 border border-blue-100'}`}>
              <div className="mt-0.5">{typeIcons[n.type]}</div>
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
// MAIN STUDENT ROUTER
// ============================================================
const StudentPages: React.FC = () => {
  return (
    <DashboardLayout title="Student Portal" navItems={navItems}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="internships" element={<Internships />} />
        <Route path="applications" element={<Applications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentPages;
