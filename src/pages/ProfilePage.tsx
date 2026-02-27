import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Mail, Phone, MapPin, Shield, Camera, Bell, Lock, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });

  const tabs = [
    { id: 'general', label: 'General Info', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?.id,
          ...formData
        })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        updateUser(updatedUser);
        showToast('Profile updated successfully', 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Manage your personal information and security preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <Card>
              <div className="flex flex-col items-center md:items-start md:flex-row gap-6 mb-8">
                <div className="relative group">
                  <img 
                    src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=random`} 
                    alt={formData.name}
                    className="size-24 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                  />
                  <button className="absolute -bottom-2 -right-2 size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="text-center md:text-left space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{formData.name}</h2>
                  <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">{user?.role} Account</p>
                  <p className="text-slate-400 text-sm">Member since January 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="City, Country"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avatar URL</label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 animate-spin" size={16} />}
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card title="Security Settings">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="flex gap-4">
                    <div className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Change Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <input type="password" placeholder="Current Password" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none" />
                    <input type="password" placeholder="New Password" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none" />
                    <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
