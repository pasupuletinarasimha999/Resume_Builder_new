'use client';

import { useResume } from '@/context/ResumeContext';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import ResumePreview from './ResumePreview';

export default function ResumeBuilder() {
  const { state, dispatch } = useResume();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${state.sidebarCollapsed ? 'w-0' : 'w-80'} transition-all duration-300 overflow-hidden hidden lg:block`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          <div className={`${state.sidebarCollapsed ? 'flex-1' : 'flex-1'} transition-all duration-300 min-h-0`}>
            <MainContent />
          </div>

          {/* Resume Preview */}
          <div className="w-full lg:w-96 bg-gray-100 dark:bg-gray-800 min-h-0">
            <ResumePreview />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed bottom-4 left-4 z-50">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          ☰
        </button>
      </div>
    </div>
  );
}
