/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Meeting, CrossMeetingTrends, DashboardView, ActionStatus, ActionItem } from './types/meeting';
import { INITIAL_MEETINGS, INITIAL_TRENDS } from './data/sampleMeetings';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { MeetingsListView } from './components/MeetingsListView';
import { MeetingDetailView } from './components/MeetingDetailView';
import { ActionPlanDashboard } from './components/ActionPlanDashboard';
import { TeamMatrixView } from './components/TeamMatrixView';
import { DynamicTrendAnalysisView } from './components/DynamicTrendAnalysisView';
import { AddMeetingModal } from './components/AddMeetingModal';
import confetti from 'canvas-confetti';

const STORAGE_KEY_MEETINGS = 'syncpulse_meetings_v1';
const STORAGE_KEY_TRENDS = 'syncpulse_trends_v1';

export default function App() {
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEETINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse stored meetings:', e);
    }
    return INITIAL_MEETINGS;
  });

  const [trends, setTrends] = useState<CrossMeetingTrends>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRENDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse stored trends:', e);
    }
    return INITIAL_TRENDS;
  });

  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSynthesizingTrends, setIsSynthesizingTrends] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEETINGS, JSON.stringify(meetings));
    } catch (e) {
      console.error('Failed to save meetings:', e);
    }
  }, [meetings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRENDS, JSON.stringify(trends));
    } catch (e) {
      console.error('Failed to save trends:', e);
    }
  }, [trends]);

  // Handler to call backend /api/aggregate-trends
  const handleSynthesizeTrends = async (customMeetingsList?: Meeting[]) => {
    const listToAnalyze = customMeetingsList || meetings;
    if (listToAnalyze.length === 0) return;

    setIsSynthesizingTrends(true);
    try {
      const res = await fetch('/api/aggregate-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetings: listToAnalyze }),
      });

      if (res.ok) {
        const data = await res.json();
        setTrends(data);
      }
    } catch (err) {
      console.error('Failed to synthesize cross-meeting trends:', err);
    } finally {
      setIsSynthesizingTrends(false);
    }
  };

  // Add newly analyzed meeting
  const handleMeetingAnalyzed = async (newMeeting: Meeting) => {
    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    setSelectedMeetingId(newMeeting.id);
    setCurrentView('meetings');

    // Automatically trigger cross-meeting trend re-synthesis
    await handleSynthesizeTrends(updated);
  };

  // Update status of an action item
  const handleUpdateActionStatus = (actionId: string, newStatus: ActionStatus) => {
    setMeetings(prev => prev.map(m => {
      const hasAction = m.actionPlan?.some(a => a.id === actionId);
      if (!hasAction) return m;

      return {
        ...m,
        actionPlan: m.actionPlan.map(a => a.id === actionId ? { ...a, status: newStatus } : a)
      };
    }));
  };

  // Add custom action item
  const handleAddCustomAction = (newItem: Omit<ActionItem, 'id'>) => {
    const actionId = `custom-${Date.now()}`;
    const fullItem: ActionItem = { ...newItem, id: actionId };

    setMeetings(prev => {
      return prev.map(m => {
        if (m.id === newItem.meetingId) {
          return {
            ...m,
            actionPlan: [fullItem, ...(m.actionPlan || [])]
          };
        }
        return m;
      });
    });
  };

  // Delete meeting
  const handleDeleteMeeting = async (meetingId: string) => {
    const updated = meetings.filter(m => m.id !== meetingId);
    setMeetings(updated);
    if (selectedMeetingId === meetingId) {
      setSelectedMeetingId(null);
    }
    await handleSynthesizeTrends(updated);
  };

  // Reset to sample dataset
  const handleResetData = () => {
    setMeetings(INITIAL_MEETINGS);
    setTrends(INITIAL_TRENDS);
    setSelectedMeetingId(null);
    setCurrentView('overview');
    localStorage.removeItem(STORAGE_KEY_MEETINGS);
    localStorage.removeItem(STORAGE_KEY_TRENDS);
    confetti({ particleCount: 30, spread: 60 });
  };

  // Select meeting to view dossier
  const handleSelectMeeting = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentView('meetings');
  };

  // Active meeting for detail view
  const currentMeeting = meetings.find(m => m.id === selectedMeetingId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view !== 'meetings') {
            setSelectedMeetingId(null);
          }
        }}
        meetings={meetings}
        trends={trends}
        onOpenNewTranscript={() => setIsAddModalOpen(true)}
        onResetData={handleResetData}
        isSynthesizingTrends={isSynthesizingTrends}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW: OVERVIEW */}
        {currentView === 'overview' && (
          <OverviewDashboard
            meetings={meetings}
            trends={trends}
            onViewChange={setCurrentView}
            onSelectMeeting={handleSelectMeeting}
            onOpenNewTranscript={() => setIsAddModalOpen(true)}
            onUpdateActionStatus={handleUpdateActionStatus}
          />
        )}

        {/* VIEW: MEETINGS (List or Detail) */}
        {currentView === 'meetings' && (
          <>
            {currentMeeting ? (
              <MeetingDetailView
                meeting={currentMeeting}
                onBack={() => setSelectedMeetingId(null)}
                onUpdateActionStatus={handleUpdateActionStatus}
              />
            ) : (
              <MeetingsListView
                meetings={meetings}
                onSelectMeeting={handleSelectMeeting}
                onOpenNewTranscript={() => setIsAddModalOpen(true)}
                onDeleteMeeting={handleDeleteMeeting}
              />
            )}
          </>
        )}

        {/* VIEW: ACTION PLAN & TIMELINES */}
        {currentView === 'action_plan' && (
          <ActionPlanDashboard
            meetings={meetings}
            onUpdateActionStatus={handleUpdateActionStatus}
            onAddCustomAction={handleAddCustomAction}
            onSelectMeeting={handleSelectMeeting}
          />
        )}

        {/* VIEW: ROLES & RESPONSIBILITIES MATRIX */}
        {currentView === 'team_matrix' && (
          <TeamMatrixView
            meetings={meetings}
            onUpdateActionStatus={handleUpdateActionStatus}
            onSelectMeeting={handleSelectMeeting}
          />
        )}

        {/* VIEW: DYNAMIC TREND ANALYSIS */}
        {currentView === 'trends' && (
          <DynamicTrendAnalysisView
            trends={trends}
            meetings={meetings}
            onSynthesizeTrends={() => handleSynthesizeTrends()}
            isSynthesizing={isSynthesizingTrends}
            onSelectMeeting={handleSelectMeeting}
          />
        )}
      </main>

      {/* Ingest Transcript Modal */}
      <AddMeetingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMeetingAnalyzed={handleMeetingAnalyzed}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">SyncPulse</span>
            <span>•</span>
            <span>AI Meeting Transcript & Cross-Team Trend Synthesizer</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Powered by Gemini 3.8 Flash • Executive Dashboard Format
          </div>
        </div>
      </footer>
    </div>
  );
}
