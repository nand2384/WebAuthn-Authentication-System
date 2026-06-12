import { motion } from 'framer-motion';

export default function DoctorDashboard() {

  const patients = [
    { id: 1, name: 'Marvin McKinney', uhid: 'SHC-0001062026', age: '-', gender: 'Male', phone: '9876152734', lastVisit: '6/21/19' },
    { id: 2, name: 'Jacob Jones', uhid: '5560', age: '-', gender: 'Male', phone: '9876152734', lastVisit: '9/18/16' },
    { id: 3, name: 'Brooklyn Simmons', uhid: '2798', age: '-', gender: 'Female', phone: '9876152734', lastVisit: '1/31/14' },
    { id: 4, name: 'Devon Lane', uhid: '6025', age: '-', gender: 'Male', phone: '9876152734', lastVisit: '9/4/12' },
    { id: 5, name: 'Kristin Watson', uhid: '1439', age: '-', gender: 'Female', phone: '9876152734', lastVisit: '5/7/16' },
    { id: 6, name: 'Ronald Richards', uhid: '8013', age: '-', gender: 'Male', phone: '9876152734', lastVisit: '8/15/17' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Cards (Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-700 rounded-xl p-6 shadow-sm text-white min-h-[140px] flex flex-col justify-center"
        >
          <h3 className="text-lg font-medium mb-1">Today's Appointments</h3>
          <p className="text-3xl font-bold">28</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-300 rounded-xl min-h-[140px]"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-300 rounded-xl min-h-[140px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-300 rounded-xl min-h-[140px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-surface-300 rounded-xl min-h-[120px]" />
         <div className="bg-surface-300 rounded-xl min-h-[120px]" />
      </div>

      {/* Patient List Table (Image 3) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden mt-8"
      >
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-100 border-b border-surface-200 text-surface-600 text-sm font-medium">
                <th className="px-6 py-4">Patient name</th>
                <th className="px-6 py-4">UHID</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Mobile phone</th>
                <th className="px-6 py-4">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-surface-50 transition-colors text-sm text-surface-900">
                  <td className="px-6 py-4 font-bold">{patient.name}</td>
                  <td className="px-6 py-4">{patient.uhid}</td>
                  <td className="px-6 py-4">{patient.age}</td>
                  <td className="px-6 py-4">{patient.gender}</td>
                  <td className="px-6 py-4">{patient.phone}</td>
                  <td className="px-6 py-4">{patient.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Stacked Cards */}
        <div className="md:hidden divide-y divide-surface-100">
          {patients.map((patient) => (
            <div key={patient.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-surface-900">{patient.name}</h4>
                  <p className="text-xs text-surface-500 font-medium">{patient.uhid}</p>
                </div>
                <div className="text-xs font-semibold bg-surface-100 px-2 py-1 rounded text-surface-600">
                  {patient.lastVisit}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-surface-700">
                <div className="flex flex-col">
                  <span className="text-[10px] text-surface-400 uppercase font-bold tracking-wider">Gender</span>
                  <span className="font-medium">{patient.gender}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-surface-400 uppercase font-bold tracking-wider">Mobile</span>
                  <span className="font-medium">{patient.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
