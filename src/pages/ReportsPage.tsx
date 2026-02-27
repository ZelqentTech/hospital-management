import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, Download, Search, Filter, Calendar } from 'lucide-react';

const reports = [
  { id: 'REP-001', name: 'Blood Test Results', date: '2026-02-15', doctor: 'Dr. Sarah Jenkins', type: 'Laboratory' },
  { id: 'REP-002', name: 'X-Ray Chest PA View', date: '2026-01-20', doctor: 'Dr. Michael Chen', type: 'Radiology' },
  { id: 'REP-003', name: 'Cardiology Consultation', date: '2026-01-15', doctor: 'Dr. Sarah Jenkins', type: 'Consultation' },
  { id: 'REP-004', name: 'Annual Physical Exam', date: '2025-12-10', doctor: 'Dr. Elena Rodriguez', type: 'General' },
];

export function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Medical Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Access and download your medical history and test results.</p>
        </div>
        <Button>
          <Download className="mr-2" size={18} />
          Download All
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reports by name or doctor..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2" size={18} />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Report ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Report Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Doctor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
              {reports.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.doctor.toLowerCase().includes(searchTerm.toLowerCase())).map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-slate-400">{report.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      {report.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {report.doctor}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
