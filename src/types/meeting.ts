export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type ActionStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type SentimentType = 'optimistic' | 'collaborative' | 'urgent' | 'critical' | 'cautious';
export type TrendVelocity = 'rising' | 'declining' | 'steady' | 'new';

export interface ActionItem {
  id: string;
  meetingId: string;
  meetingTitle: string;
  task: string;
  assignee: string;
  role: string;
  responsibilities: string;
  timeline: string;
  deadlineDate: string; // YYYY-MM-DD
  priority: Priority;
  status: ActionStatus;
  dependencies?: string;
  deliverable?: string;
}

export interface TeamResponsibility {
  member: string;
  role: string;
  primaryResponsibility: string;
  deliverables: string[];
}

export interface MeetingTopic {
  id?: string;
  name: string;
  category: 'Infrastructure' | 'Product' | 'Security' | 'Strategy' | 'Operations' | 'Customer' | string;
  weight: number; // 1 to 10
  sentiment: 'positive' | 'neutral' | 'concerned';
  keyPoints: string[];
}

export interface MeetingSummary {
  tldr: string;
  keyDecisions: string[];
  criticalHighlights: string[];
  sentiment: SentimentType;
  risksAndBlockers: string[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  department: string;
  attendees: string[];
  transcript: string;
  summary: MeetingSummary;
  actionPlan: ActionItem[];
  teamResponsibilities: TeamResponsibility[];
  topics: MeetingTopic[];
  createdAt: string;
}

export interface TopicTrendItem {
  topic: string;
  category: string;
  totalMentions: number;
  trend: TrendVelocity;
  meetingsAppeared: {
    meetingId: string;
    meetingTitle: string;
    date: string;
    intensity: number;
    sentiment: string;
  }[];
  averageIntensity: number;
  summaryInsight: string;
}

export interface SentimentTimelinePoint {
  date: string;
  meetingTitle: string;
  optimismScore: number;
  urgencyScore: number;
}

export interface CrossMeetingTrends {
  commonTopics: TopicTrendItem[];
  sentimentTimeline: SentimentTimelinePoint[];
  recurringBlockers: string[];
  executiveTakeaways: string[];
}

export type DashboardView = 'overview' | 'meetings' | 'action_plan' | 'team_matrix' | 'trends';
