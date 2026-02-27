import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { 
  Calendar as CalendarIcon, 
  BookOpen, 
  History, 
  Stethoscope, 
  Download, 
  PlusCircle,
  MoreVertical,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export function PatientDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/appointments?userId=${user?.id}&role=patient`)
      .then(res => res.json())
      .then(data => setAppointments(data));
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    socket.on('appointment_updated', (updatedAppt: any) => {
      setAppointments(prev => prev.map(appt => 
        appt.id === updatedAppt.id ? { ...appt, status: updatedAppt.status } : appt
      ));
    });

    return () => {
      socket.off('appointment_updated');
    };
  }, [socket]);

  const stats = [
    { label: 'Upcoming Appointment', value: 'Oct 24, 10:00 AM', sub: 'Dr. Sarah Miller', icon: CalendarIcon, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Bookings', value: '12', sub: 'Past & Scheduled', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Last Visit', value: 'Oct 12, 2023', sub: 'Dermatology Clinic', icon: History, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Welcome back, {user?.name.split(' ')[0]}</h1>
        <p className="text-slate-500 dark:text-slate-400">Here is a quick overview of your health activities and appointments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
              <p className={cn("text-sm font-medium mt-2 flex items-center gap-1", stat.color)}>
                {stat.sub}
              </p>
            </div>
            <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
          </Card>
        ))}
      </div>

      <Card 
        title="Recent Bookings" 
        headerAction={<Button variant="ghost" size="sm">View All</Button>}
        className="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Doctor Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Stethoscope size={14} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{appt.doctor_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{appt.department}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{appt.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{appt.time}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      appt.status === 'confirmed' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      appt.status === 'pending' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary p-8 rounded-2xl text-white relative overflow-hidden group shadow-xl shadow-primary/20">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">Need a new appointment?</h2>
            <p className="text-white/80 mb-6 max-w-xs font-medium">Book a consultation with our world-class specialists in just a few clicks.</p>
            <Link to="/doctors">
              <Button variant="secondary" className="bg-white text-primary hover:bg-slate-100">
                <PlusCircle className="mr-2" size={18} />
                Book Appointment
              </Button>
            </Link>
          </div>
          <CalendarIcon className="absolute -bottom-10 -right-10 size-64 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden group shadow-xl shadow-slate-900/20">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">Medical Reports Ready</h2>
            <p className="text-white/80 mb-6 max-w-xs font-medium">Your latest blood test results have been uploaded by Dr. Miller.</p>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="mr-2" size={18} />
              Download Reports
            </Button>
          </div>
          <History className="absolute -bottom-10 -right-10 size-64 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
}


