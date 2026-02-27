import { Card } from '../components/ui/Card';
import { Award, Users, Heart, ShieldCheck, Activity, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';

export function AboutUs() {
  const stats = [
    { label: 'Years of Excellence', value: '25+', icon: Award },
    { label: 'Expert Doctors', value: '500+', icon: Stethoscope },
    { label: 'Happy Patients', value: '50k+', icon: Users },
    { label: 'Success Rate', value: '98%', icon: Activity },
  ];

  return (
    <div className="space-y-16 py-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">Our Mission is to Provide World-Class Healthcare</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400">MedSync has been at the forefront of medical innovation for over two decades, combining expert care with cutting-edge technology.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="text-center p-8 hover:border-primary/50 transition-all">
              <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                <stat.icon size={28} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{stat.value}</h3>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Why Choose MedSync?</h2>
          <div className="space-y-6">
            {[
              { title: 'Patient-Centered Care', desc: 'We put our patients at the heart of everything we do, ensuring personalized treatment plans.', icon: Heart },
              { title: 'Advanced Technology', desc: 'Our facilities are equipped with the latest diagnostic and surgical equipment.', icon: Activity },
              { title: 'Trusted Specialists', desc: 'Our team consists of board-certified experts with years of clinical experience.', icon: ShieldCheck },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary shrink-0">
                  <item.icon size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053" 
            alt="Hospital Interior" 
            className="rounded-[40px] shadow-2xl"
          />
          <div className="absolute -bottom-8 -left-8 bg-primary p-8 rounded-3xl text-white shadow-2xl max-w-xs">
            <p className="text-2xl font-black italic mb-2">"Excellence in every heartbeat."</p>
            <p className="text-sm font-bold opacity-80">— Dr. Michael Chen, Chief of Staff</p>
          </div>
        </div>
      </div>
    </div>
  );
}
