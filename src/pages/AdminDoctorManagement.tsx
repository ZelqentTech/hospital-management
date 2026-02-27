import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { 
  Search, 
  PlusCircle, 
  MoreVertical, 
  Filter, 
  Mail, 
  Phone, 
  MapPin,
  Stethoscope,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export function AdminDoctorManagement() {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('All');
  const [filterRating, setFilterRating] = useState('0');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: 'Cardiology',
    experience: ''
  });

  const fetchDoctors = () => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data));
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this doctor?')) return;
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Doctor removed successfully', 'success');
        fetchDoctors();
      } else {
        showToast('Failed to remove doctor', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
      console.error(err);
    }
  };

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      password: '', // Don't show password
      specialization: doctor.specialization,
      experience: doctor.experience.toString()
    });
    setError('');
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.email || !formData.experience) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/doctors/${editingDoctor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience)
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast('Doctor profile updated', 'success');
        setEditingDoctor(null);
        setFormData({ name: '', email: '', password: '', specialization: 'Cardiology', experience: '' });
        fetchDoctors();
      } else {
        setError(data.error || 'Failed to update doctor profile');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterSpecialization === 'All' || doctor.specialization === filterSpecialization;
    const matchesRating = doctor.rating >= parseFloat(filterRating);
    return matchesSearch && matchesFilter && matchesRating;
  });

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.experience) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience)
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast('Doctor profile created', 'success');
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', specialization: 'Cardiology', experience: '' });
        fetchDoctors();
      } else {
        setError(data.error || 'Failed to save doctor profile');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Doctor Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Manage medical staff, specializations, and availability across the hospital.</p>
        </div>
        <Button size="lg" className="rounded-xl" onClick={() => {
          setError('');
          setShowAddModal(true);
        }}>
          <PlusCircle className="mr-2" size={20} />
          Add New Doctor
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or specialization..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option>All</option>
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Pediatrics</option>
            <option>Dermatology</option>
            <option>Orthopedics</option>
          </select>
          <select 
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="0">Min Rating: Any</option>
            <option value="4">4.0+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.8">4.8+ Stars</option>
          </select>
          <Button variant="outline" size="sm">Export CSV</Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Doctor Information</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                        <img src={doctor.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white">{doctor.name}</p>
                        <p className="text-xs text-slate-500">{doctor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                      {doctor.specialization}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{doctor.experience} Years</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">Active</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        <span className="material-symbols-outlined text-sm fill-current">star</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{doctor.rating}</span>
                      <span className="text-[10px] font-bold text-slate-400">({doctor.reviews_count})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(doctor)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(doctor.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={() => showToast(`More options for ${doctor.name} coming soon`, 'info')}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                      >
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

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl p-8 space-y-8" title="Add New Doctor" description="Enter the professional details of the medical specialist.">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                <XCircle size={18} />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Dr. John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specialization</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                >
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                  <option>Dermatology</option>
                  <option>Orthopedics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience (Years)</label>
                <input 
                  type="number" 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="10" 
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="john.doe@medsync.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <input 
                  type="password" 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleSave} isLoading={isLoading}>Save Doctor Profile</Button>
            </div>
          </Card>
        </div>
      )}
      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl p-8 space-y-8" title="Edit Doctor Profile" description="Update the professional details of the medical specialist.">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                <XCircle size={18} />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Dr. John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specialization</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                >
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                  <option>Dermatology</option>
                  <option>Orthopedics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience (Years)</label>
                <input 
                  type="number" 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="10" 
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="john.doe@medsync.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setEditingDoctor(null)}>Cancel</Button>
              <Button onClick={handleUpdate} isLoading={isLoading}>Update Doctor Profile</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
