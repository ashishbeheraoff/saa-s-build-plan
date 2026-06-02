// Mock data for LeadRaider MVP

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  qualified: number;
  connected: number;
  completed: number;
  total: number;
  createdAt: string;
  accountId: string;
}

export interface Account {
  id: string;
  email: string;
  status: 'running' | 'starting' | 'stopped' | 'error';
  dailyLimit: number;
  weeklyLimit: number;
  connectsToday: number;
  connectsThisWeek: number;
  lastActivity: string;
  errorMessage?: string;
}

export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  state: 'new' | 'connected' | 'messaged' | 'replied' | 'qualified' | 'meeting_booked' | 'converted' | 'disqualified';
  campaignId: string;
  campaignName: string;
  lastMessageAt: string;
  disqualifiedReason?: string;
}

export interface Message {
  id: string;
  leadId: string;
  content: string;
  sender: 'bot' | 'lead';
  timestamp: string;
}

export interface DailyActivity {
  date: string;
  connects: number;
  messages: number;
  replies: number;
  meetings: number;
}

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Series A Founders Q1',
    objective: 'Connect with Series A startup founders in fintech to discuss growth strategies and potential partnerships.',
    status: 'active',
    qualified: 156,
    connected: 89,
    completed: 234,
    total: 500,
    createdAt: '2024-01-15',
    accountId: '1'
  },
  {
    id: '2',
    name: 'VP Sales Outreach',
    objective: 'Reach out to VP of Sales at mid-market SaaS companies for demo requests.',
    status: 'active',
    qualified: 78,
    connected: 45,
    completed: 120,
    total: 300,
    createdAt: '2024-01-20',
    accountId: '1'
  },
  {
    id: '3',
    name: 'DevTool CTOs',
    objective: 'Engage CTOs at developer tool companies to discuss infrastructure solutions.',
    status: 'paused',
    qualified: 34,
    connected: 21,
    completed: 89,
    total: 200,
    createdAt: '2024-01-10',
    accountId: '2'
  },
  {
    id: '4',
    name: 'Healthcare Tech Leaders',
    objective: 'Connect with healthcare technology decision makers for enterprise solutions.',
    status: 'completed',
    qualified: 67,
    connected: 52,
    completed: 150,
    total: 150,
    createdAt: '2023-12-01',
    accountId: '2'
  },
  {
    id: '5',
    name: 'E-commerce Founders',
    objective: 'Target DTC brand founders for marketing automation partnerships.',
    status: 'draft',
    qualified: 0,
    connected: 0,
    completed: 0,
    total: 250,
    createdAt: '2024-02-01',
    accountId: '1'
  }
];

export const mockAccounts: Account[] = [
  {
    id: '1',
    email: 'john.smith@company.com',
    status: 'running',
    dailyLimit: 25,
    weeklyLimit: 100,
    connectsToday: 18,
    connectsThisWeek: 72,
    lastActivity: '2024-02-15T14:32:00Z'
  },
  {
    id: '2',
    email: 'sarah.jones@company.com',
    status: 'starting',
    dailyLimit: 20,
    weeklyLimit: 80,
    connectsToday: 0,
    connectsThisWeek: 45,
    lastActivity: '2024-02-15T10:15:00Z'
  },
  {
    id: '3',
    email: 'mike.wilson@company.com',
    status: 'stopped',
    dailyLimit: 30,
    weeklyLimit: 120,
    connectsToday: 0,
    connectsThisWeek: 0,
    lastActivity: '2024-02-10T09:00:00Z'
  },
  {
    id: '4',
    email: 'emma.davis@company.com',
    status: 'error',
    dailyLimit: 25,
    weeklyLimit: 100,
    connectsToday: 12,
    connectsThisWeek: 58,
    lastActivity: '2024-02-15T11:45:00Z',
    errorMessage: 'LinkedIn session expired. Please re-authenticate.'
  }
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Alex Chen',
    title: 'CEO & Co-founder',
    company: 'TechVentures Inc',
    linkedinUrl: 'https://linkedin.com/in/alexchen',
    state: 'qualified',
    campaignId: '1',
    campaignName: 'Series A Founders Q1',
    lastMessageAt: '2024-02-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    title: 'VP of Sales',
    company: 'SalesForce Pro',
    linkedinUrl: 'https://linkedin.com/in/mariarodriguez',
    state: 'meeting_booked',
    campaignId: '2',
    campaignName: 'VP Sales Outreach',
    lastMessageAt: '2024-02-14T16:45:00Z'
  },
  {
    id: '3',
    name: 'James Wilson',
    title: 'Founder',
    company: 'DataDriven AI',
    linkedinUrl: 'https://linkedin.com/in/jameswilson',
    state: 'replied',
    campaignId: '1',
    campaignName: 'Series A Founders Q1',
    lastMessageAt: '2024-02-15T09:15:00Z'
  },
  {
    id: '4',
    name: 'Sarah Kim',
    title: 'CTO',
    company: 'DevTools Corp',
    linkedinUrl: 'https://linkedin.com/in/sarahkim',
    state: 'connected',
    campaignId: '3',
    campaignName: 'DevTool CTOs',
    lastMessageAt: '2024-02-13T14:20:00Z'
  },
  {
    id: '5',
    name: 'David Brown',
    title: 'Head of Growth',
    company: 'ScaleUp Studios',
    linkedinUrl: 'https://linkedin.com/in/davidbrown',
    state: 'messaged',
    campaignId: '1',
    campaignName: 'Series A Founders Q1',
    lastMessageAt: '2024-02-15T11:00:00Z'
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    title: 'Director of Engineering',
    company: 'CloudNative Inc',
    linkedinUrl: 'https://linkedin.com/in/lisathompson',
    state: 'disqualified',
    campaignId: '3',
    campaignName: 'DevTool CTOs',
    lastMessageAt: '2024-02-12T08:30:00Z',
    disqualifiedReason: 'Not decision maker'
  },
  {
    id: '7',
    name: 'Michael Zhang',
    title: 'VP Engineering',
    company: 'FinTech Solutions',
    linkedinUrl: 'https://linkedin.com/in/michaelzhang',
    state: 'converted',
    campaignId: '4',
    campaignName: 'Healthcare Tech Leaders',
    lastMessageAt: '2024-02-10T15:30:00Z'
  },
  {
    id: '8',
    name: 'Jennifer Lee',
    title: 'CEO',
    company: 'HealthAI Startup',
    linkedinUrl: 'https://linkedin.com/in/jenniferlee',
    state: 'new',
    campaignId: '1',
    campaignName: 'Series A Founders Q1',
    lastMessageAt: '2024-02-15T08:00:00Z'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    leadId: '1',
    content: "Hi Alex! I noticed you recently raised your Series A - congratulations! I'd love to connect and share some insights on scaling go-to-market strategies that have worked for similar stage companies.",
    sender: 'bot',
    timestamp: '2024-02-13T10:00:00Z'
  },
  {
    id: '2',
    leadId: '1',
    content: "Thanks for reaching out! Always interested in learning from others. What kind of strategies have you seen work best?",
    sender: 'lead',
    timestamp: '2024-02-14T09:30:00Z'
  },
  {
    id: '3',
    leadId: '1',
    content: "Great question! The most successful Series A companies I've worked with focus on three things: 1) Nail your ICP before scaling outbound, 2) Build repeatable playbooks early, and 3) Invest in automation to maintain personalization at scale. Would you be open to a quick call to discuss how this might apply to TechVentures?",
    sender: 'bot',
    timestamp: '2024-02-14T14:00:00Z'
  },
  {
    id: '4',
    leadId: '1',
    content: "That resonates with where we are right now. Sure, let's set up a call. How does next Tuesday look?",
    sender: 'lead',
    timestamp: '2024-02-15T10:30:00Z'
  }
];

export const mockDailyActivity: DailyActivity[] = [
  { date: '2024-02-09', connects: 45, messages: 120, replies: 18, meetings: 3 },
  { date: '2024-02-10', connects: 52, messages: 135, replies: 22, meetings: 4 },
  { date: '2024-02-11', connects: 38, messages: 98, replies: 15, meetings: 2 },
  { date: '2024-02-12', connects: 61, messages: 142, replies: 28, meetings: 5 },
  { date: '2024-02-13', connects: 48, messages: 115, replies: 19, meetings: 3 },
  { date: '2024-02-14', connects: 55, messages: 128, replies: 24, meetings: 4 },
  { date: '2024-02-15', connects: 42, messages: 95, replies: 16, meetings: 2 }
];

export const mockFunnelData = [
  { stage: 'Seeds', count: 2500, dropOff: 0 },
  { stage: 'Connected', count: 1875, dropOff: 25 },
  { stage: 'Messaged', count: 1312, dropOff: 30 },
  { stage: 'Replied', count: 656, dropOff: 50 },
  { stage: 'Qualified', count: 394, dropOff: 40 },
  { stage: 'Meeting', count: 138, dropOff: 65 },
  { stage: 'Converted', count: 69, dropOff: 50 }
];

export const mockAccountLogs = [
  { timestamp: '2024-02-15T14:32:15Z', level: 'info', message: '[Worker] Processing campaign: Series A Founders Q1' },
  { timestamp: '2024-02-15T14:32:18Z', level: 'info', message: '[Browser] Navigating to LinkedIn search results' },
  { timestamp: '2024-02-15T14:32:25Z', level: 'info', message: '[Browser] Found 15 profiles matching criteria' },
  { timestamp: '2024-02-15T14:32:30Z', level: 'info', message: '[Worker] Sending connection request to Alex Chen' },
  { timestamp: '2024-02-15T14:32:35Z', level: 'success', message: '[Worker] Connection request sent successfully' },
  { timestamp: '2024-02-15T14:32:40Z', level: 'info', message: '[Worker] Waiting 45s before next action (rate limit)' },
  { timestamp: '2024-02-15T14:33:25Z', level: 'info', message: '[Worker] Sending connection request to Maria Rodriguez' },
  { timestamp: '2024-02-15T14:33:30Z', level: 'warning', message: '[Worker] Connection request pending - weekly limit approaching (72/100)' },
  { timestamp: '2024-02-15T14:33:35Z', level: 'info', message: '[Browser] Profile view recorded for analytics' },
  { timestamp: '2024-02-15T14:33:40Z', level: 'error', message: '[Browser] Element not found: message-button (retrying...)' },
  { timestamp: '2024-02-15T14:33:45Z', level: 'info', message: '[Browser] Retry successful - element located' }
];

export const mockKPIs = {
  totalLeads: 2847,
  connectionRate: 68.5,
  replyRate: 42.3,
  conversionRate: 12.8,
  activeWorkers: 3,
  connectsToday: 42,
  meetingsBooked: 23,
  revenue: 156000
};

export const mockCampaignPerformance = [
  { name: 'Series A Founders Q1', leads: 500, connected: 342, replied: 145, meetings: 28, conversionRate: 5.6 },
  { name: 'VP Sales Outreach', leads: 300, connected: 198, replied: 87, meetings: 15, conversionRate: 5.0 },
  { name: 'DevTool CTOs', leads: 200, connected: 124, replied: 52, meetings: 8, conversionRate: 4.0 },
  { name: 'Healthcare Tech Leaders', leads: 150, connected: 112, replied: 48, meetings: 12, conversionRate: 8.0 }
];

export const mockReplyRateTrend = [
  { date: '2024-01-15', overall: 38, topCampaign: 45 },
  { date: '2024-01-22', overall: 40, topCampaign: 48 },
  { date: '2024-01-29', overall: 42, topCampaign: 52 },
  { date: '2024-02-05', overall: 41, topCampaign: 50 },
  { date: '2024-02-12', overall: 44, topCampaign: 55 },
  { date: '2024-02-15', overall: 42, topCampaign: 53 }
];

export const mockDealOutcomes = [
  { outcome: 'Won', count: 23, value: 156000 },
  { outcome: 'Lost', count: 12, value: 0 },
  { outcome: 'In Progress', count: 18, value: 98000 },
  { outcome: 'No Decision', count: 8, value: 0 }
];

export const mockHeatmapData = Array.from({ length: 7 }, (_, dayIndex) =>
  Array.from({ length: 24 }, (_, hourIndex) => ({
    day: dayIndex,
    hour: hourIndex,
    value: Math.floor(Math.random() * 100)
  }))
).flat();
