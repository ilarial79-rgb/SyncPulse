import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  FileText, 
  CheckSquare, 
  Users, 
  TrendingUp, 
  Plus, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { DashboardView, Meeting, CrossMeetingTrends } from '../types/meeting';
import { exportActionPlanToCSV, exportTrendsToMarkdown, exportAllDataToJSON } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface NavbarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  meetings: Meeting[];
  trends: CrossMeetingTrends;
  onOpenNewTranscript: () => void;
  onResetData: () => void;
  isSynthesizingTrends?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  meetings,
  trends,
  onOpenNewTranscript,
  onResetData,
  isSynthesizingTrends = false
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const totalActions = meetings.reduce((sum, m) => sum + (m.actionPlan?.length || 0), 0);
  const pendingActions = meetings.reduce(
    (sum, m) => sum + (m.actionPlan?.filter(a => a.status !== 'completed').length || 0),
    0
  );

  const handleExportCSV = () => {
    const allActions = meetings.flatMap(m => m.actionPlan || []);
    exportActionPlanToCSV(allActions, 'SyncPulse_All_Action_Plans');
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.2 } });
    setShowExportMenu(false);
  };

  const handleExportMarkdown = () => {
    exportTrendsToMarkdown(trends, meetings);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.2 } });
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    exportAllDataToJSON(meetings, trends);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    window.print();
    setShowExportMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onViewChange('overview')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition duration-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-200 transition">
                    SyncPulse
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                    AI Hub
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">Meeting Intel & Trend Synthesizer</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => onViewChange('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentView === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Overview
            </button>

            <button
              onClick={() => onViewChange('meetings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentView === 'meetings'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Meetings
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {meetings.length}
              </span>
            </button>

            <button
              onClick={() => onViewChange('action_plan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentView === 'action_plan'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Action Plan
              {pendingActions > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pendingActions}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('team_matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentView === 'team_matrix'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Roles & Responsibilities
            </button>

            <button
              onClick={() => onViewChange('trends')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentView === 'trends'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              Dynamic Trends
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition shadow-sm"
                title="Export Dashboard & Actions"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                      Export Intelligence
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 transition"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-medium">Action Plans (CSV)</div>
                        <div className="text-[10px] text-slate-400">Roles, timelines & responsibilities</div>
                      </div>
                    </button>

                    <button
                      onClick={handleExportMarkdown}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 transition"
                    >
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <div>
                        <div className="font-medium">Trend Dossier (Markdown)</div>
                        <div className="text-[10px] text-slate-400">Summaries & cross-meeting themes</div>
                      </div>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 transition"
                    >
                      <Printer className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="font-medium">Print / PDF Report</div>
                        <div className="text-[10px] text-slate-400">Clean executive print layout</div>
                      </div>
                    </button>

                    <button
                      onClick={handleExportJSON}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 transition"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-medium">Workspace JSON Backup</div>
                        <div className="text-[10px] text-slate-400">Complete raw dataset</div>
                      </div>
                    </button>

                    <div className="border-t border-slate-800/80 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setShowExportMenu(false);
                          if (confirm('Reset workspace to the initial 5 sample meetings and synthesized trends?')) {
                            onResetData();
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Sample Data</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* New Transcript CTA */}
            <button
              onClick={onOpenNewTranscript}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Meeting</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-slate-800/80 scrollbar-none">
          <button
            onClick={() => onViewChange('overview')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            <Layers className="w-3 h-3" />
            Overview
          </button>
          <button
            onClick={() => onViewChange('meetings')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'meetings' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            <FileText className="w-3 h-3" />
            Meetings ({meetings.length})
          </button>
          <button
            onClick={() => onViewChange('action_plan')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'action_plan' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            <CheckSquare className="w-3 h-3" />
            Action Plan ({totalActions})
          </button>
          <button
            onClick={() => onViewChange('team_matrix')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'team_matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            <Users className="w-3 h-3" />
            Roles
          </button>
          <button
            onClick={() => onViewChange('trends')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'trends' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            <TrendingUp className="w-3 h-3 text-sky-400" />
            Trends
          </button>
        </div>
      </div>
    </header>
  );
};
