import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../hooks/store';
import { setCredentials } from '../../store/authSlice';
import { apiClient } from '../../services/apiClient';
import type { User } from '../../types/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserPlus, HeadphonesIcon, ShieldCheck } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';
import TopNav from '../../components/TopNav';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dob: '',
    gender: '',
    mobile: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsMobile(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({ ...prev, whatsapp: prev.mobile }));
    }
  };

  const handlePasskeyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { options, userId } = await apiClient<{ success: boolean; options: any; userId: string }>('/auth/register/generate-options', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email || formData.mobile + '@temp.com', // fallback if email is not in UI, but let's assume they might use mobile as identifier or we add an email field. Wait, the design doesn't have an email field! I'll use Mobile Number as the WebAuthn ID or add a hidden one for now, wait, I will just add an email field to the UI as well because passkeys need an identifier, or I'll use mobile.
          role: 'patient',
          fullName: formData.fullName,
          phone: formData.mobile
        }),
      });

      let attResp;
      try {
        attResp = await startRegistration({ optionsJSON: options });
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
            throw new Error("Registration was cancelled or timed out.");
        }
        throw new Error(err.message || 'Passkey registration failed');
      }

      const verifyRes = await apiClient<{ success: boolean; user: User }>('/auth/register/verify', {
        method: 'POST',
        body: JSON.stringify({ userId, body: attResp }),
      });

      if (verifyRes.success) {
        dispatch(setCredentials({ user: verifyRes.user }));
        navigate('/patient/dashboard', { replace: true });
      }

    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col pt-20">
      <TopNav />
      
      <main className="flex-1 flex items-center justify-center p-0 md:p-6 mt-16 md:mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl bg-white md:rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-screen md:min-h-175"
        >
          {/* Left Panel */}
          <div className="md:w-1/3 bg-primary-50 p-6 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex flex-row md:flex-col items-center gap-3 md:gap-0 md:text-center text-primary-600 mb-4 md:mb-8 mt-2 md:mt-10">
                <UserPlus size={32} className="md:w-12 md:h-12" strokeWidth={1.5} />
                <h2 className="md:mt-4 font-bold text-base md:text-lg">New Patient Registration</h2>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-primary-700 leading-tight mb-4 md:mb-6">
                Create Your<br className="hidden md:block" /> Health Profile
              </h1>
              
              <div className="w-12 h-0.5 bg-primary-600 mb-4 md:mb-6"></div>
              
              <p className="text-sm md:text-base text-surface-700 font-medium">
                Please provide your details to register and book appointments with our doctors
              </p>
            </div>

            <div className="bg-primary-100/50 rounded-xl p-4 md:p-5 border border-primary-200 mt-6 md:mt-12 flex items-start gap-4">
              <HeadphonesIcon className="text-primary-600 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-primary-900 text-sm md:text-base">Need Help?</h4>
                <p className="text-xs md:text-sm text-surface-700 mt-1">Call us at <span className="font-bold text-primary-600">+91 97277 23328</span></p>
                <p className="text-[10px] md:text-xs text-surface-500 mt-1">We are available 24/7</p>
              </div>
            </div>
          </div>

          {/* Right Panel (Form) */}
          <div className="md:w-2/3 p-6 md:p-10 lg:p-14 overflow-y-auto">
            <div className="flex items-center gap-3 border-b border-surface-200 pb-4 mb-6 md:mb-8">
              <div className="text-primary-600 bg-primary-50 p-2 rounded-lg">
                <UserPlus size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-surface-900">Personal Information</h2>
                <p className="text-sm text-surface-500">Please enter your basic details to continue.</p>
              </div>
            </div>

            <form onSubmit={handlePasskeyRegister} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name *" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required />
                <Input label="Date of Birth *" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium text-surface-700">Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2.5 bg-white border border-surface-200 rounded-lg text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow h-11">
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input label="Mobile Number *" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} placeholder="Enter your mobile number" required />
                
                <div className="relative">
                  <div className="absolute -top-6 right-0 flex items-center gap-2">
                    <input type="checkbox" id="sameAsMobile" checked={sameAsMobile} onChange={handleCheckbox} className="w-3.5 h-3.5 rounded text-primary-600 focus:ring-primary-500 border-surface-300 cursor-pointer"/>
                    <label htmlFor="sameAsMobile" className="text-[11px] text-surface-500 cursor-pointer font-medium">Same as mobile number</label>
                  </div>
                  <Input label="WhatsApp Number *" name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange} placeholder="Enter your whatsapp number" required />
                </div>
              </div>
              
              {/* Note: I added email here since passkey backend requires email to find/create user, though it's missing in Figma */}
              <Input label="Email Address *" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" required />

              <Input label="Address *" name="address" value={formData.address} onChange={handleChange} placeholder="House / Building / Street / Area" required />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="City *" name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" required />
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium text-surface-700">State *</label>
                  <select name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2.5 bg-white border border-surface-200 rounded-lg text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow h-11">
                    <option value="">Select state</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="maharashtra">Maharashtra</option>
                  </select>
                </div>
                <Input label="PIN Code *" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Enter PIN code" required />
              </div>

              <div className="pt-6 md:pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-surface-100 mt-8 gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">Your information is safe and secure with us.</p>
                    <p className="text-xs text-surface-500 mt-0.5">We do not share your details with anyone.</p>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto px-10 bg-primary-700 hover:bg-primary-800" isLoading={isLoading}>
                  Continue
                </Button>
              </div>

            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
