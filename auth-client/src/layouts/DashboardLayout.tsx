import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import { logout } from '../store/authSlice';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Search,
  Stethoscope,
  ClipboardList,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  const navItems = user?.role === 'doctor' ? [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
    { icon: Users, label: 'Patients', path: '/doctor/patients' },
    { icon: ClipboardList, label: 'Appointments', path: '/doctor/schedule' },
  ] : [
    { icon: LayoutDashboard, label: 'Overview', path: '/patient/dashboard' },
    { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
    { icon: ClipboardList, label: 'Medical Records', path: '/patient/records' },
  ];

  return (
    <div className="min-h-screen bg-surface-100 flex overflow-hidden">
      
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-surface-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-surface-200 flex flex-col transition-all duration-300 ease-in-out z-50 shrink-0",
          "fixed inset-y-0 left-0 md:relative md:translate-x-0",
          mobileSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:w-64",
          collapsed && !mobileSidebarOpen && "md:w-20"
        )}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-surface-100 shrink-0">
          <div className="flex items-center gap-3 text-primary-700 font-bold text-xl overflow-hidden whitespace-nowrap w-full justify-between">
            <div className="flex items-center gap-3">
              <Stethoscope size={28} className="shrink-0" />
              {(!collapsed || mobileSidebarOpen) && (
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-primary-900 leading-none tracking-tight">SARJAN</span>
                  <span className="text-[10px] uppercase font-semibold text-primary-600 tracking-widest leading-tight">HEALTHCARE</span>
                </div>
              )}
            </div>
            {mobileSidebarOpen && (
              <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden text-surface-500 hover:text-surface-900">
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative",
                isActive 
                  ? "text-primary-700" 
                  : "text-surface-500 hover:bg-surface-50 hover:text-surface-900",
                collapsed && "justify-center px-0"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={cn("shrink-0", isActive ? "text-primary-600" : "text-surface-400 group-hover:text-surface-600")} />
                  {(!collapsed || mobileSidebarOpen) && <span className="whitespace-nowrap">{item.label}</span>}
                  
                  {/* Active Indicator Line (Left) */}
                  {isActive && collapsed && !mobileSidebarOpen && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-md" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-surface-100 flex flex-col gap-2 shrink-0">
          <button className={cn(
            "flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-surface-500 hover:bg-surface-50 hover:text-surface-900 transition-all",
            collapsed && !mobileSidebarOpen && "justify-center px-0"
          )}>
            <Settings size={22} className="shrink-0 text-surface-400" />
            {(!collapsed || mobileSidebarOpen) && <span className="whitespace-nowrap">Settings</span>}
          </button>
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden md:flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-surface-500 hover:bg-surface-50 hover:text-surface-900 transition-all",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <ChevronRight size={22} className="shrink-0 text-surface-400" /> : <ChevronLeft size={22} className="shrink-0 text-surface-400" />}
            {!collapsed && <span className="whitespace-nowrap">Collapse</span>}
          </button>

          {!collapsed && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all mt-4"
            >
              <LogOut size={22} className="shrink-0" />
              <span>Log out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-surface-50 relative z-10">
        
        {/* Top Search Bar / Header */}
        <header className="h-16 md:h-20 bg-white/50 backdrop-blur-sm flex items-center px-4 md:px-8 border-b border-surface-200/50 shrink-0 gap-3 md:gap-6 w-full max-w-[100vw]">
          <button 
            className="md:hidden text-surface-600 hover:text-surface-900 p-2 -ml-2"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 md:max-w-3xl flex items-center bg-white border border-surface-200 rounded-lg overflow-hidden h-10 md:h-11 shadow-sm">
            <div className="pl-3 md:pl-4 text-surface-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search for patient" 
              className="flex-1 bg-transparent w-full min-w-0 px-2 md:px-3 py-2 text-sm outline-none text-surface-900 placeholder:text-surface-400"
            />
            <div className="border-l border-surface-200 px-2 md:px-4 bg-surface-50 hidden sm:flex items-center gap-2 h-full cursor-pointer hover:bg-surface-100 transition-colors">
              <span className="text-sm font-medium text-surface-700">Name</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-500"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative">
           <div className="max-w-7xl mx-auto h-full flex flex-col">
             <Outlet />
           </div>
        </main>

      </div>
    </div>
  );
}
