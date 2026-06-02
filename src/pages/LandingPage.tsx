import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Building2, BookOpen, BarChart3, CheckCircle2, Briefcase, GraduationCap, Shield, Star, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/25">IF</div>
            <span className="text-xl font-bold text-gray-900">InternFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">About</a>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => navigate('/login')} className="px-3 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
              Log In
            </button>
            <button onClick={() => navigate('/register')} className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25 transition-all whitespace-nowrap">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8">
              <Star size={14} className="fill-blue-500" />
              Built for Cameroonian universities &amp; institutions
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              Streamline Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Internship</span>
              <br />Management
            </h1>
            <p className="mt-6 text-base sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed px-2">
              Connect students across Cameroon with companies, monitor placements in real-time, and evaluate performance — all in one powerful platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2">
                Get Started
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/login')} className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                Sign In to Dashboard
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What is InternFlow?</h2>
            <p className="mt-4 text-lg text-gray-500">A comprehensive digital platform that bridges the gap between academic institutions, students, and industry partners for seamless internship management.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <GraduationCap size={28} />, title: 'For Students', desc: 'Browse opportunities, apply with one click, submit weekly progress reports, and receive real-time feedback from supervisors.' },
              { icon: <Building2 size={28} />, title: 'For Companies', desc: 'Post internship opportunities, review qualified applicants, manage interns, and provide structured performance evaluations.' },
              { icon: <Shield size={28} />, title: 'For Schools', desc: 'Oversee all placements, assign supervisors, monitor student progress, generate reports, and ensure quality outcomes.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-5">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Powerful Features</h2>
            <p className="mt-4 text-lg text-gray-500">Everything you need to manage internships effectively, from placement to evaluation.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Users size={22} />, title: 'Role-Based Access', desc: 'Distinct dashboards and permissions for admins, students, companies, and supervisors.', color: 'bg-blue-500' },
              { icon: <Briefcase size={22} />, title: 'Internship Posting', desc: 'Companies post opportunities with detailed requirements, duration, and application deadlines.', color: 'bg-green-500' },
              { icon: <CheckCircle2 size={22} />, title: 'Application Management', desc: 'Streamlined application workflow with status tracking from submission to acceptance.', color: 'bg-purple-500' },
              { icon: <BookOpen size={22} />, title: 'Weekly Reports', desc: 'Students submit structured weekly logbooks that supervisors review and provide feedback on.', color: 'bg-orange-500' },
              { icon: <BarChart3 size={22} />, title: 'Performance Evaluation', desc: 'Comprehensive scoring system for both company and supervisor assessments.', color: 'bg-red-500' },
              { icon: <Shield size={22} />, title: 'Admin Control Panel', desc: 'Full oversight with analytics, company approvals, supervisor assignments, and placement management.', color: 'bg-indigo-500' },
            ].map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="mt-4 text-lg text-slate-400">A simple, structured flow from registration to internship completion.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Register & Setup', desc: 'Students, companies, and supervisors create accounts and complete their profiles.' },
              { step: '02', title: 'Apply & Match', desc: 'Students browse available internships and apply. Companies review and accept candidates.' },
              { step: '03', title: 'Monitor & Report', desc: 'During the internship, students submit weekly reports that supervisors review and provide feedback.' },
              { step: '04', title: 'Evaluate & Complete', desc: 'At the end, both companies and supervisors submit evaluations. The system calculates final grades.' },
            ].map((s, i) => (
              <div key={i} className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:bg-slate-700/50 transition-colors">
                <span className="text-5xl font-black text-blue-500/20 absolute top-4 right-4">{s.step}</span>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4">{s.step}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Get in Touch</h2>
              <p className="mt-4 text-lg text-gray-500">Have questions about InternFlow? We'd love to hear from you. Reach out to our team.</p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Mail size={20} /></div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium">support@internflow.cm</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600"><Phone size={20} /></div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-medium">+237 6 77 00 00 00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600"><MapPin size={20} /></div>
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="font-medium">Molyko, Buea, South-West Region, Cameroon</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Ngwa" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Fointama" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="you@example.cm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" placeholder="Tell us how we can help..." />
                </div>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25 transition-all">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">IF</div>
            <span className="text-lg font-bold text-white">InternFlow</span>
          </div>
          <p className="text-sm">© 2025 InternFlow. Streamlining internship management for educational institutions.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
