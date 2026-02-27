import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  PlusCircle,
  Download,
  FileText,
  CreditCard,
  UserPlus,
  MoreVertical,
  XCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  PieChart as PieIcon,
  BarChart as BarIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';

const bookingData = [
  { name: 'JAN', value: 40 },
  { name: 'FEB', value: 60 },
  { name: 'MAR', value: 45 },
  { name: 'APR', value: 70 },
  { name: 'MAY', value: 85 },
  { name: 'JUN', value: 65 },
];

const treatmentData = [
  { name: 'General Checkup', cases: 450, color: 'bg-primary' },
  { name: 'Cardiac Screening', cases: 280, color: 'bg-blue-500' },
  { name: 'X-Ray Diagnostics', cases: 210, color: 'bg-indigo-500' },
  { name: 'MRI Scans', cases: 150, color: 'bg-purple-500' },
  { name: 'Dermatology Consult', cases: 95, color: 'bg-pink-500' },
];

const revenueByDept = [
  { name: 'Cardiology', value: 42, color: '#137fec' },
  { name: 'Neurology', value: 25, color: '#f59e0b' },
  { name: 'Pediatrics', value: 20, color: '#8b5cf6' },
  { name: 'Others', value: 13, color: '#94a3b8' },
];

import { ConfirmationModal } from '../components/ui/ConfirmationModal';

export function AdminDashboard() {
  const { socket } = useSocket();
  const [stats, setStats] = useState<any>(null);
  const [detailedStats, setDetailedStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([
    { label: 'New Booking', sub: 'Patient: John Doe assigned to Cardiology', time: '2 mins ago', icon: PlusCircle, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Payment Received', sub: 'Invoice #IV-8820 processed for $250.00', time: '15 mins ago', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'System Alert', sub: 'Inventory low for Surgical Masks (Block B)', time: '1 hour ago', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Doctor Onboarded', sub: 'Dr. Elena Rodriguez joined the Neurology team', time: '3 hours ago', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100' },
  ]);

  const fetchStats = () => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));
    
    fetch('/api/stats/detailed')
      .then(res => res.json())
      .then(data => setDetailedStats(data));
  };

  const fetchAppointments = () => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data));
  };

  useEffect(() => {
    fetchStats();
    fetchAppointments();
  }, []);

  const handleCancel = async () => {
    if (!cancellingId) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/appointments/${cancellingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (res.ok) {
        setAppointments(prev => prev.map(appt => 
          appt.id === cancellingId ? { ...appt, status: 'cancelled' } : appt
        ));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCancelling(false);
      setCancellingId(null);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('stats_update', () => {
      fetchStats();
    });

    socket.on('new_appointment', (appt: any) => {
      setRecentActivity(prev => [
        { 
          label: 'New Booking', 
          sub: `Patient: ${appt.patient_name} assigned to ${appt.department}`, 
          time: 'Just now', 
          icon: PlusCircle, 
          color: 'text-primary', 
          bg: 'bg-primary/10' 
        },
        ...prev.slice(0, 3)
      ]);
      setAppointments(prev => [appt, ...prev]);
      fetchStats();
    });

    socket.on('appointment_updated', (appt: any) => {
      setRecentActivity(prev => [
        { 
          label: 'Appointment Updated', 
          sub: `Appointment #${appt.id} status changed to ${appt.status}`, 
          time: 'Just now', 
          icon: FileText, 
          color: 'text-blue-600', 
          bg: 'bg-blue-100' 
        },
        ...prev.slice(0, 3)
      ]);
      setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: appt.status } : a));
      fetchStats();
    });

    return () => {
      socket.off('stats_update');
      socket.off('new_appointment');
      socket.off('appointment_updated');
    };
  }, [socket]);

  const dashboardStats = [
    { label: 'Total Revenue', value: `$${stats?.revenue?.toLocaleString() || '0'}`, change: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100', trend: TrendingUp },
    { label: 'Active Doctors', value: stats?.doctors?.toString() || '0', change: '+3%', icon: Users, color: 'text-primary', bg: 'bg-primary/10', trend: TrendingUp },
    { label: 'Total Patients', value: stats?.patients?.toLocaleString() || '0', change: '+8%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', trend: TrendingUp },
  ];

  const COLORS = ['#137fec', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Admin Control Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Comprehensive performance metrics for Central Hospital Complex.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="mr-2" size={18} />
            Last 30 Days
          </Button>
          <Button>
            <Download className="mr-2" size={18} />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", stat.bg, stat.color)}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <stat.trend size={14} className={stat.color} />
              Increased since last month
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card 
          className="lg:col-span-2" 
          title="Live Appointment Management" 
          description="Real-time monitoring and control of all hospital bookings"
        >
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Patient & Doctor</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.slice(0, 5).map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{appt.patient_name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">with {appt.doctor_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{appt.date}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{appt.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit",
                        appt.status === 'confirmed' ? "bg-green-100 text-green-600" :
                        appt.status === 'pending' ? "bg-orange-100 text-orange-600" :
                        appt.status === 'cancelled' ? "bg-red-100 text-red-600" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {appt.status === 'confirmed' && <CheckCircle2 size={10} />}
                        {appt.status === 'pending' && <Clock size={10} />}
                        {appt.status === 'cancelled' && <XCircle size={10} />}
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                          <button 
                            onClick={() => setCancellingId(appt.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Recent Activity" headerAction={<Button variant="ghost" size="sm">View All</Button>}>
          <div className="space-y-6 mt-4">
            {recentActivity.map((item, i) => (
              <div key={`${item.label}-${i}`} className="flex gap-4 relative">
                {i !== recentActivity.length - 1 && <div className="absolute left-4 top-10 w-0.5 h-full bg-slate-100 dark:bg-slate-800" />}
                <div className={cn("size-8 rounded-full flex items-center justify-center z-10 shrink-0", item.bg, item.color)}>
                  <item.icon size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.sub}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Patient Demographics" description="Distribution by age and gender">
          <div className="h-[300px] w-full mt-4 flex items-center justify-center">
            {detailedStats?.demographics?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={detailedStats.demographics}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="age_group"
                  >
                    {detailedStats.demographics.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-sm italic">No demographic data available</div>
            )}
          </div>
        </Card>

        <Card title="Department Trends" description="Appointment volume by medical specialty">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detailedStats?.deptTrends || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#137fec" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Doctor Performance Metrics" description="Top performing medical specialists based on ratings and completion rates">
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4 text-center">Rating</th>
                <th className="px-6 py-4 text-center">Completed Appts</th>
                <th className="px-6 py-4 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {detailedStats?.doctorPerformance?.slice(0, 5).map((doc: any) => (
                <tr key={doc.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{doc.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{doc.specialization}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-yellow-400 font-bold">{doc.rating}</span>
                      <PieIcon size={12} className="text-yellow-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-900 dark:text-white">{doc.completed_appointments}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full ml-auto overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(doc.rating / 5) * 100}%` }} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={!!cancellingId}
        onClose={() => setCancellingId(null)}
        onConfirm={handleCancel}
        isLoading={isCancelling}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action will notify both the patient and the doctor."
        confirmText="Confirm Cancellation"
        variant="danger"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card 
          className="lg:col-span-2" 
          title="Monthly Booking Trends" 
          description="Analysis of appointment volume across departments"
          headerAction={
            <div className="flex gap-2">
              <Button size="sm">Last 6 Months</Button>
              <Button variant="outline" size="sm">Yearly</Button>
            </div>
          }
        >
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#137fec" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#137fec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#137fec" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Most Popular Treatments">
          <div className="space-y-6 mt-4">
            {treatmentData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                  <span className="font-bold text-slate-500">{item.cases} Cases</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", item.color)} 
                    style={{ width: `${(item.cases / 500) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Revenue by Department">
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByDept}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueByDept.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white">$428k</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {revenueByDept.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-500">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
