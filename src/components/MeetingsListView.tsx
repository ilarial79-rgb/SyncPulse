import React, { useState, useMemo } from 'react';
import { Meeting } from '../types/meeting';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  Plus, 
  CheckSquare, 
  ChevronRight, 
  Trash2,
  Building2,
  Sparkles
} from 'lucide-react';
import { getSentimentBadge, getAvatarColor, getInitials } from '../utils/uiHelpers';

interface MeetingsListViewProps {
  meetings: Meeting[];
  onSelectMeeting: (meetingId: string) => void;
  onOpenNewTranscript: () => void;
  onDeleteMeeting: (meetingId: string) => void;
}

export const MeetingsListView: React.FC<MeetingsListViewProps> = ({
  meetings,
  onSelectMeeting,
  onOpenNewTranscript,
  onDeleteMeeting
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const departments = useMemo(() => {
    const set = new Set<string>();
    meetings.forEach(m => {
      if (m.department) set.add(m.department);
    });
    return Array.from(set);
  }, [meetings]);

  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      if (departmentFilter !== 'all' && m.department !== departmentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchTldr = m.summary?.tldr?.toLowerCase().includes(q) || false;
        const matchAttendees = m.attendees?.some(a => a.toLowerCase().includes(q)) || false;
        if (!matchTitle && !matchTldr && !matchAttendees) return false;
      }
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [meetings, departmentFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Analyzed Meetings Library</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse and inspect intelligence summaries, action plans, and transcripts across all teams.
          </p>
        </div>

        <button
          onClick={onOpenNewTranscript}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Meeting Transcript</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meetings by title, attendees, or topics..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            Dept:
          </span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Departments ({meetings.length})</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMeetings.map((meeting) => {
          const sentiment = getSentimentBadge(meeting.summary.sentiment);
          const totalTasks = meeting.actionPlan?.length || 0;
          const completedTasks = meeting.actionPlan?.filter(a => a.status === 'completed').length || 0;

          return (
            <div
              key={meeting.id}
              className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 shadow-sm transition duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Meta pills */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-indigo-400 bg-indigo-950/40 px-2.5 py-0.5 rounded-lg border border-indigo-800/40">
                      {meeting.date}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {meeting.duration}
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${sentiment.bg}`}>
                    <span>{sentiment.icon}</span>
                    <span>{sentiment.label}</span>
                  </span>
                </div>

                {/* Title */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {meeting.department}
                  </span>
                  <h3 
                    onClick={() => onSelectMeeting(meeting.id)}
                    className="text-base font-bold text-white group-hover:text-indigo-200 transition cursor-pointer"
                  >
                    {meeting.title}
                  </h3>
                </div>

                {/* TLDR */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {meeting.summary.tldr}
                </p>

                {/* Topics preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {meeting.topics?.slice(0, 3).map((t, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800/80"
                    >
                      {t.name}
                    </span>
                  ))}
                  {(meeting.topics?.length || 0) > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                      +{meeting.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom strip: Attendees, Task stats, and Open CTA */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatars */}
                  <div className="flex items-center -space-x-1.5">
                    {meeting.attendees?.slice(0, 4).map((p, idx) => (
                      <div
                        key={idx}
                        title={p}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-slate-900 ${getAvatarColor(p)}`}
                      >
                        {getInitials(p)}
                      </div>
                    ))}
                    {(meeting.attendees?.length || 0) > 4 && (
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-[9px] flex items-center justify-center ring-2 ring-slate-900">
                        +{meeting.attendees.length - 4}
                      </div>
                    )}
                  </div>

                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                    {completedTasks}/{totalTasks} tasks
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${meeting.title}" from the workspace?`)) {
                        onDeleteMeeting(meeting.id);
                      }
                    }}
                    title="Delete meeting"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectMeeting(meeting.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition"
                  >
                    <span>View Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
