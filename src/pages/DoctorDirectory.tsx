import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Filter, Star, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export function DoctorDirectory() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data));
  }, []);

  const departments = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

  const filteredDoctors = filter === 'All' 
    ? doctors 
    : doctors.filter(d => d.specialization?.includes(filter));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Doctors Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Browse our world-class medical specialists and book your consultation.</p>
        </div>
        <Button size="lg" className="rounded-xl">
          Register New Doctor
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4 shadow-sm">
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-slate-800">
          <Filter className="text-slate-400" size={18} />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Filters:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setFilter(dept)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                filter === dept 
                  ? "bg-primary/10 text-primary" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {dept}
            </button>
          ))}
        </div>
        <div className="ml-auto text-xs font-bold text-slate-400 uppercase tracking-wider">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDoctors.map((doctor) => (
          <div 
            key={doctor.id} 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col hover:shadow-2xl hover:border-primary/30 transition-all group"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={doctor.avatar} 
                alt={doctor.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span> Available
                </span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="mb-4">
                <h3 className="text-slate-900 dark:text-white font-black text-lg">{doctor.name}</h3>
                <p className="text-primary text-xs font-bold uppercase tracking-wider">{doctor.specialization}</p>
              </div>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span className="font-medium">{doctor.experience} yrs exp</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{doctor.rating}</span>
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm">Details</Button>
                <Link to={`/book/${doctor.id}`}>
                  <Button size="sm" className="w-full">Book Now</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
