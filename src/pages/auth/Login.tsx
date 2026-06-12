import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../hooks/store';
import { setCredentials } from '../../store/authSlice';
import { apiClient } from '../../services/apiClient';
import type { User } from '../../types/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Fingerprint, HeadphonesIcon, ShieldCheck } from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';
import TopNav from '../../components/TopNav';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handlePasskeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { options, userId } = await apiClient<{ success: boolean; options: any; userId: string }>('/auth/login/generate-options', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      let asseResp;
      try {
        asseResp = await startAuthentication({ optionsJSON: options });
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
            throw new Error("Authentication was cancelled or timed out.");
        }
        throw new Error(err.message || 'Passkey authentication failed');
      }

      const verifyRes = await apiClient<{ success: boolean; user: User }>('/auth/login/verify', {
        method: 'POST',
        body: JSON.stringify({ userId, body: asseResp }),
      });

      dispatch(setCredentials({ user: verifyRes.user }));
      
      if (verifyRes.user.role === 'doctor') {
        navigate('/doctor/dashboard', { replace: true });
      } else if (verifyRes.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/patient/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
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
                <Fingerprint size={32} className="md:w-12 md:h-12" strokeWidth={1.5} />
                <h2 className="md:mt-4 font-bold text-base md:text-lg">Patient Login</h2>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-primary-700 leading-tight mb-4 md:mb-6">
                Access Your<br className="hidden md:block" /> Health Profile
              </h1>
              
              <div className="w-12 h-0.5 bg-primary-600 mb-4 md:mb-6"></div>
              
              <p className="text-sm md:text-base text-surface-700 font-medium">
                Log in seamlessly with your registered biometric passkey.
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
          <div className="md:w-2/3 p-6 md:p-10 lg:p-14 flex flex-col justify-center">
            <div className="flex items-center gap-3 border-b border-surface-200 pb-4 mb-6 md:mb-8">
              <div className="text-primary-600 bg-primary-50 p-2 rounded-lg">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-surface-900">Secure Authentication</h2>
                <p className="text-sm text-surface-500">Sign in securely with your Passkey</p>
              </div>
            </div>

            <form onSubmit={handlePasskeyLogin} className="space-y-6 max-w-lg">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 font-medium">
                  {error}
                </div>
              )}
              
              <Input
                label="Registered Email or Mobile"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@sarjan.com"
                required
              />

              <div className="pt-6 md:pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-surface-100 mt-8 gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 shrink-0">
                    <Fingerprint size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">Biometric Verified</p>
                    <p className="text-xs text-surface-500 mt-0.5">Device verification required</p>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto px-10 bg-primary-700 hover:bg-primary-800" isLoading={isLoading}>
                  Authenticate
                </Button>
              </div>
              
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
