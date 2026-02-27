import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  CreditCard, 
  Hospital,
  ArrowLeft,
  Stethoscope,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';

export function BookingFlow() {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('hospital');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(doctors => {
        const d = doctors.find((doc: any) => doc.id === parseInt(doctorId!));
        setDoctor(d);
      });
  }, [doctorId]);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleBook = async () => {
    setIsBooking(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: user?.id,
          doctor_id: doctor.id,
          date: selectedDate,
          time: selectedTime,
          type: 'Consultation',
          fee: 150
        }),
      });
      if (res.ok) {
        setStep(4);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  if (!doctor) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Book Appointment</h1>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={cn(
              "size-10 rounded-full flex items-center justify-center font-black text-sm transition-all",
              step >= s ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
            )}>
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
            {s < 3 && (
              <div className={cn(
                "h-1 flex-1 mx-4 rounded-full transition-all",
                step > s ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <Card title="Select Date & Time" description="Choose your preferred schedule for the consultation.">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Available Slots</label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={cn(
                          "p-3 rounded-xl text-sm font-bold border transition-all",
                          selectedTime === slot 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <Button 
                  className="w-full py-4 rounded-xl" 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(2)}
                >
                  Continue to Payment
                  <ChevronRight className="ml-2" size={18} />
                </Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card title="Payment Method" description="Choose how you would like to pay for your consultation.">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => setPaymentMethod('hospital')}
                    className={cn(
                      "p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-4",
                      paymentMethod === 'hospital' ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-800"
                    )}
                  >
                    <div className={cn("p-3 rounded-xl", paymentMethod === 'hospital' ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>
                      <Hospital size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-slate-900 dark:text-white">Pay at Hospital</p>
                      <p className="text-xs text-slate-500">Pay at the reception before your appointment.</p>
                    </div>
                    <div className={cn("size-6 rounded-full border-2 flex items-center justify-center", paymentMethod === 'hospital' ? "border-primary" : "border-slate-300")}>
                      {paymentMethod === 'hospital' && <div className="size-3 bg-primary rounded-full" />}
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('online')}
                    className={cn(
                      "p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-4",
                      paymentMethod === 'online' ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-800"
                    )}
                  >
                    <div className={cn("p-3 rounded-xl", paymentMethod === 'online' ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>
                      <CreditCard size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-slate-900 dark:text-white">Online Payment</p>
                      <p className="text-xs text-slate-500">Pay securely using Credit Card or UPI.</p>
                    </div>
                    <div className={cn("size-6 rounded-full border-2 flex items-center justify-center", paymentMethod === 'online' ? "border-primary" : "border-slate-300")}>
                      {paymentMethod === 'online' && <div className="size-3 bg-primary rounded-full" />}
                    </div>
                  </button>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 py-4 rounded-xl" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-2 py-4 rounded-xl" onClick={() => setStep(3)}>Review Booking</Button>
                </div>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card title="Review & Confirm" description="Please verify your booking details before confirming.">
              <div className="space-y-8">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <img src={doctor.avatar} className="size-16 rounded-xl object-cover" />
                      <div>
                        <p className="font-black text-slate-900 dark:text-white">{doctor.name}</p>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest">{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultation Fee</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">$150.00</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon size={16} className="text-primary" /> {selectedDate}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock size={16} className="text-primary" /> {selectedTime}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</p>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase">
                        <CreditCard size={16} className="text-primary" /> {paymentMethod}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                      <p className="font-bold text-slate-900 dark:text-white">{user?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 py-4 rounded-xl" onClick={() => setStep(2)}>Back</Button>
                  <Button className="flex-2 py-4 rounded-xl" isLoading={isBooking} onClick={handleBook}>Confirm Booking</Button>
                </div>
              </div>
            </Card>
          )}

          {step === 4 && (
            <div className="text-center space-y-8 py-12">
              <div className="inline-flex items-center justify-center size-24 bg-green-100 text-green-600 rounded-full animate-bounce">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">Booking Confirmed!</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg">Your appointment with {doctor.name} has been successfully scheduled.</p>
              </div>
              <div className="max-w-sm mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Booking ID</span>
                  <span className="font-bold text-slate-900 dark:text-white">#MS-99281</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Date & Time</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedDate} at {selectedTime}</span>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
                <Button onClick={() => window.print()}>Download Receipt</Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-0 overflow-hidden">
            <img src={doctor.avatar} className="w-full h-48 object-cover" />
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{doctor.name}</h3>
                <p className="text-primary text-xs font-bold uppercase tracking-widest">{doctor.specialization}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={16} className="fill-current" />
                  <span className="font-bold text-slate-900 dark:text-white">{doctor.rating}</span>
                </div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{doctor.reviews_count} Reviews</span>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Clock size={16} className="text-primary" />
                  <span>{doctor.experience} Years Experience</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Stethoscope size={16} className="text-primary" />
                  <span>English, Spanish, French</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Booking Summary" className="bg-primary text-white border-none shadow-xl shadow-primary/20">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Consultation Fee</span>
                <span className="font-bold">$150.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Service Tax (5%)</span>
                <span className="font-bold">$7.50</span>
              </div>
              <div className="pt-4 border-t border-white/20 flex justify-between">
                <span className="font-black text-lg">Total Amount</span>
                <span className="font-black text-lg">$157.50</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
