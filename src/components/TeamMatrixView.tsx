import React, { useState, useMemo } from 'react';
import { Meeting, ActionStatus } from '../types/meeting';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  FileSpreadsheet, 
  Download,
  ShieldCheck,
  Check
} from 'lucide-react';
import { getAvatarColor, getInitials, getPriorityBadge, getStatusBadge } from '../utils/uiHelpers';
import { exportActionPlanToCSV } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface TeamMatrixViewProps {
  meetings: Meeting[];
  onUpdateActionStatus: (actionId: string, newStatus: ActionStatus) => void;
  onSelectMeeting?: (meetingId: string) => void;
}

export const TeamMatrixView: React.FC<TeamMatrixViewProps> = ({
  meetings,
  onUpdateActionStatus,
  onSelectMeeting
}) => {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  // Collect all unique members and synthesize their role & responsibilities
  const teamMembers = useMemo(() => {
    const memberMap = new Map<string, {
      name: string;
      roles: Set<string>;
      responsibilities: Set<string>;
      deliverables: Set<string>;
      meetingIds: Set<string>;
      tasks: any[];
    }>();

    // From meetings.teamResponsibilities
    meetings.forEach(m => {
      (m.teamResponsibilities || []).forEach(tr => {
        if (!memberMap.has(tr.member)) {
          memberMap.set(tr.member, {
            name: tr.member,
            roles: new Set(),
            responsibilities: new Set(),
            deliverables: new Set(),
            meetingIds: new Set(),
            tasks: []
          });
        }
        const record = memberMap.get(tr.member)!;
        if (tr.role) record.roles.add(tr.role);
        if (tr.primaryResponsibility) record.responsibilities.add(tr.primaryResponsibility);
        (tr.deliverables || []).forEach(d => record.deliverables.add(d));
        record.meetingIds.add(m.id);
      });

      // From action plans
      (m.actionPlan || []).forEach(item => {
        if (!memberMap.has(item.assignee)) {
          memberMap.set(item.assignee, {
            name: item.assignee,
            roles: new Set(),
            responsibilities: new Set(),
            deliverables: new Set(),
            meetingIds: new Set(),
            tasks: []
          });
        }
        const record = memberMap.get(item.assignee)!;
        if (item.role) record.roles.add(item.role);
        if (item.responsibilities) record.responsibilities.add(item.responsibilities);
        if (item.deliverable) record.deliverables.add(item.deliverable);
        record.meetingIds.add(m.id);
        record.tasks.push(item);
      });
    });

    return Array.from(memberMap.values()).map(m => {
      const total = m.tasks.length;
      const completed = m.tasks.filter(t => t.status === 'completed').length;
      const urgent = m.tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 100;

      return {
        name: m.name,
        primaryRole: Array.from(m.roles)[0] || 'Team Contributor',
        allRoles: Array.from(m.roles),
        responsibilities: Array.from(m.responsibilities),
        deliverables: Array.from(m.deliverables),
        meetingsCount: m.meetingIds.size,
        tasks: m.tasks,
        totalTasks: total,
        completedTasks: completed,
        urgentTasks: urgent,
        progress
      };
    }).sort((a, b) => b.totalTasks - a.totalTasks);
  }, [meetings]);

  const handleExportCSV = () => {
    const allActions = meetings.flatMap(m => m.actionPlan || []);
    exportActionPlanToCSV(allActions, 'Team_Responsibilities_Matrix');
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleToggleTask = (actionId: string, currentStatus: ActionStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    if (nextStatus === 'completed') {
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    }
    onUpdateActionStatus(actionId, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Team Roles & Responsibilities Matrix</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Clear accountability mapping for each team member, their professional domain responsibilities, deliverables, and execution progress.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Matrix (CSV)</span>
        </button>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teamMembers.map((member) => {
          const isExpanded = expandedMember === member.name;

          return (
            <div 
              key={member.name}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition"
            >
              {/* Member Profile Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-md ${getAvatarColor(member.name)}`}>
                    {getInitials(member.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{member.name}</h3>
                    <div className="text-xs font-mono text-indigo-300 font-medium">
                      {member.primaryRole}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Participated in {member.meetingsCount} meeting(s)
                    </div>
                  </div>
                </div>

                {/* Urgent indicator */}
                {member.urgentTasks > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3" />
                    {member.urgentTasks} urgent
                  </span>
                )}
              </div>

              {/* Progress & Workload Meter */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Workload Delivery Rate</span>
                  <span className="font-mono text-slate-200 font-bold">
                    {member.completedTasks} / {member.totalTasks} Completed ({member.progress}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${member.progress}%` }}
                  />
                </div>
              </div>

              {/* Scope of Responsibilities */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-indigo-400" />
                  Primary Responsibilities & Domain Focus
                </div>
                <div className="space-y-1">
                  {member.responsibilities.slice(0, 2).map((resp, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                      <span className="text-indigo-400 mt-1">•</span>
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverable Assets */}
              {member.deliverables.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Assigned Deliverables
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.deliverables.slice(0, 3).map((del, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 truncate max-w-full"
                      >
                        {del}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Expand / Collapse Action Tasks Accordion */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setExpandedMember(isExpanded ? null : member.name)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-indigo-300 transition py-1"
                >
                  <span>Assigned Action Items ({member.tasks.length})</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/60 animate-in fade-in">
                    {member.tasks.map(task => {
                      const isDone = task.status === 'completed';
                      const pBadge = getPriorityBadge(task.priority);

                      return (
                        <div 
                          key={task.id}
                          className={`p-3 rounded-xl border text-xs transition ${
                            isDone 
                              ? 'bg-slate-950/40 border-slate-800/40 text-slate-400' 
                              : 'bg-slate-950 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => handleToggleTask(task.id, task.status)}
                                className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition border ${
                                  isDone 
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                                    : 'border-slate-600 hover:border-indigo-400'
                                }`}
                              >
                                {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                              </button>
                              <span className={`font-medium ${isDone ? 'line-through text-slate-400' : ''}`}>
                                {task.task}
                              </span>
                            </div>
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}>
                              {task.priority}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pl-6 font-mono">
                            <span>Due: {task.timeline}</span>
                            <span className="text-indigo-400 truncate max-w-[140px]">{task.meetingTitle}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
