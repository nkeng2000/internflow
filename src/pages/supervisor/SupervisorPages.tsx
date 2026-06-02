import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StatusBadge, StatsCard, Modal, EmptyState, FormTextarea } from '../../components/Shared';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LayoutDashboard, Users, FileText, Award, Bell, Star, CheckCircle, MessageSquare, Eye, RotateCcw, BookOpen } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/supervisor', icon: <LayoutDashboard size={18} /> },
  { label: 'Assigned Students', path: '/supervisor/students', icon: <Users size={18} /> },
  { label: 'Review Reports', path: '/supervisor/reports', icon: <FileText size={18} /> },
  { label: 'Evaluations', path: '/supervisor/evaluations', icon: <Award size={18} /> },
  { label: 'Notifications', path: '/supervisor/notifications', icon: <Bell size={18} /> },
];

const useSupervisor = () => {
  const { user } = useAuth();
  const { supervisors } = useData();
  return supervisors.find(s => s.user_id === user?.id);
};

// ============================================================
// DASHBOARD
// ============================================================
const Dashboard: React.FC = () => {
  const supervisor = useSupervisor();
  const { placements, students, weeklyReports, internships, companies } = useData();

  const myPlacements = placements.filter(p => p.supervisor_id === supervisor?.id);
  const myReports = weeklyReports.filter(r => myPlacements.some(p => p.id === r.placement_id));
  const pendingReviews = myReports.filter(r => r.status === 'Submitted');

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen size={26} /> Welcome, {supervisor?.full_name || 'Supervisor'}</h2>
        <p className="text-purple-100 mt-1">Monitor your assigned students and review their progress reports.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Assigned Students" value={myPlacements.length} icon={<Users size={22} />} color="purple" />
        <StatsCard title="Total Reports" value={myReports.length} icon={<FileText size={22} />} color="blue" />
        <StatsCard title="Pending Reviews" value={pendingReviews.length} icon={<MessageSquare size={22} />} color="orange" />
        <StatsCard title="Approved Reports" value={myReports.filter(r => r.status === 'Approved').length} icon={<CheckCircle size={22} />} color="green" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Assigned Students</h3>
          {myPlacements.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No students assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {myPlacements.map(p => {
                const student = students.find(s => s.id === p.student_id);
                const intern = internships.find(i => i.id === p.internship_id);
                const comp = intern ? companies.find(c => c.id === intern.company_id) : null;
                return (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm">{student?.full_name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{student?.full_name}</p>
                        <p className="text-xs text-gray-500">{comp?.company_name} · {intern?.title}</p>
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Reviews</h3>
          {pendingReviews.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">All reports reviewed! 🎉</p>
          ) : (
            <div className="space-y-3">
              {pendingReviews.map(r => {
                const placement = myPlacements.find(p => p.id === r.placement_id);
                const student = placement ? students.find(s => s.id === placement.student_id) : null;
                return (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{student?.full_name} — Week {r.week_number}</p>
                      <p className="text-xs text-gray-500">{r.submitted_at}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ASSIGNED STUDENTS
// ============================================================
const AssignedStudents: React.FC = () => {
  const supervisor = useSupervisor();
  const { placements, students, internships, companies, weeklyReports } = useData();

  const myPlacements = placements.filter(p => p.supervisor_id === supervisor?.id);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Assigned Students</h2>
      {myPlacements.length === 0 ? (
        <EmptyState icon={<Users size={24} />} title="No Assigned Students" description="The admin will assign students to you for supervision." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {myPlacements.map(p => {
            const student = students.find(s => s.id === p.student_id);
            const intern = internships.find(i => i.id === p.internship_id);
            const comp = intern ? companies.find(c => c.id === intern.company_id) : null;
            const reports = weeklyReports.filter(r => r.placement_id === p.id);
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-lg font-bold">{student?.full_name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-gray-900">{student?.full_name}</p>
                    <p className="text-sm text-gray-500">{student?.department} · Level {student?.level}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Position:</span><span className="font-medium">{intern?.title}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Company:</span><span className="font-medium">{comp?.company_name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Status:</span><StatusBadge status={p.status} /></div>
                  <div className="flex justify-between"><span className="text-gray-400">Reports:</span><span className="font-medium">{reports.length} submitted</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Start Date:</span><span className="font-medium">{p.start_date}</span></div>
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
// REVIEW REPORTS
// ============================================================
const ReviewReports: React.FC = () => {
  const supervisor = useSupervisor();
  const { placements, weeklyReports, setWeeklyReports, students } = useData();
  const [reviewId, setReviewId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [action, setAction] = useState<'Approved' | 'Needs Revision'>('Approved');

  const myPlacements = placements.filter(p => p.supervisor_id === supervisor?.id);
  const myReports = weeklyReports.filter(r => myPlacements.some(p => p.id === r.placement_id)).sort((a, b) => b.id - a.id);

  const handleReview = () => {
    if (!reviewId || !feedback) return;
    setWeeklyReports(prev => prev.map(r => r.id === reviewId ? { ...r, status: action, feedback } : r));
    setReviewId(null);
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Review Weekly Reports</h2>
      {myReports.length === 0 ? (
        <EmptyState icon={<FileText size={24} />} title="No Reports" description="No weekly reports from your assigned students yet." />
      ) : (
        <div className="space-y-4">
          {myReports.map(report => {
            const placement = myPlacements.find(p => p.id === report.placement_id);
            const student = placement ? students.find(s => s.id === placement.student_id) : null;
            return (
              <div key={report.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">{student?.full_name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{student?.full_name} — Week {report.week_number}</p>
                      <p className="text-xs text-gray-500">Submitted: {report.submitted_at}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={report.status} />
                    {report.status === 'Submitted' && (
                      <button onClick={() => setReviewId(report.id)} className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"><Eye size={16} /></button>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Tasks</p>
                    <p className="text-xs text-blue-900">{report.tasks_completed}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Skills</p>
                    <p className="text-xs text-green-900">{report.skills_learned}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-orange-700 mb-1">Challenges</p>
                    <p className="text-xs text-orange-900">{report.challenges}</p>
                  </div>
                </div>
                {report.feedback && (
                  <div className="mt-3 bg-purple-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-purple-700 mb-1">Your Feedback</p>
                    <p className="text-xs text-purple-900">{report.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!reviewId} onClose={() => setReviewId(null)} title="Review Report">
        <form onSubmit={e => { e.preventDefault(); handleReview(); }} className="space-y-4">
          <FormTextarea label="Feedback / Comments" value={feedback} onChange={setFeedback} placeholder="Provide your feedback on this report..." rows={4} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setAction('Approved')} className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${action === 'Approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <CheckCircle size={16} /> Approve
              </button>
              <button type="button" onClick={() => setAction('Needs Revision')} className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${action === 'Needs Revision' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <RotateCcw size={16} /> Request Revision
              </button>
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors">Submit Review</button>
        </form>
      </Modal>
    </div>
  );
};

// ============================================================
// EVALUATIONS
// ============================================================
const SupervisorEvaluations: React.FC = () => {
  const supervisor = useSupervisor();
  const { placements, students, evaluations, setEvaluations, internships } = useData();
  const [evalPlacement, setEvalPlacement] = useState<number | null>(null);
  const [scores, setScores] = useState({ reportQuality: '8', performance: '8', discipline: '8', learningProgress: '8' });
  const [comment, setComment] = useState('');

  const myPlacements = placements.filter(p => p.supervisor_id === supervisor?.id);

  const hasEvaluated = (placementId: number) =>
    evaluations.some(e => e.placement_id === placementId && e.evaluator_type === 'supervisor');

  const handleEvaluate = () => {
    if (!evalPlacement) return;
    const totalScore = Object.values(scores).reduce((sum, s) => sum + parseFloat(s), 0) / Object.keys(scores).length;
    setEvaluations(prev => [...prev, {
      id: Math.max(0, ...evaluations.map(e => e.id)) + 1,
      placement_id: evalPlacement,
      evaluator_type: 'supervisor',
      score: Math.round(totalScore * 100) / 100,
      comment: comment || null,
      evaluated_at: new Date().toISOString().split('T')[0],
    }]);
    setEvalPlacement(null);
    setComment('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Student Evaluations</h2>
      {myPlacements.length === 0 ? (
        <EmptyState icon={<Award size={24} />} title="No Students to Evaluate" description="Evaluations will be available once students are assigned to you." />
      ) : (
        <div className="space-y-4">
          {myPlacements.map(p => {
            const student = students.find(s => s.id === p.student_id);
            const intern = internships.find(i => i.id === p.internship_id);
            const evaluated = hasEvaluated(p.id);
            const eval_ = evaluations.find(e => e.placement_id === p.id && e.evaluator_type === 'supervisor');
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

      <Modal isOpen={!!evalPlacement} onClose={() => setEvalPlacement(null)} title="Evaluate Student">
        <form onSubmit={e => { e.preventDefault(); handleEvaluate(); }} className="space-y-4">
          {Object.entries(scores).map(([key, val]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <span className="text-sm font-bold text-purple-600">{val}/10</span>
              </div>
              <input type="range" min="1" max="10" step="0.5" value={val} onChange={e => setScores(prev => ({ ...prev, [key]: e.target.value }))} className="w-full accent-purple-600" />
            </div>
          ))}
          <FormTextarea label="Comments" value={comment} onChange={setComment} placeholder="Overall assessment of the student..." rows={3} />
          <button type="submit" className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors">Submit Evaluation</button>
        </form>
      </Modal>
    </div>
  );
};

// ============================================================
// NOTIFICATIONS
// ============================================================
const SupervisorNotifications: React.FC = () => {
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
            <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))} className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${n.read ? 'bg-white border border-gray-100' : 'bg-purple-50 border border-purple-100'}`}>
              <Bell size={16} className={n.read ? 'text-gray-400' : 'text-purple-500'} />
              <div className="flex-1">
                <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.created_at}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN SUPERVISOR ROUTER
// ============================================================
const SupervisorPages: React.FC = () => {
  return (
    <DashboardLayout title="Supervisor Portal" navItems={navItems}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<AssignedStudents />} />
        <Route path="reports" element={<ReviewReports />} />
        <Route path="evaluations" element={<SupervisorEvaluations />} />
        <Route path="notifications" element={<SupervisorNotifications />} />
      </Routes>
    </DashboardLayout>
  );
};

export default SupervisorPages;
