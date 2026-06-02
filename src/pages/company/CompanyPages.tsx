import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StatusBadge, StatsCard, Modal, EmptyState, FormInput, FormTextarea } from '../../components/Shared';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LayoutDashboard, PlusCircle, Users, Award, Bell, Briefcase, CheckCircle, XCircle, Clock, Eye, UserCheck, Star, Building2 } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/company', icon: <LayoutDashboard size={18} /> },
  { label: 'Post Internship', path: '/company/post', icon: <PlusCircle size={18} /> },
  { label: 'Applicants', path: '/company/applicants', icon: <Users size={18} /> },
  { label: 'Interns', path: '/company/interns', icon: <UserCheck size={18} /> },
  { label: 'Evaluations', path: '/company/evaluations', icon: <Award size={18} /> },
  { label: 'Notifications', path: '/company/notifications', icon: <Bell size={18} /> },
];

const useCompany = () => {
  const { user } = useAuth();
  const { companies } = useData();
  return companies.find(c => c.user_id === user?.id);
};

// ============================================================
// DASHBOARD
// ============================================================
const Dashboard: React.FC = () => {
  const company = useCompany();
  const { internships, applications, placements } = useData();
  const myInternships = internships.filter(i => i.company_id === company?.id);
  const myInternshipIds = myInternships.map(i => i.id);
  const myApplications = applications.filter(a => myInternshipIds.includes(a.internship_id));
  const myPlacements = placements.filter(p => myInternshipIds.includes(p.internship_id));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Building2 size={26} /> Welcome, {company?.company_name || 'Company'}</h2>
        <p className="text-emerald-100 mt-1">{company?.is_approved ? 'Your company is approved. You can post internships.' : '⚠️ Your company is pending admin approval.'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Posted Internships" value={myInternships.length} icon={<Briefcase size={22} />} color="blue" />
        <StatsCard title="Total Applicants" value={myApplications.length} icon={<Users size={22} />} color="purple" />
        <StatsCard title="Pending Review" value={myApplications.filter(a => a.status === 'Pending').length} icon={<Clock size={22} />} color="orange" />
        <StatsCard title="Active Interns" value={myPlacements.filter(p => p.status === 'Active').length} icon={<UserCheck size={22} />} color="green" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Internships</h3>
        {myInternships.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No internships posted yet.</p>
        ) : (
          <div className="space-y-3">
            {myInternships.map(intern => {
              const appCount = applications.filter(a => a.internship_id === intern.id).length;
              return (
                <div key={intern.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{intern.title}</p>
                    <p className="text-xs text-gray-500">{intern.duration} · {intern.slots} slots · Deadline: {intern.deadline}</p>
                  </div>
                  <span className="text-sm text-gray-500">{appCount} applicant(s)</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// POST INTERNSHIP
// ============================================================
const PostInternship: React.FC = () => {
  const company = useCompany();
  const { setInternships, internships } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [duration, setDuration] = useState('');
  const [slots, setSlots] = useState('1');
  const [deadline, setDeadline] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!company || !title || !description || !requirements || !duration || !deadline) return;
    const newInternship = {
      id: Math.max(0, ...internships.map(i => i.id)) + 1,
      company_id: company.id,
      title,
      description,
      requirements,
      duration,
      slots: parseInt(slots) || 1,
      deadline,
      created_at: new Date().toISOString().split('T')[0],
    };
    setInternships(prev => [...prev, newInternship]);
    setTitle(''); setDescription(''); setRequirements(''); setDuration(''); setSlots('1'); setDeadline('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!company?.is_approved) {
    return (
      <EmptyState
        icon={<Clock size={24} />}
        title="Company Not Yet Approved"
        description="Your company needs to be approved by the admin before you can post internships. Please wait for approval."
      />
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Post New Internship</h2>
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
          <CheckCircle size={18} /> Internship posted successfully!
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <FormInput label="Position Title" value={title} onChange={setTitle} placeholder="e.g., Frontend Developer Intern" required />
          <FormTextarea label="Description" value={description} onChange={setDescription} placeholder="Describe the internship role and responsibilities..." rows={4} required />
          <FormTextarea label="Requirements" value={requirements} onChange={setRequirements} placeholder="Required skills and qualifications..." rows={3} required />
          <div className="grid sm:grid-cols-3 gap-4">
            <FormInput label="Duration" value={duration} onChange={setDuration} placeholder="e.g., 3 months" required />
            <FormInput label="Number of Slots" type="number" value={slots} onChange={setSlots} placeholder="1" required />
            <FormInput label="Application Deadline" type="date" value={deadline} onChange={setDeadline} required />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
            Post Internship
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// APPLICANTS
// ============================================================
const Applicants: React.FC = () => {
  const company = useCompany();
  const { internships, applications, setApplications, students, setNotifications, setStudents, setPlacements, placements } = useData();
  const { users } = useAuth();

  const myInternships = internships.filter(i => i.company_id === company?.id);
  const myInternshipIds = myInternships.map(i => i.id);
  const myApplications = applications.filter(a => myInternshipIds.includes(a.internship_id));

  const [viewApp, setViewApp] = useState<number | null>(null);

  const handleAction = (appId: number, action: 'Accepted' | 'Rejected' | 'Reviewed') => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: action } : a));
    const app = applications.find(a => a.id === appId);
    if (app) {
      const student = students.find(s => s.id === app.student_id);
      const intern = internships.find(i => i.id === app.internship_id);
      if (student) {
        setNotifications(prev => [...prev, {
          id: Math.max(0, ...prev.map(n => n.id)) + 1,
          user_id: student.user_id,
          message: `Your application for ${intern?.title} has been ${action.toLowerCase()}.`,
          read: false,
          created_at: new Date().toISOString().split('T')[0],
          type: action === 'Accepted' ? 'success' : action === 'Rejected' ? 'warning' : 'info',
        }]);

        if (action === 'Accepted') {
          setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: 'Pending Validation' } : s));
          // Auto-create placement
          setPlacements(prev => [...prev, {
            id: Math.max(0, ...placements.map(p => p.id), ...prev.map(p => p.id)) + 1,
            student_id: student.id,
            internship_id: app.internship_id,
            supervisor_id: null,
            status: 'Active',
            start_date: new Date().toISOString().split('T')[0],
            end_date: null,
          }]);
        }
      }
    }
    setViewApp(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Applicants</h2>

      {myApplications.length === 0 ? (
        <EmptyState icon={<Users size={24} />} title="No Applicants" description="No students have applied to your internships yet." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Student</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Position</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Applied</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myApplications.map(app => {
                  const student = students.find(s => s.id === app.student_id);
                  const intern = internships.find(i => i.id === app.internship_id);
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">{student?.full_name.charAt(0)}</div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{student?.full_name}</p>
                            <p className="text-xs text-gray-500">{student?.department} · Level {student?.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{intern?.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.applied_at}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewApp(app.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16} /></button>
                          {app.status === 'Pending' && (
                            <>
                              <button onClick={() => handleAction(app.id, 'Accepted')} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle size={16} /></button>
                              <button onClick={() => handleAction(app.id, 'Rejected')} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><XCircle size={16} /></button>
                            </>
                          )}
                          {app.status === 'Reviewed' && (
                            <>
                              <button onClick={() => handleAction(app.id, 'Accepted')} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle size={16} /></button>
                              <button onClick={() => handleAction(app.id, 'Rejected')} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><XCircle size={16} /></button>
                            </>
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

      <Modal isOpen={!!viewApp} onClose={() => setViewApp(null)} title="Application Details">
        {(() => {
          const app = applications.find(a => a.id === viewApp);
          const student = app ? students.find(s => s.id === app.student_id) : null;
          const intern = app ? internships.find(i => i.id === app.internship_id) : null;
          const user = student ? users.find(u => u.id === student.user_id) : null;
          if (!app || !student) return null;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold">{student.full_name.charAt(0)}</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{student.full_name}</h4>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Student ID</p>
                  <p className="text-sm font-semibold">{student.student_id_code}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Department</p>
                  <p className="text-sm font-semibold">{student.department}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Level</p>
                  <p className="text-sm font-semibold">{student.level}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-semibold">{student.phone}</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-400">Applied For</p>
                <p className="text-sm font-semibold text-blue-900">{intern?.title}</p>
              </div>
              {(app.status === 'Pending' || app.status === 'Reviewed') && (
                <div className="flex gap-3">
                  <button onClick={() => handleAction(app.id, 'Accepted')} className="flex-1 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 flex items-center justify-center gap-2"><CheckCircle size={16} />Accept</button>
                  <button onClick={() => handleAction(app.id, 'Rejected')} className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 flex items-center justify-center gap-2"><XCircle size={16} />Reject</button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// ============================================================
// INTERNS (Active placements)
// ============================================================
const Interns: React.FC = () => {
  const company = useCompany();
  const { internships, placements, students, supervisors } = useData();

  const myInternships = internships.filter(i => i.company_id === company?.id);
  const myInternshipIds = myInternships.map(i => i.id);
  const myPlacements = placements.filter(p => myInternshipIds.includes(p.internship_id));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Current Interns</h2>
      {myPlacements.length === 0 ? (
        <EmptyState icon={<UserCheck size={24} />} title="No Active Interns" description="Once you accept applicants, they will appear here as interns." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {myPlacements.map(p => {
            const student = students.find(s => s.id === p.student_id);
            const intern = internships.find(i => i.id === p.internship_id);
            const supervisor = p.supervisor_id ? supervisors.find(s => s.id === p.supervisor_id) : null;
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold">{student?.full_name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{student?.full_name}</p>
                    <p className="text-xs text-gray-500">{student?.department} · Level {student?.level}</p>
                  </div>
                  <div className="ml-auto"><StatusBadge status={p.status} /></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Position:</span><span className="font-medium">{intern?.title}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Start Date:</span><span className="font-medium">{p.start_date}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Supervisor:</span><span className="font-medium">{supervisor?.full_name || 'Not Assigned'}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================
// EVALUATIONS
// ============================================================
const Evaluations: React.FC = () => {
  const company = useCompany();
  const { internships, placements, students, evaluations, setEvaluations } = useData();
  const [evalPlacement, setEvalPlacement] = useState<number | null>(null);
  const [scores, setScores] = useState({ professionalism: '8', attendance: '8', communication: '8', technical: '8', teamwork: '8' });
  const [comment, setComment] = useState('');

  const myInternships = internships.filter(i => i.company_id === company?.id);
  const myInternshipIds = myInternships.map(i => i.id);
  const myPlacements = placements.filter(p => myInternshipIds.includes(p.internship_id));

  const hasEvaluated = (placementId: number) =>
    evaluations.some(e => e.placement_id === placementId && e.evaluator_type === 'company');

  const handleEvaluate = () => {
    if (!evalPlacement) return;
    const totalScore = Object.values(scores).reduce((sum, s) => sum + parseFloat(s), 0) / Object.keys(scores).length;
    setEvaluations(prev => [...prev, {
      id: Math.max(0, ...evaluations.map(e => e.id)) + 1,
      placement_id: evalPlacement,
      evaluator_type: 'company',
      score: Math.round(totalScore * 100) / 100,
      comment: comment || null,
      evaluated_at: new Date().toISOString().split('T')[0],
    }]);
    setEvalPlacement(null);
    setComment('');
    setScores({ professionalism: '8', attendance: '8', communication: '8', technical: '8', teamwork: '8' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Intern Evaluations</h2>
      {myPlacements.length === 0 ? (
        <EmptyState icon={<Award size={24} />} title="No Interns to Evaluate" description="Evaluations will be available once you have interns." />
      ) : (
        <div className="space-y-4">
          {myPlacements.map(p => {
            const student = students.find(s => s.id === p.student_id);
            const intern = internships.find(i => i.id === p.internship_id);
            const evaluated = hasEvaluated(p.id);
            const eval_ = evaluations.find(e => e.placement_id === p.id && e.evaluator_type === 'company');
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 font-bold">{student?.full_name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{student?.full_name}</p>
                      <p className="text-xs text-gray-500">{intern?.title}</p>
                    </div>
                  </div>
                  {evaluated ? (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500"><Star size={16} className="fill-yellow-500" /><span className="font-bold text-gray-900">{eval_?.score}/10</span></div>
                      <p className="text-xs text-green-600 font-medium">Evaluated</p>
                    </div>
                  ) : (
                    <button onClick={() => setEvalPlacement(p.id)} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors">Evaluate</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!evalPlacement} onClose={() => setEvalPlacement(null)} title="Evaluate Intern">
        <form onSubmit={e => { e.preventDefault(); handleEvaluate(); }} className="space-y-4">
          {Object.entries(scores).map(([key, val]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700 capitalize">{key}</label>
                <span className="text-sm font-bold text-blue-600">{val}/10</span>
              </div>
              <input type="range" min="1" max="10" step="0.5" value={val} onChange={e => setScores(prev => ({ ...prev, [key]: e.target.value }))} className="w-full accent-blue-600" />
            </div>
          ))}
          <FormTextarea label="Comments" value={comment} onChange={setComment} placeholder="Overall feedback about the intern..." rows={3} />
          <button type="submit" className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors">Submit Evaluation</button>
        </form>
      </Modal>
    </div>
  );
};

// ============================================================
// NOTIFICATIONS
// ============================================================
const CompanyNotifications: React.FC = () => {
  const { user } = useAuth();
  const { notifications, setNotifications } = useData();
  const myNotifications = notifications.filter(n => n.user_id === user?.id).sort((a, b) => b.id - a.id);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => n.user_id === user?.id ? { ...n, read: true } : n));
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
            <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))} className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${n.read ? 'bg-white border border-gray-100' : 'bg-emerald-50 border border-emerald-100'}`}>
              <Bell size={16} className={n.read ? 'text-gray-400' : 'text-emerald-500'} />
              <div className="flex-1">
                <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.created_at}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPANY ROUTER
// ============================================================
const CompanyPages: React.FC = () => {
  return (
    <DashboardLayout title="Company Portal" navItems={navItems}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="post" element={<PostInternship />} />
        <Route path="applicants" element={<Applicants />} />
        <Route path="interns" element={<Interns />} />
        <Route path="evaluations" element={<Evaluations />} />
        <Route path="notifications" element={<CompanyNotifications />} />
      </Routes>
    </DashboardLayout>
  );
};

export default CompanyPages;
