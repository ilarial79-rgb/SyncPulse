import React, { useState, useMemo } from 'react';
import { 
  CrossMeetingTrends, 
  Meeting, 
  TopicTrendItem 
} from '../types/meeting';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Layers, 
  AlertOctagon, 
  Lightbulb, 
  CheckCircle2, 
  ArrowUpRight, 
  Filter, 
  Eye, 
  RotateCw, 
  Download,
  Info,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { getTrendBadge, getSentimentBadge, getPriorityBadge } from '../utils/uiHelpers';
import { exportTrendsToMarkdown } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface DynamicTrendAnalysisViewProps {
  trends: CrossMeetingTrends;
  meetings: Meeting[];
  onSynthesizeTrends: () => Promise<void>;
  isSynthesizing: boolean;
  onSelectMeeting?: (meetingId: string) => void;
}

export const DynamicTrendAnalysisView: React.FC<DynamicTrendAnalysisViewProps> = ({
  trends,
  meetings,
  onSynthesizeTrends,
  isSynthesizing,
  onSelectMeeting
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    trends.commonTopics[0]?.topic || null
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{
    topic: string;
    meetingTitle: string;
    date: string;
    intensity: number;
    sentiment: string;
    x: number;
    y: number;
  } | null>(null);

  // Unique topic categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    trends.commonTopics.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [trends.commonTopics]);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    if (activeCategoryFilter === 'all') return trends.commonTopics;
    return trends.commonTopics.filter(t => t.category === activeCategoryFilter);
  }, [trends.commonTopics, activeCategoryFilter]);

  // Detail item for deep-dive panel
  const activeDeepDiveTopic = useMemo(() => {
    return trends.commonTopics.find(t => t.topic === selectedTopic) || trends.commonTopics[0];
  }, [trends.commonTopics, selectedTopic]);

  // Unique dates for chart X-axis
  const sortedMeetings = useMemo(() => {
    return [...meetings].sort((a, b) => a.date.localeCompare(b.date));
  }, [meetings]);

  const allDates = useMemo(() => {
    return sortedMeetings.map(m => m.date);
  }, [sortedMeetings]);

  // Distinct palette for topics
  const topicColors = [
    { stroke: '#6366f1', fill: 'rgba(99, 102, 241, 0.2)', name: 'indigo' },
    { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.2)', name: 'emerald' },
    { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.2)', name: 'cyan' },
    { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.2)', name: 'amber' },
    { stroke: '#ec4899', fill: 'rgba(236, 72, 153, 0.2)', name: 'pink' },
    { stroke: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.2)', name: 'purple' },
  ];

  // SVG dimensions for chart
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingX = 50;
  const paddingY = 40;

  const getX = (index: number, total: number) => {
    if (total <= 1) return chartWidth / 2;
    return paddingX + (index / (total - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    // val is 1-10
    const clamped = Math.max(1, Math.min(10, val));
    return chartHeight - paddingY - ((clamped - 1) / 9) * (chartHeight - paddingY * 2);
  };

  const handleManualSynthesize = async () => {
    await onSynthesizeTrends();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.4 } });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Cross-Meeting Intelligence
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {meetings.length} Meetings Synthesized
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dynamic Topic & Sentiment Trends
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Consolidated analysis identifying recurring topics, urgency spikes, and operational convergence across engineering, security, and product roadmaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => exportTrendsToMarkdown(trends, meetings)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>Export Trend Report</span>
            </button>

            <button
              onClick={handleManualSynthesize}
              disabled={isSynthesizing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 via-violet-600 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 active:scale-95"
            >
              <RotateCw className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>{isSynthesizing ? 'Synthesizing with Gemini...' : 'Re-Synthesize Trends'}</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Main Interactive Chart Card: Topic Intensity Evolution Over Time */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base text-white">Topic Evolution & Emphasis Trajectory</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive timeline tracking topic intensity (1-10 scale) across meeting dates. Click any topic to focus.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Category:</span>
            <select
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories ({trends.commonTopics.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Topic Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/80">
          {filteredTopics.map((item, idx) => {
            const color = topicColors[idx % topicColors.length];
            const isSelected = selectedTopic === item.topic;
            const trendBadge = getTrendBadge(item.trend);

            return (
              <button
                key={item.topic}
                onClick={() => setSelectedTopic(item.topic)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                  isSelected 
                    ? 'bg-slate-800 border-indigo-500 text-white shadow-md' 
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.stroke }}
                />
                <span className="font-semibold truncate max-w-[160px]">{item.topic}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  ({item.totalMentions}x)
                </span>
                <span className="text-[11px]">{trendBadge.icon}</span>
              </button>
            );
          })}
        </div>

        {/* SVG Dynamic Interactive Chart */}
        <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800/80 overflow-x-auto">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-64 overflow-visible select-none"
          >
            {/* Grid horizontal lines */}
            {[2, 4, 6, 8, 10].map(val => (
              <g key={val}>
                <line 
                  x1={paddingX} 
                  y1={getY(val)} 
                  x2={chartWidth - paddingX} 
                  y2={getY(val)} 
                  stroke="#1e293b" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingX - 12} 
                  y={getY(val) + 4} 
                  fill="#64748b" 
                  fontSize="10" 
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            ))}

            {/* Vertical grid lines & Date labels */}
            {sortedMeetings.map((m, idx) => {
              const x = getX(idx, sortedMeetings.length);
              return (
                <g key={m.id}>
                  <line 
                    x1={x} 
                    y1={paddingY} 
                    x2={x} 
                    y2={chartHeight - paddingY} 
                    stroke="#1e293b" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={x} 
                    y={chartHeight - 14} 
                    fill="#94a3b8" 
                    fontSize="10" 
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {m.date.slice(5)}
                  </text>
                </g>
              );
            })}

            {/* Plot lines for each topic */}
            {filteredTopics.map((topicItem, topicIdx) => {
              const color = topicColors[topicIdx % topicColors.length];
              const isSelected = selectedTopic === topicItem.topic;
              const isOtherSelected = selectedTopic !== null && !isSelected;

              // Build points along chronological meetings
              const points = sortedMeetings.map((m, mIdx) => {
                const found = topicItem.meetingsAppeared.find(a => a.meetingId === m.id);
                const intensity = found ? found.intensity : 0;
                return {
                  x: getX(mIdx, sortedMeetings.length),
                  y: getY(intensity > 0 ? intensity : 1),
                  hasData: !!found,
                  intensity,
                  meeting: m,
                  sentiment: found?.sentiment || 'neutral'
                };
              });

              // Create SVG path string for non-zero points or full spline
              const dataPoints = points.filter(p => p.hasData);
              if (dataPoints.length === 0) return null;

              const pathD = dataPoints.reduce((acc, p, idx) => {
                return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
              }, '');

              return (
                <g key={topicItem.topic} opacity={isOtherSelected ? 0.25 : 1} className="transition-opacity duration-300">
                  {/* Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={color.stroke}
                    strokeWidth={isSelected ? 3.5 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points */}
                  {dataPoints.map((dp, pIdx) => (
                    <circle
                      key={pIdx}
                      cx={dp.x}
                      cy={dp.y}
                      r={isSelected ? 6 : 4}
                      fill={color.stroke}
                      stroke="#020617"
                      strokeWidth={2}
                      className="cursor-pointer hover:r-8 transition-all"
                      onMouseEnter={() => setHoveredPoint({
                        topic: topicItem.topic,
                        meetingTitle: dp.meeting.title,
                        date: dp.meeting.date,
                        intensity: dp.intensity,
                        sentiment: dp.sentiment,
                        x: dp.x,
                        y: dp.y
                      })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => {
                        setSelectedTopic(topicItem.topic);
                        if (onSelectMeeting) onSelectMeeting(dp.meeting.id);
                      }}
                    />
                  ))}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip */}
          {hoveredPoint && (
            <div 
              className="absolute z-20 pointer-events-none p-3 rounded-xl bg-slate-900 border border-indigo-500/40 shadow-2xl text-xs space-y-1 transform -translate-x-1/2 -translate-y-full -mt-2 animate-in fade-in"
              style={{ left: `${(hoveredPoint.x / chartWidth) * 100}%`, top: `${(hoveredPoint.y / chartHeight) * 100}%` }}
            >
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                {hoveredPoint.topic}
              </div>
              <div className="text-[11px] text-slate-300 truncate max-w-xs">{hoveredPoint.meetingTitle}</div>
              <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
                <span>Date: {hoveredPoint.date}</span>
                <span className="text-indigo-400 font-bold">Emphasis: {hoveredPoint.intensity}/10</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-indigo-500 rounded-full" />
              Solid line: Continuous discussion trajectory
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Dots: Analyzed meeting occurrence
            </span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">Y-Axis: Relative discussion emphasis (1 - 10)</span>
        </div>
      </div>

      {/* Sentiment & Urgency Radar Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Cross-Meeting Sentiment & Urgency Evolution
            </h3>
            <p className="text-xs text-slate-400">
              Tracking team confidence versus pressure during architectural and incident milestones
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Optimism Score</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Urgency Score</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {trends.sentimentTimeline.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2.5"
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
                <span className="text-[10px] text-slate-500">M#{idx + 1}</span>
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate" title={item.meetingTitle}>
                {item.meetingTitle}
              </div>

              {/* Optimism meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-400">Optimism</span>
                  <span className="font-mono text-emerald-400 font-bold">{item.optimismScore}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.optimismScore}%` }}
                  />
                </div>
              </div>

              {/* Urgency meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-rose-400">Urgency</span>
                  <span className="font-mono text-rose-400 font-bold">{item.urgencyScore}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.urgencyScore}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Common Topics Matrix + Topic Deep Dive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Common Topics Matrix */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Synthesized Common Themes</h3>
              <p className="text-xs text-slate-400">Identified from multi-transcript semantic convergence</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-800/40">
              {trends.commonTopics.length} Core Themes
            </span>
          </div>

          <div className="space-y-3">
            {trends.commonTopics.map((topicItem) => {
              const trendBadge = getTrendBadge(topicItem.trend);
              const isSelected = selectedTopic === topicItem.topic;

              return (
                <div
                  key={topicItem.topic}
                  onClick={() => setSelectedTopic(topicItem.topic)}
                  className={`p-4 rounded-2xl cursor-pointer transition border ${
                    isSelected 
                      ? 'bg-indigo-950/20 border-indigo-500 shadow-md' 
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{topicItem.topic}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {topicItem.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {topicItem.summaryInsight}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0 space-y-1">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${trendBadge.bg} ${trendBadge.text}`}>
                        <span>{trendBadge.icon}</span>
                        <span>{trendBadge.label}</span>
                      </span>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Avg: <span className="text-white font-bold">{topicItem.averageIntensity}/10</span> ({topicItem.totalMentions} mtgs)
                      </div>
                    </div>
                  </div>

                  {/* Micro Progress Bar of Intensity */}
                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full"
                      style={{ width: `${(topicItem.averageIntensity / 10) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Selected Topic Deep Dive */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          {activeDeepDiveTopic ? (
            <>
              <div className="space-y-1 pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                    Topic Deep Dive
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/30">
                    {activeDeepDiveTopic.category}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white">{activeDeepDiveTopic.topic}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {activeDeepDiveTopic.summaryInsight}
                </p>
              </div>

              {/* Occurrences Across Meetings */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Meetings Where Discussed ({activeDeepDiveTopic.meetingsAppeared.length})</span>
                  <span className="text-slate-500 font-mono text-[10px]">Intensity Score</span>
                </div>

                <div className="space-y-2.5">
                  {activeDeepDiveTopic.meetingsAppeared.map((app, idx) => {
                    const sBadge = getSentimentBadge(app.sentiment as any);

                    return (
                      <div 
                        key={idx}
                        onClick={() => onSelectMeeting && onSelectMeeting(app.meetingId)}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-200 group-hover:text-indigo-300 transition truncate max-w-[200px]">
                            {app.meetingTitle}
                          </span>
                          <span className="font-mono text-xs font-bold text-indigo-400">
                            {app.intensity}/10
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-mono">{app.date}</span>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] border ${sBadge.bg}`}>
                            <span>{sBadge.icon}</span>
                            <span>{sBadge.label}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Related Action Items for this topic */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300">
                  Associated Team Deliverables
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {meetings
                    .filter(m => activeDeepDiveTopic.meetingsAppeared.some(a => a.meetingId === m.id))
                    .flatMap(m => m.actionPlan || [])
                    .slice(0, 4)
                    .map(act => (
                      <div key={act.id} className="p-2.5 rounded-lg bg-slate-950 text-xs border border-slate-800/80 space-y-1">
                        <div className="font-medium text-slate-200 truncate">{act.task}</div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="text-indigo-400">{act.assignee} ({act.role})</span>
                          <span className="font-mono">{act.timeline}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a topic to explore its cross-meeting history.
            </div>
          )}
        </div>
      </div>

      {/* Strategic Takeaways & Systemic Blockers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Executive Takeaways */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Executive Strategic Takeaways</h3>
              <p className="text-xs text-slate-400">Synthesized macro patterns across all discussions</p>
            </div>
          </div>

          <div className="space-y-3">
            {trends.executiveTakeaways.map((takeaway, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 text-xs text-slate-200 leading-relaxed"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Systemic Blockers */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Systemic Blockers & Friction Points</h3>
              <p className="text-xs text-slate-400">Recurring friction detected across multiple meeting cycles</p>
            </div>
          </div>

          <div className="space-y-3">
            {trends.recurringBlockers.map((blocker, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-rose-900/30 text-xs text-slate-200 leading-relaxed"
              >
                <span className="text-rose-400 text-sm mt-0.5">⚠️</span>
                <span>{blocker}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
