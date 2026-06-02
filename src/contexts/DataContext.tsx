import React, { createContext, useContext } from 'react';
import { Student, Company, Supervisor, Internship, Application, Placement, WeeklyReport, Evaluation, Notification } from '../types';
import { useSupabaseTable } from '../lib/useSupabaseTable';

interface DataContextType {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  supervisors: Supervisor[];
  setSupervisors: React.Dispatch<React.SetStateAction<Supervisor[]>>;
  internships: Internship[];
  setInternships: React.Dispatch<React.SetStateAction<Internship[]>>;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  placements: Placement[];
  setPlacements: React.Dispatch<React.SetStateAction<Placement[]>>;
  weeklyReports: WeeklyReport[];
  setWeeklyReports: React.Dispatch<React.SetStateAction<WeeklyReport[]>>;
  evaluations: Evaluation[];
  setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents, l1] = useSupabaseTable<Student>('students');
  const [companies, setCompanies, l2] = useSupabaseTable<Company>('companies');
  const [supervisors, setSupervisors, l3] = useSupabaseTable<Supervisor>('supervisors');
  const [internships, setInternships, l4] = useSupabaseTable<Internship>('internships');
  const [applications, setApplications, l5] = useSupabaseTable<Application>('applications');
  const [placements, setPlacements, l6] = useSupabaseTable<Placement>('placements');
  const [weeklyReports, setWeeklyReports, l7] = useSupabaseTable<WeeklyReport>('weekly_reports');
  const [evaluations, setEvaluations, l8] = useSupabaseTable<Evaluation>('evaluations');
  // Supabase column is `is_read`; the app uses `read` — map between them.
  const [notifications, setNotifications, l9] = useSupabaseTable<Notification>('notifications', {
    fromDb: (row): Notification => ({
      id: row.id,
      user_id: row.user_id,
      message: row.message,
      read: row.is_read ?? false,
      created_at: row.created_at,
      type: row.type,
    }),
    toDb: (n: Notification) => ({
      id: n.id,
      user_id: n.user_id,
      message: n.message,
      is_read: n.read,
      type: n.type,
      created_at: n.created_at,
    }),
  });

  const loading = l1 || l2 || l3 || l4 || l5 || l6 || l7 || l8 || l9;

  return (
    <DataContext.Provider value={{
      students, setStudents,
      companies, setCompanies,
      supervisors, setSupervisors,
      internships, setInternships,
      applications, setApplications,
      placements, setPlacements,
      weeklyReports, setWeeklyReports,
      evaluations, setEvaluations,
      notifications, setNotifications,
      loading,
    }}>
      {children}
    </DataContext.Provider>
  );
};
