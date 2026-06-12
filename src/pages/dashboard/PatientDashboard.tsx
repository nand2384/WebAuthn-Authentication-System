import { useAppSelector } from '../../hooks/store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Calendar, FileText, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary-600 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Hello, {user?.email}</h1>
          <p className="text-primary-100 max-w-lg text-sm md:text-base">
            Welcome to your patient portal. Here you can view your upcoming appointments, medical records, and recent test results.
          </p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 hidden sm:block">
          <Activity size={240} />
        </div>
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 sm:hidden">
          <Activity size={160} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Calendar className="text-surface-400" size={20} />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-surface-50 rounded-lg border border-surface-100 flex items-start gap-4">
                  <div className="bg-primary-100 text-primary-700 rounded-lg p-2 text-center min-w-[60px]">
                    <div className="text-xs font-bold uppercase">Oct</div>
                    <div className="text-xl font-bold leading-none">24</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-surface-900">Dr. Sarah Jenkins</h4>
                    <p className="text-sm text-surface-500 flex items-center gap-1 mt-1">
                      <Clock size={14} /> 10:00 AM - General Checkup
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Schedule Appointment</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Records</CardTitle>
              <FileText className="text-surface-400" size={20} />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border-b border-surface-100 last:border-0">
                  <div>
                    <h4 className="font-medium text-sm text-surface-900">Annual Blood Work</h4>
                    <p className="text-xs text-surface-500">Oct 12, 2026</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between p-3 border-b border-surface-100 last:border-0">
                  <div>
                    <h4 className="font-medium text-sm text-surface-900">X-Ray Results</h4>
                    <p className="text-xs text-surface-500">Sep 05, 2026</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
