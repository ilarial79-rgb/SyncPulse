import React, { useState } from 'react';
import { Meeting, ActionStatus } from '../types/meeting';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Building2, 
  Users, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  MessageSquare, 
  Layers, 
  Check, 
  Tag
} from 'lucide-react';
import { 
  getSentimentBadge, 
  getPriorityBadge, 
  getStatusBadge, 
  getAvatarColor, 
  getInitials 
} from '../utils/uiHelpers';
import { exportMeetingToMarkdown, exportActionPlanToCSV } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface MeetingDetailViewProps {
  meeting: Meeting;
  onBack: () => void;
  onUpdateActionStatus: (actionId: string, newStatus: ActionStatus) => void;
}

type TabType = 'summary' | 'action_plan' | 'roles' | 'topics' | 'transcript';

export const MeetingDetailView: React.FC<MeetingDetailViewProps> = ({
  meeting,
  onBack,
  onUpdateActionStatus
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  const sentiment = getSentimentBadge(meeting.summary.sentiment);

  const handleExportMd = () => {
    exportMeetingToMarkdown(meeting);
    confetti({ particleCount: 25, spread: 50 });
  };

  const handleExportCSV = () => {
    exportActionPlanToCSV(meeting.actionPlan, `${meeting.title}_Action_Plan`);
    confetti({ particleCount: 25, spread: 50 });
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(meeting.transcript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handleToggleAction = (actionId: string, currentStatus: ActionStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    if (nextStatus === 'completed') {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    }
    onUpdateActionStatus(actionId, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Meeting Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Meetings</span>
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sentiment.bg}`}>
                  <span>{sentiment.icon}</span>
                  <span>{sentiment.label}</span>
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {meeting.department}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {meeting.title}
              </h1>
            </div>

            {/* Export buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportMd}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Markdown</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Actions (CSV)</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <Printer className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Print Dossier</span>
              </button>
            </div>
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="font-mono text-slate-300">{meeting.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{meeting.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Attendees:</span>
              <div className="flex items-center -space-x-1.5">
                {meeting.attendees.map((person, idx) => (
                  <div
                    key={idx}
                    title={person}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-slate-900 ${getAvatarColor(person)}`}
                  >
                    {getInitials(person)}
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-slate-500">
                ({meeting.attendees.join(', ')})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'summary'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Executive Summary
        </button>

        <button
          onClick={() => setActiveTab('action_plan')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'action_plan'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Action Plan & Timelines ({meeting.actionPlan.length})
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'roles'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Roles & Responsibilities ({meeting.teamResponsibilities.length})
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'topics'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          Topics & Nuance ({meeting.topics.length})
        </button>

        <button
          onClick={() => setActiveTab('transcript')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'transcript'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Raw Transcript
        </button>
      </div>

      {/* TAB 1: EXECUTIVE SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* TL;DR card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Executive Synopsis (TL;DR)
            </h3>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
              {meeting.summary.tldr}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Decisions */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Key Decisions Made</h3>
              </div>

              <div className="space-y-2.5">
                {meeting.summary.keyDecisions.map((decision, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed"
                  >
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 stroke-[3]" />
                    <span>{decision}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Highlights */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Critical Highlights & Benchmarks</h3>
              </div>

              <div className="space-y-2.5">
                {meeting.summary.criticalHighlights.map((highlight, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed"
                  >
                    <span className="text-indigo-400 font-bold flex-shrink-0 mt-0.5">✦</span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risks & Blockers */}
          {meeting.summary.risksAndBlockers.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Identified Risks & Operational Blockers</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meeting.summary.risksAndBlockers.map((risk, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-rose-900/40 text-xs text-slate-300 leading-relaxed"
                  >
                    ⚠️ {risk}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTION PLAN & TIMELINES */}
      {activeTab === 'action_plan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Meeting Action Plan & Deliverables</h3>
              <p className="text-xs text-slate-400">Concrete task assignments with roles, responsibilities, and timelines</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Done</th>
                  <th className="py-3 px-4">Task Deliverable</th>
                  <th className="py-3 px-4">Assignee & Role</th>
                  <th className="py-3 px-4">Role & Responsibilities</th>
                  <th className="py-3 px-4">Timeline / Deadline</th>
                  <th className="py-3 px-4">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {meeting.actionPlan.map(item => {
                  const isDone = item.status === 'completed';
                  const pBadge = getPriorityBadge(item.priority);

                  return (
                    <tr 
                      key={item.id}
                      className={`hover:bg-slate-800/30 transition ${isDone ? 'bg-slate-950/20 text-slate-400' : ''}`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleAction(item.id, item.status)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition border ${
                            isDone 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                              : 'border-slate-700 hover:border-indigo-400'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className={`font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {item.task}
                        </div>
                        {item.deliverable && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            <span className="text-indigo-400 font-semibold">Deliverable:</span> {item.deliverable}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${getAvatarColor(item.assignee)}`}>
                            {getInitials(item.assignee)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-200">{item.assignee}</div>
                            <div className="text-[10px] text-indigo-300 font-mono">{item.role}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm text-slate-300 leading-relaxed text-[11px]">
                        {item.responsibilities}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-200">{item.timeline}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Due: {item.deadlineDate}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}>
                          {pBadge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ROLES & RESPONSIBILITIES */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {meeting.teamResponsibilities.map((resp, idx) => (
            <div 
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold shadow-md ${getAvatarColor(resp.member)}`}>
                  {getInitials(resp.member)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{resp.member}</h4>
                  <p className="text-xs text-indigo-300 font-mono">{resp.role}</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Primary Domain Responsibility
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {resp.primaryResponsibility}
                </p>
              </div>

              {resp.deliverables && resp.deliverables.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Meeting Deliverables
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {resp.deliverables.map((d, dIdx) => (
                      <span 
                        key={dIdx}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-800/40"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: TOPICS */}
      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meeting.topics.map((t, idx) => (
            <div 
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {t.category}
                  </span>
                  <h4 className="font-bold text-sm text-white mt-1.5">{t.name}</h4>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                  {t.weight}/10
                </span>
              </div>

              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${(t.weight / 10) * 100}%` }}
                />
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Key Points</div>
                {t.keyPoints.map((kp, kIdx) => (
                  <div key={kIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <span className="text-indigo-400 mt-1">•</span>
                    <span>{kp}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: RAW TRANSCRIPT */}
      {activeTab === 'transcript' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white">Full Meeting Transcript</h3>
              <p className="text-xs text-slate-400">Verbatim dialogue records with speaker tags</p>
            </div>
            <button
              onClick={handleCopyTranscript}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copiedTranscript ? 'Copied to Clipboard!' : 'Copy Transcript'}
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {meeting.transcript}
          </div>
        </div>
      )}
    </div>
  );
};
