import React, { useState, useMemo } from 'react';
import { 
  ActionItem, 
  ActionStatus, 
  Priority, 
  Meeting 
} from '../types/meeting';
import { 
  CheckSquare,
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Plus, 
  Download, 
  Kanban, 
  Table as TableIcon, 
  Users, 
  ArrowUpDown,
  Check,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { getPriorityBadge, getStatusBadge, getAvatarColor, getInitials } from '../utils/uiHelpers';
import { exportActionPlanToCSV } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface ActionPlanDashboardProps {
  meetings: Meeting[];
  onUpdateActionStatus: (actionId: string, newStatus: ActionStatus) => void;
  onAddCustomAction: (action: Omit<ActionItem, 'id'>) => void;
  onSelectMeeting?: (meetingId: string) => void;
}

type ViewMode = 'table' | 'kanban' | 'team_cards' | 'timeline';

export const ActionPlanDashboard: React.FC<ActionPlanDashboardProps> = ({
  meetings,
  onUpdateActionStatus,
  onAddCustomAction,
  onSelectMeeting
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskRole, setNewTaskRole] = useState('');
  const [newTaskResponsibilities, setNewTaskResponsibilities] = useState('');
  const [newTaskTimeline, setNewTaskTimeline] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('high');
  const [newTaskMeetingId, setNewTaskMeetingId] = useState(meetings[0]?.id || '');
  const [newTaskDeliverable, setNewTaskDeliverable] = useState('');

  // Collect all action items across meetings
  const allActions = useMemo(() => {
    return meetings.flatMap(m => m.actionPlan || []);
  }, [meetings]);

  // Unique assignees
  const allAssignees = useMemo(() => {
    const set = new Set<string>();
    allActions.forEach(a => {
      if (a.assignee) set.add(a.assignee);
    });
    return Array.from(set).sort();
  }, [allActions]);

  // Filtered action items
  const filteredActions = useMemo(() => {
    return allActions.filter(item => {
      if (selectedMeetingId !== 'all' && item.meetingId !== selectedMeetingId) return false;
      if (selectedAssignee !== 'all' && item.assignee !== selectedAssignee) return false;
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTask = item.task.toLowerCase().includes(q);
        const matchAssignee = item.assignee.toLowerCase().includes(q);
        const matchRole = item.role.toLowerCase().includes(q);
        const matchResp = item.responsibilities?.toLowerCase().includes(q) || false;
        const matchDeliverable = item.deliverable?.toLowerCase().includes(q) || false;
        if (!matchTask && !matchAssignee && !matchRole && !matchResp && !matchDeliverable) {
          return false;
        }
      }

      return true;
    });
  }, [allActions, selectedMeetingId, selectedAssignee, selectedPriority, selectedStatus, searchQuery]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = allActions.length;
    const completed = allActions.filter(a => a.status === 'completed').length;
    const urgent = allActions.filter(a => a.priority === 'urgent' && a.status !== 'completed').length;
    const inProgress = allActions.filter(a => a.status === 'in_progress').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, urgent, inProgress, percent };
  }, [allActions]);

  const handleStatusToggle = (actionId: string, currentStatus: ActionStatus) => {
    const order: ActionStatus[] = ['todo', 'in_progress', 'review', 'completed'];
    const nextIdx = (order.indexOf(currentStatus) + 1) % order.length;
    const newStatus = order[nextIdx];
    
    if (newStatus === 'completed') {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    }
    onUpdateActionStatus(actionId, newStatus);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskAssignee.trim()) return;

    const targetMeeting = meetings.find(m => m.id === newTaskMeetingId) || meetings[0];

    onAddCustomAction({
      meetingId: targetMeeting?.id || 'meet-custom',
      meetingTitle: targetMeeting?.title || 'Custom Milestone',
      task: newTaskTitle.trim(),
      assignee: newTaskAssignee.trim(),
      role: newTaskRole.trim() || 'Team Specialist',
      responsibilities: newTaskResponsibilities.trim() || 'Core task ownership and delivery execution',
      timeline: newTaskTimeline.trim() || `By ${newTaskDeadline}`,
      deadlineDate: newTaskDeadline || new Date().toISOString().split('T')[0],
      priority: newTaskPriority,
      status: 'todo',
      deliverable: newTaskDeliverable.trim() || 'Completed deliverable'
    });

    // Reset form
    setNewTaskTitle('');
    setNewTaskAssignee('');
    setNewTaskRole('');
    setNewTaskResponsibilities('');
    setNewTaskTimeline('');
    setNewTaskDeliverable('');
    setIsAddingTask(false);
    confetti({ particleCount: 25, spread: 50 });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Deliverables</span>
            <CheckSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across {meetings.length} analyzed meetings</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Completed Actions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.completed}</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active engineering & product streams</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Urgent Attention</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{stats.urgent}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Time-critical cutover & audit gates</div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, View Modes, and Export */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, roles, responsibilities, assignees..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* View Mode Toggle Buttons & Add Task CTA */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('table')}
                title="Interactive Table View"
                className={`p-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                title="Kanban Board View"
                className={`p-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('team_cards')}
                title="Grouped by Team Member"
                className={`p-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'team_cards' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                title="Chronological Timeline View"
                className={`p-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'timeline' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={() => exportActionPlanToCSV(filteredActions, 'Filtered_Action_Plan')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Export Current View as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {/* Add Task Button */}
            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Action</span>
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-slate-500 mr-1">
            <Filter className="w-3 h-3" />
            Filters:
          </span>

          {/* Meeting filter */}
          <select
            value={selectedMeetingId}
            onChange={(e) => setSelectedMeetingId(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Meetings ({meetings.length})</option>
            {meetings.map(m => (
              <option key={m.id} value={m.id}>
                {m.title.length > 32 ? m.title.slice(0, 32) + '...' : m.title}
              </option>
            ))}
          </select>

          {/* Assignee filter */}
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Assignees ({allAssignees.length})</option>
            {allAssignees.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="completed">Completed</option>
          </select>

          {(selectedMeetingId !== 'all' || selectedAssignee !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedMeetingId('all');
                setSelectedAssignee('all');
                setSelectedPriority('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline ml-auto"
            >
              Reset Filters ({filteredActions.length} showing)
            </button>
          )}
        </div>
      </div>

      {/* Add Task Collapsible Drawer / Form */}
      {isAddingTask && (
        <form 
          onSubmit={handleCreateTask}
          className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-800/60 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Add Custom Action Plan Deliverable
            </h3>
            <button 
              type="button" 
              onClick={() => setIsAddingTask(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Task Deliverable Description *</label>
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Conduct third-party pen-test & remediate high vulnerabilities"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Assignee Name *</label>
              <input
                type="text"
                required
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                placeholder="e.g. Rachel Green"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Professional Role</label>
              <input
                type="text"
                value={newTaskRole}
                onChange={(e) => setNewTaskRole(e.target.value)}
                placeholder="e.g. Head of Security & Compliance"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Scope of Responsibility</label>
              <input
                type="text"
                value={newTaskResponsibilities}
                onChange={(e) => setNewTaskResponsibilities(e.target.value)}
                placeholder="e.g. Penetration testing governance, remediation review"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Timeline / Target Date</label>
              <input
                type="text"
                value={newTaskTimeline}
                onChange={(e) => setNewTaskTimeline(e.target.value)}
                placeholder="e.g. By Oct 25, 2026 or Sprint 25"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Deadline Date</label>
              <input
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Deliverable Asset</label>
              <input
                type="text"
                value={newTaskDeliverable}
                onChange={(e) => setNewTaskDeliverable(e.target.value)}
                placeholder="e.g. Pen-test audit report & certificate"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
            >
              Save Action Item
            </button>
          </div>
        </form>
      )}

      {/* VIEW MODE 1: Interactive Table */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Status</th>
                  <th className="py-3.5 px-4">Task Deliverable</th>
                  <th className="py-3.5 px-4">Assignee & Role</th>
                  <th className="py-3.5 px-4">Role & Responsibilities</th>
                  <th className="py-3.5 px-4">Timeline / Deadline</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Meeting Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredActions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      No action items match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredActions.map((action) => {
                    const pBadge = getPriorityBadge(action.priority);
                    const sBadge = getStatusBadge(action.status);
                    const isDone = action.status === 'completed';

                    return (
                      <tr 
                        key={action.id}
                        className={`hover:bg-slate-800/40 transition group ${
                          isDone ? 'bg-slate-950/20 text-slate-400' : ''
                        }`}
                      >
                        {/* Status Checkbox / Pill */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleStatusToggle(action.id, action.status)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition border ${
                              isDone 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                                : 'bg-slate-950 text-slate-500 border-slate-700 hover:border-indigo-400'
                            }`}
                            title={`Current: ${action.status}. Click to cycle next status.`}
                          >
                            {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-indigo-400" />}
                          </button>
                        </td>

                        {/* Task & Deliverable */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className={`font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {action.task}
                          </div>
                          {action.deliverable && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <span className="text-indigo-400 font-semibold">Deliverable:</span>
                              <span className="truncate">{action.deliverable}</span>
                            </div>
                          )}
                          {action.dependencies && action.dependencies !== 'None' && (
                            <div className="text-[10px] text-amber-400/80 mt-0.5">
                              Blocked on: {action.dependencies}
                            </div>
                          )}
                        </td>

                        {/* Assignee & Role */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${getAvatarColor(action.assignee)}`}>
                              {getInitials(action.assignee)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-200">{action.assignee}</div>
                              <div className="text-[10px] text-indigo-300 font-mono">{action.role}</div>
                            </div>
                          </div>
                        </td>

                        {/* Explicit Role & Responsibilities */}
                        <td className="py-3.5 px-4 max-w-sm text-slate-300 leading-relaxed text-[11px]">
                          {action.responsibilities || 'Accountable for feature milestone delivery.'}
                        </td>

                        {/* Timeline / Deadline */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-slate-200 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{action.timeline}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                            Due: {action.deadlineDate}
                          </div>
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}>
                            {pBadge.label}
                          </span>
                        </td>

                        {/* Meeting Link / Title */}
                        <td className="py-3.5 px-4 max-w-[180px]">
                          <button
                            onClick={() => onSelectMeeting && onSelectMeeting(action.meetingId)}
                            className="text-left text-indigo-400 hover:text-indigo-300 text-[11px] truncate flex items-center gap-1 group/btn"
                          >
                            <span className="truncate">{action.meetingTitle}</span>
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition flex-shrink-0" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['todo', 'in_progress', 'review', 'completed'] as ActionStatus[]).map((colStatus) => {
            const colActions = filteredActions.filter(a => a.status === colStatus);
            const statusConfig = getStatusBadge(colStatus);

            return (
              <div 
                key={colStatus}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusConfig.text.replace('text', 'bg')}`} />
                    <span className="font-semibold text-xs text-white uppercase tracking-wider">{statusConfig.label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
                    {colActions.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colActions.length === 0 ? (
                    <div className="text-center py-10 text-[11px] text-slate-500 italic">
                      No actions in {statusConfig.label}
                    </div>
                  ) : (
                    colActions.map((item) => {
                      const pBadge = getPriorityBadge(item.priority);

                      return (
                        <div 
                          key={item.id}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-indigo-500/50 transition shadow-sm space-y-2.5 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}>
                              {pBadge.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{item.timeline}</span>
                          </div>

                          <div className="font-medium text-xs text-slate-100 group-hover:text-indigo-200 transition">
                            {item.task}
                          </div>

                          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Responsibilities</div>
                            {item.responsibilities}
                          </div>

                          {item.deliverable && (
                            <div className="text-[10px] text-indigo-300 bg-indigo-950/30 px-2 py-1 rounded border border-indigo-800/30">
                              <span className="font-semibold text-indigo-200">Deliverable:</span> {item.deliverable}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${getAvatarColor(item.assignee)}`}>
                                {getInitials(item.assignee)}
                              </div>
                              <span className="text-[11px] text-slate-300 truncate max-w-[100px]">{item.assignee}</span>
                            </div>

                            <button
                              onClick={() => handleStatusToggle(item.id, item.status)}
                              className="text-[10px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                              title="Advance Status"
                            >
                              <span>Advance</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 3: Grouped by Team Member Cards */}
      {viewMode === 'team_cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allAssignees.map((person) => {
            const personActions = filteredActions.filter(a => a.assignee === person);
            if (personActions.length === 0) return null;

            const primaryRole = personActions[0]?.role || 'Team Member';
            const doneCount = personActions.filter(a => a.status === 'completed').length;
            const progress = Math.round((doneCount / personActions.length) * 100);

            return (
              <div 
                key={person}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
              >
                {/* Person Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shadow-md ${getAvatarColor(person)}`}>
                      {getInitials(person)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white">{person}</h4>
                      <p className="text-xs text-indigo-300 font-mono">{primaryRole}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                    {doneCount}/{personActions.length} done
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Task Completion</span>
                    <span className="font-mono">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5 pt-1">
                  {personActions.map(action => {
                    const isDone = action.status === 'completed';
                    const pBadge = getPriorityBadge(action.priority);

                    return (
                      <div 
                        key={action.id}
                        className={`p-3 rounded-xl border text-xs transition ${
                          isDone 
                            ? 'bg-slate-950/40 border-slate-800/50 text-slate-400' 
                            : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => handleStatusToggle(action.id, action.status)}
                              className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center text-[10px] transition border ${
                                isDone 
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                                  : 'border-slate-600 hover:border-indigo-400'
                              }`}
                            >
                              {isDone && <Check className="w-3 h-3" />}
                            </button>
                            <span className={`font-medium ${isDone ? 'line-through' : ''}`}>
                              {action.task}
                            </span>
                          </div>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}>
                            {action.priority}
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-400 mt-2 pl-6">
                          <span className="text-slate-400">Responsibility:</span> {action.responsibilities}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pl-6 border-t border-slate-800/60 pt-1.5 font-mono">
                          <span>Timeline: {action.timeline}</span>
                          <span className="text-indigo-400 truncate max-w-[140px]">{action.meetingTitle}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 4: Chronological Timeline */}
      {viewMode === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-semibold text-sm text-white">Execution Roadmap & Milestone Chronology</h3>
              <p className="text-xs text-slate-400">Chronological sequence of all team deliverables sorted by target dates</p>
            </div>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-500/30">
            {filteredActions
              .slice()
              .sort((a, b) => (a.deadlineDate || '').localeCompare(b.deadlineDate || ''))
              .map((item, idx) => {
                const isDone = item.status === 'completed';
                const pBadge = getPriorityBadge(item.priority);
                const sBadge = getStatusBadge(item.status);

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline Node Icon */}
                    <div 
                      onClick={() => handleStatusToggle(item.id, item.status)}
                      className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition border ${
                        isDone 
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20' 
                          : 'bg-slate-900 text-slate-400 border-indigo-500/60 group-hover:border-indigo-400 group-hover:scale-110'
                      }`}
                    >
                      {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                    </div>

                    {/* Timeline Content Card */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition shadow-sm space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-sky-400 bg-sky-950/40 px-2.5 py-1 rounded-md border border-sky-800/40">
                            {item.timeline}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}>
                            {pBadge.label}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sBadge.bg} ${sBadge.text} ${sBadge.border}`}>
                            {sBadge.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${getAvatarColor(item.assignee)}`}>
                            {getInitials(item.assignee)}
                          </div>
                          <span className="text-xs font-medium text-slate-200">{item.assignee}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({item.role})</span>
                        </div>
                      </div>

                      <div className={`text-sm font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {item.task}
                      </div>

                      <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 font-medium">Domain Responsibility:</span> {item.responsibilities}
                      </div>

                      {item.deliverable && (
                        <div className="text-xs text-indigo-300">
                          <span className="font-semibold text-indigo-200">Deliverable:</span> {item.deliverable}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
