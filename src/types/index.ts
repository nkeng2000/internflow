export type Role = 'admin' | 'student' | 'company' | 'supervisor';

export interface User {
  id: number;
  email: string;
  password: string;
  role: Role;
  full_name?: string | null;
  is_super?: boolean;
  created_at: string;
}

export interface Student {
  id: number;
  user_id: number;
  student_id_code: string;
  full_name: string;
  department: string;
  level: string;
  phone: string;
  cv_url: string | null;
  status: 'Unplaced' | 'Pending Validation' | 'Placed';
}

export interface Company {
  id: number;
  user_id: number;
  company_name: string;
  industry: string;
  location: string;
  contact_person: string;
  is_approved: boolean;
}

export interface Supervisor {
  id: number;
  user_id: number;
  full_name: string;
  department: string;
}

export interface Internship {
  id: number;
  company_id: number;
  title: string;
  description: string;
  requirements: string;
  duration: string;
  slots: number;
  deadline: string;
  created_at: string;
}

export interface Application {
  id: number;
  student_id: number;
  internship_id: number;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  applied_at: string;
}

export interface Placement {
  id: number;
  student_id: number;
  internship_id: number;
  supervisor_id: number | null;
  status: 'Active' | 'Completed' | 'Terminated';
  start_date: string;
  end_date: string | null;
}

export interface WeeklyReport {
  id: number;
  placement_id: number;
  week_number: number;
  tasks_completed: string;
  skills_learned: string;
  challenges: string;
  status: 'Submitted' | 'Reviewed' | 'Approved' | 'Needs Revision';
  feedback: string | null;
  submitted_at: string;
}

export interface Evaluation {
  id: number;
  placement_id: number;
  evaluator_type: 'company' | 'supervisor';
  score: number;
  comment: string | null;
  evaluated_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  read: boolean;
  created_at: string;
  type: 'info' | 'success' | 'warning';
}
