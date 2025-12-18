
import React, { useState, useEffect } from 'react';
import { AppView, AppData, ClassDetails, AttendanceRecord, Holiday, AppTheme } from './types';
import Dashboard from './components/Dashboard';
import ClassManager from './components/ClassManager';
import AttendanceLog from './components/AttendanceLog';
import HolidayManager from './components/HolidayManager';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import ThanksDev from './components/ThanksDev';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [viewHistory, setViewHistory] = useState<AppView[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('attendify_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        classes: parsed.classes || [], 
        attendance: parsed.attendance || [], 
        holidays: parsed.holidays || [],
        dailyBiometrics: parsed.dailyBiometrics || [],
        theme: parsed.theme || 'cosmic'
      };
    }
    return { classes: [], attendance: [], holidays: [], dailyBiometrics: [], theme: 'cosmic' };
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', data.theme || 'cosmic');
    localStorage.setItem('attendify_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigateTo = (view: AppView) => {
    if (view === currentView) return;
    setViewHistory(prev => [...prev, currentView]);
    setCurrentView(view);
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory(prevHistory => prevHistory.slice(0, -1));
      setCurrentView(prev);
    } else {
      setCurrentView(AppView.DASHBOARD);
    }
  };

  const updateClasses = (classes: ClassDetails[]) => setData(prev => ({ ...prev, classes }));
  const updateAttendance = (attendance: AttendanceRecord[]) => setData(prev => ({ ...prev, attendance }));
  const updateHolidays = (holidays: Holiday[]) => setData(prev => ({ ...prev, holidays }));
  const setTheme = (theme: AppTheme) => setData(prev => ({ ...prev, theme }));

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const navItems = [
    { id: AppView.DASHBOARD, icon: 'fa-house', label: 'Home' },
    { id: AppView.ATTENDANCE_LOG, icon: 'fa-calendar-check', label: 'Logs' },
    { id: AppView.CLASSES, icon: 'fa-book', label: 'Subjects' },
    { id: AppView.ANALYTICS, icon: 'fa-chart-pie', label: 'Stats' },
    { id: AppView.SETTINGS, icon: 'fa-sliders', label: 'More' }
  ];

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard data={data} onNavigate={navigateTo} />;
      case AppView.CLASSES: return <ClassManager classes={data.classes} onUpdate={updateClasses} onBack={goBack} />;
      case AppView.ATTENDANCE_LOG: return <AttendanceLog data={data} onUpdate={updateAttendance} onBack={goBack} />;
      case AppView.HOLIDAYS: return <HolidayManager holidays={data.holidays} onUpdate={updateHolidays} onBack={goBack} />;
      case AppView.ANALYTICS: return <Analytics data={data} onBack={goBack} />;
      case AppView.SETTINGS: return <Settings data={data} onUpdateAll={setData} setTheme={setTheme} onBack={goBack} />;
      case AppView.THANKS: return <ThanksDev onBack={goBack} />;
      default: return <Dashboard data={data} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto min-h-screen flex flex-col relative pb-36">
      {/* Header Area */}
      <header className="px-6 py-6 flex items-center justify-between z-50 sticky top-0 bg-transparent">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-orange-400 shadow-lg shadow-orange-500/20">
              <i className="fa-solid fa-graduation-cap text-white text-sm"></i>
            </div>
            <h1 className="text-lg font-bold tracking-widest uppercase text-white/90">Attendify</h1>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-black/30 border border-white/10 text-[11px] font-bold text-white/60">
          {formatTime(currentTime)}
        </div>
      </header>

      <main className="flex-1 px-6">
        <div key={currentView} className="view-transition">
          {renderView()}
        </div>
      </main>

      {/* Navigation - Premium Pill */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm nav-pill p-3 rounded-full flex items-center justify-between z-[1000]">
        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex items-center justify-center transition-all duration-300 rounded-full h-11 ${
                isActive ? 'btn-accent px-5 shadow-xl shadow-pink-500/30' : 'w-11 text-white/20 hover:text-white/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <i className={`fa-solid ${item.icon} ${isActive ? 'text-sm' : 'text-xl'}`}></i>
                {isActive && (
                  <span className="text-sm font-bold whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default App;
