import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export function Contact() {
  return (
    <div className="space-y-16 py-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">Get in Touch</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400">Have questions? We're here to help. Contact our support team or visit us at our main campus.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Send us a Message</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Message</label>
                <textarea rows={6} placeholder="Your message here..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary transition-all resize-none"></textarea>
              </div>
              <div className="md:col-span-2">
                <Button size="lg" className="w-full md:w-auto px-12 py-6 rounded-2xl shadow-xl shadow-primary/20">
                  <Send className="mr-2" size={18} />
                  Send Message
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8 space-y-8 bg-primary text-white border-none shadow-2xl shadow-primary/20">
            <h3 className="text-xl font-black">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Emergency Hotline</p>
                  <p className="font-bold">+1 (555) 911-0000</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Email Support</p>
                  <p className="font-bold">support@medsync.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Main Campus</p>
                  <p className="font-bold">123 Health Ave, Medical City</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Clock size={24} />
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Working Hours</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Mon - Fri</span>
                <span className="text-slate-900 dark:text-white font-black">8:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Saturday</span>
                <span className="text-slate-900 dark:text-white font-black">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Sunday</span>
                <span className="text-red-500 font-black">Closed</span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Emergency services are available 24/7 at our main campus.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
