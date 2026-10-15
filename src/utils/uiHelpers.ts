import { Priority, ActionStatus, SentimentType, TrendVelocity } from '../types/meeting';

export function getPriorityBadge(priority: Priority): { bg: string; text: string; border: string; label: string } {
  switch (priority) {
    case 'urgent':
      return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Urgent' };
    case 'high':
      return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', label: 'High' };
    case 'medium':
      return { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', label: 'Medium' };
    case 'low':
      return { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', label: 'Low' };
    default:
      return { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', label: priority };
  }
}

export function getStatusBadge(status: ActionStatus): { bg: string; text: string; border: string; label: string } {
  switch (status) {
    case 'completed':
      return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Completed' };
    case 'in_progress':
      return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', label: 'In Progress' };
    case 'review':
      return { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', label: 'In Review' };
    case 'todo':
      return { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', label: 'To Do' };
    default:
      return { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', label: status };
  }
}

export function getSentimentBadge(sentiment: SentimentType): { bg: string; text: string; label: string; icon: string } {
  switch (sentiment) {
    case 'optimistic':
      return { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', text: 'text-emerald-400', label: 'Optimistic', icon: '✨' };
    case 'collaborative':
      return { bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30', text: 'text-sky-400', label: 'Collaborative', icon: '🤝' };
    case 'urgent':
      return { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', text: 'text-amber-400', label: 'Urgent', icon: '⚡' };
    case 'critical':
      return { bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30', text: 'text-rose-400', label: 'Critical Risk', icon: '🚨' };
    case 'cautious':
      return { bg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', text: 'text-yellow-400', label: 'Cautious', icon: '🛡️' };
    default:
      return { bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30', text: 'text-slate-400', label: sentiment, icon: '💬' };
  }
}

export function getTrendBadge(trend: TrendVelocity): { bg: string; text: string; icon: string; label: string } {
  switch (trend) {
    case 'rising':
      return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', icon: '📈', label: 'Rising Trend' };
    case 'declining':
      return { bg: 'bg-indigo-500/15', text: 'text-indigo-400', icon: '📉', label: 'Declining / Stabilized' };
    case 'steady':
      return { bg: 'bg-amber-500/15', text: 'text-amber-400', icon: '⚖️', label: 'Steady Focus' };
    case 'new':
      return { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-400', icon: '✨', label: 'Newly Emerged' };
    default:
      return { bg: 'bg-slate-500/15', text: 'text-slate-400', icon: '•', label: trend };
  }
}

const AVATAR_COLORS = [
  'bg-indigo-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-cyan-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-600 text-white',
  'bg-teal-600 text-white',
  'bg-fuchsia-600 text-white'
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
