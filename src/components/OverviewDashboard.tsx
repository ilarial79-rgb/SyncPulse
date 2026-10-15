import React from 'react';
import { 
  Meeting, 
  CrossMeetingTrends, 
  DashboardView, 
  ActionStatus 
} from '../types/meeting';
import { 
  Sparkles, 
  TrendingUp, 
  CheckSquare, 
  FileText, 
  Users, 
  Calendar, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { getSentimentBadge, getPriorityBadge, getTrendBadge, getAvatarColor, getInitials } from '../utils/uiHelpers';
import confetti from 'canvas-confetti';

interface OverviewDashboardProps {
  meetings: Meeting[];
  trends: CrossMeetingTrends;
  onViewChange: (view: DashboardView) => void;
  onSelectMeeting: (meetingId: string) => void;
  onOpenNewTranscript: () => void;
  onUpdateActionStatus: (actionId: string, newStatus: ActionStatus) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  meetings,
  trends,
  onViewChange,
  onSelectMeeting,
  onOpenNewTranscript,
  onUpdateActionStatus
}) => {
  const allActions = meetings.flatMap(m => m.actionPlan || []);
  const totalTasks = allActions.length;
  const completedTasks = allActions.filter(a => a.status === 'completed').length;
  const urgentTasks = allActions.filter(a => a.priority === 'urgent' && a.status !== 'completed');
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Unique attendees
  const uniqueMembers = Array.from(new Set(meetings.flatMap(m => m.attendees || [])));

  const handleToggleTask = (actionId: string, currentStatus: ActionStatus) => {
    const next = currentStatus === 'completed' ? 'todo' : 'completed';
    if (next === 'completed') {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    }
    onUpdateActionStatus(actionId, next);
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Intelligence Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>AI-Powered Executive Synthesis Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Meeting Intelligence & Action Matrix
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transform unstructured meeting recordings and transcripts into crisp executive summaries, clear role-and-responsibility action plans, and dynamic cross-meeting trend analyses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onViewChange('trends')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
            >
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Explore Trend Visualizer</span>
            </button>

            <button
              onClick={onOpenNewTranscript}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze New Transcript</span>
            </button>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-12 -top-12 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onViewChange('meetings')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Meetings Analyzed</span>
            <FileText className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{meetings.length}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-indigo-300 transition">
            <span>Browse library</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div 
          onClick={() => onViewChange('action_plan')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Action Deliverables</span>
            <CheckSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {completedTasks} <span className="text-sm font-normal text-slate-500">/ {totalTasks}</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        <div 
          onClick={() => onViewChange('trends')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Common Topics Tracked</span>
            <TrendingUp className="w-4 h-4 text-sky-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{trends.commonTopics.length}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-sky-300 transition">
            <span>Dynamic trend charts</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div 
          onClick={() => onViewChange('team_matrix')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Team Members</span>
            <Users className="w-4 h-4 text-violet-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{uniqueMembers.length}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-violet-300 transition">
            <span>Roles & responsibility matrix</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Grid: Common Topics Spotlight + Urgent Attention Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Cross-Meeting Topics Spotlight */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">Common Themes & Trend Velocity</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Key subjects intersecting across multiple meetings and their organizational trajectory
              </p>
            </div>
            <button
              onClick={() => onViewChange('trends')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View Full Visualizer</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {trends.commonTopics.slice(0, 4).map((topicItem) => {
              const trendBadge = getTrendBadge(topicItem.trend);

              return (
                <div
                  key={topicItem.topic}
                  onClick={() => onViewChange('trends')}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-200 transition">
                          {topicItem.topic}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {topicItem.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {topicItem.summaryInsight}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0 space-y-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${trendBadge.bg} ${trendBadge.text}`}>
                        <span>{trendBadge.icon}</span>
                        <span>{trendBadge.label}</span>
                      </span>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {topicItem.totalMentions} mtgs • <span className="text-white font-bold">{topicItem.averageIntensity}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (5 cols): Urgent Deliverables */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Critical & Urgent Actions</h3>
                <p className="text-xs text-slate-400">Items requiring immediate milestone attention</p>
              </div>
            </div>
            <button
              onClick={() => onViewChange('action_plan')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              All ({allActions.length})
            </button>
          </div>

          <div className="space-y-3">
            {urgentTasks.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                🎉 No urgent items pending! All critical gates are on track.
              </div>
            ) : (
              urgentTasks.slice(0, 4).map(action => (
                <div
                  key={action.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-rose-900/30 space-y-2 hover:border-rose-500/40 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => handleToggleTask(action.id, action.status)}
                        className="mt-0.5 w-4 h-4 rounded flex items-center justify-center border border-slate-700 hover:border-emerald-400 text-transparent hover:text-emerald-400 transition"
                        title="Mark complete"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </button>
                      <span className="text-xs font-semibold text-slate-100">
                        {action.task}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 font-mono">
                      {action.timeline}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${getAvatarColor(action.assignee)}`}>
                        {getInitials(action.assignee)}
                      </div>
                      <span className="text-slate-300 font-medium">{action.assignee}</span>
                    </div>
                    <span className="text-[10px] text-indigo-300 font-mono">{action.role}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Meetings Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Chronological Meeting Stream</h3>
            <p className="text-xs text-slate-400">Recent intelligence extractions across departments</p>
          </div>
          <button
            onClick={() => onViewChange('meetings')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Meetings ({meetings.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {meetings.slice(0, 3).map(m => {
            const sentiment = getSentimentBadge(m.summary.sentiment);

            return (
              <div
                key={m.id}
                onClick={() => onSelectMeeting(m.id)}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-indigo-400">{m.date}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] border ${sentiment.bg}`}>
                      <span>{sentiment.icon}</span>
                      <span>{sentiment.label}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-100 group-hover:text-indigo-200 transition">
                    {m.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {m.summary.tldr}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">{m.actionPlan?.length || 0} action items</span>
                  <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
