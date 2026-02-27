import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Stethoscope, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const user = await res.json();
        login(user);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-16 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20 mb-6">
            <Stethoscope size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Secure Hospital Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Access your healthcare management dashboard</p>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            {['PATIENT', 'DOCTOR', 'ADMIN'].map((role) => (
              <button
                key={role}
                className="flex-1 py-4 text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary/30"
              >
                {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Mail size={12} />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hospital.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Lock size={12} />
                  Password
                </label>
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary transition-all outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-3">
              <ShieldCheck size={18} />
              Your connection is encrypted with 256-bit AES security.
            </div>

            <Button type="submit" size="lg" className="w-full py-4 rounded-xl" isLoading={isLoading}>
              Login to Dashboard
              <ArrowRight className="ml-2" size={18} />
            </Button>

            <p className="text-center text-xs font-bold text-slate-500">
              Don't have an account? <button type="button" className="text-primary hover:underline">Contact Administrator</button>
            </p>
          </form>
        </Card>

        <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            HIPAA Compliant
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            GDPR Ready
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            ISO 27001
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircle({ size }: { size: number }) {
  return <span className="material-symbols-outlined" style={{ fontSize: size }}>error</span>;
}
