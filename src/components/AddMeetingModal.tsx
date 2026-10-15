import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Calendar,
  Wand2
} from 'lucide-react';
import { SAMPLE_TRANSCRIPT_PRESETS } from '../data/sampleMeetings';
import { Meeting } from '../types/meeting';
import confetti from 'canvas-confetti';

interface AddMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingAnalyzed: (meeting: Meeting) => void;
}

export const AddMeetingModal: React.FC<AddMeetingModalProps> = ({
  isOpen,
  onClose,
  onMeetingAnalyzed
}) => {
  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Product & Engineering');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const steps = [
    'Parsing speakers & transcript context...',
    'Synthesizing executive summary & key decisions...',
    'Extracting team member roles, responsibilities & timelines...',
    'Categorizing topic weights & integrating cross-meeting trends...'
  ];

  const handleApplyPreset = (presetIndex: number) => {
    const preset = SAMPLE_TRANSCRIPT_PRESETS[presetIndex];
    if (preset) {
      setTranscript(preset.transcript);
      setTitle(preset.suggestedTitle);
      setDepartment(preset.department);
      setError(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTranscript(content);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) {
      setError('Please provide or upload a meeting transcript.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const response = await fetch('/api/analyze-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript.trim(),
          title: title.trim() || undefined,
          department: department.trim() || undefined,
          date: date || new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze meeting transcript');
      }

      const analyzedData = await response.json();
      clearInterval(stepInterval);

      const newMeetingId = `meet-${Date.now()}`;
      const processedMeeting: Meeting = {
        id: newMeetingId,
        title: analyzedData.title || title || 'Strategic Team Meeting',
        date: date || new Date().toISOString().split('T')[0],
        duration: analyzedData.duration || '45 mins',
        department: analyzedData.department || department || 'General',
        attendees: analyzedData.attendees || ['Team Lead', 'Engineering Specialist'],
        transcript: transcript,
        summary: analyzedData.summary || {
          tldr: 'Meeting analysis completed with aligned deliverables.',
          keyDecisions: [],
          criticalHighlights: [],
          sentiment: 'collaborative',
          risksAndBlockers: []
        },
        actionPlan: (analyzedData.actionPlan || []).map((item: any, idx: number) => ({
          id: `act-${Date.now()}-${idx}`,
          meetingId: newMeetingId,
          meetingTitle: analyzedData.title || title || 'Strategic Team Meeting',
          task: item.task || 'Assigned milestone task',
          assignee: item.assignee || 'Team Member',
          role: item.role || 'Contributor',
          responsibilities: item.responsibilities || 'Responsible for execution and delivery',
          timeline: item.timeline || 'Upcoming sprint',
          deadlineDate: item.deadlineDate || new Date().toISOString().split('T')[0],
          priority: item.priority || 'medium',
          status: 'todo',
          dependencies: item.dependencies || 'None',
          deliverable: item.deliverable || 'Output deliverable'
        })),
        teamResponsibilities: analyzedData.teamResponsibilities || [],
        topics: (analyzedData.topics || []).map((t: any, idx: number) => ({
          id: `top-${Date.now()}-${idx}`,
          name: t.name || 'General Operations',
          category: t.category || 'Operations',
          weight: t.weight || 6,
          sentiment: t.sentiment || 'neutral',
          keyPoints: t.keyPoints || []
        })),
        createdAt: new Date().toISOString(),
      };

      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onMeetingAnalyzed(processedMeeting);
      onClose();
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error(err);
      setError(err.message || 'An unexpected error occurred while analyzing the transcript.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Ingest & Analyze Meeting Transcript</h2>
              <p className="text-xs text-slate-400">Generate executive summary, role & responsibility plan, and topic trend markers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                Quick-Start with realistic presets:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TRANSCRIPT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(idx)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-sky-400" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Meeting Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 Growth Architecture"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Engineering & Product"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Meeting Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Transcript Input Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Meeting Transcript <span className="text-rose-400">*</span>
              </label>
              <label className="cursor-pointer text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload .txt / .vtt / .srt file</span>
                <input
                  type="file"
                  accept=".txt,.vtt,.srt,.md,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              rows={9}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste dialogue with speaker tags, e.g.:&#10;Alex Chen: Let's discuss the database replication...&#10;Sarah Jenkins: I will finalize the product roadmap by Friday..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-xs font-mono leading-relaxed focus:outline-none focus:border-indigo-500 transition resize-none"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
              <span>Supports Zoom, Google Meet, Teams, Otter.ai, or plain speaker transcripts</span>
              <span>{transcript.length.toLocaleString()} characters</span>
            </div>
          </div>

          {/* Processing State Feedback */}
          {isLoading && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-300 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                  </span>
                  Gemini 3.8 Flash Analysis in Progress...
                </span>
                <span className="text-slate-400">Step {loadingStep + 1} of {steps.length}</span>
              </div>

              {/* Progress Stepper */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full transition-all duration-500 ease-out"
                  style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                />
              </div>

              <p className="text-xs text-indigo-200/90 italic flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                {steps[loadingStep]}
              </p>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !transcript.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Analyzing Meeting...' : 'Analyze & Build Action Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
