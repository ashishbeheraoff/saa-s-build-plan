"use server"

import { createClient } from "./server"

// Types matching our database schema
export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  platform: "gmail" | "outlook" | "linkedin" | "twitter"
  status: "active" | "paused" | "disconnected"
  email: string | null
  avatar: string | null
  sent_today: number
  daily_limit: number
  health_score: number
  connected_at: string
  last_activity: string
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  user_id: string
  name: string
  status: "active" | "paused" | "completed" | "draft"
  type: "outbound" | "nurture" | "follow-up"
  total_leads: number
  contacted: number
  replied: number
  meetings: number
  reply_rate: number
  open_rate: number
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  user_id: string
  campaign_id: string | null
  name: string
  email: string
  company: string | null
  title: string | null
  status: "new" | "contacted" | "replied" | "meeting" | "converted" | "unsubscribed"
  score: number
  last_contacted: string | null
  avatar: string | null
  created_at: string
  updated_at: string
  campaign?: Campaign
}

export interface Message {
  id: string
  user_id: string
  lead_id: string
  account_id: string | null
  direction: "outbound" | "inbound"
  subject: string | null
  body: string | null
  status: "draft" | "scheduled" | "sent" | "delivered" | "opened" | "clicked" | "replied" | "bounced"
  sent_at: string | null
  opened_at: string | null
  replied_at: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: "reply" | "meeting" | "system" | "warning"
  title: string
  message: string
  read: boolean
  lead_id: string | null
  campaign_id: string | null
  created_at: string
}

export interface DailyActivity {
  id: string
  user_id: string
  date: string
  emails_sent: number
  replies_received: number
  meetings_booked: number
  new_leads: number
}

export interface AccountLog {
  id: string
  user_id: string
  account_id: string
  date: string
  emails_sent: number
}

// ============================================
// PROFILE QUERIES
// ============================================

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data as Profile
}

// ============================================
// ACCOUNT QUERIES
// ============================================

export async function getAccounts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching accounts:", error)
    return []
  }

  return data as Account[]
}

export async function getAccount(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching account:", error)
    return null
  }

  return data as Account
}

export async function getAccountStats() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("accounts")
    .select("status, health_score, sent_today, daily_limit")

  if (error) {
    console.error("Error fetching account stats:", error)
    return { total: 0, active: 0, avgHealth: 0, totalSentToday: 0, totalDailyLimit: 0 }
  }

  const accounts = data as Account[]
  return {
    total: accounts.length,
    active: accounts.filter(a => a.status === "active").length,
    avgHealth: accounts.length > 0 
      ? Math.round(accounts.reduce((sum, a) => sum + a.health_score, 0) / accounts.length)
      : 0,
    totalSentToday: accounts.reduce((sum, a) => sum + a.sent_today, 0),
    totalDailyLimit: accounts.reduce((sum, a) => sum + a.daily_limit, 0),
  }
}

// ============================================
// CAMPAIGN QUERIES
// ============================================

export async function getCampaigns() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching campaigns:", error)
    return []
  }

  return data as Campaign[]
}

export async function getCampaign(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching campaign:", error)
    return null
  }

  return data as Campaign
}

export async function getCampaignStats() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("campaigns")
    .select("status, total_leads, contacted, replied, meetings, reply_rate")

  if (error) {
    console.error("Error fetching campaign stats:", error)
    return { total: 0, active: 0, totalLeads: 0, totalReplies: 0, totalMeetings: 0, avgReplyRate: 0 }
  }

  const campaigns = data as Campaign[]
  return {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === "active").length,
    totalLeads: campaigns.reduce((sum, c) => sum + c.total_leads, 0),
    totalReplies: campaigns.reduce((sum, c) => sum + c.replied, 0),
    totalMeetings: campaigns.reduce((sum, c) => sum + c.meetings, 0),
    avgReplyRate: campaigns.length > 0
      ? Math.round((campaigns.reduce((sum, c) => sum + Number(c.reply_rate), 0) / campaigns.length) * 10) / 10
      : 0,
  }
}

// ============================================
// LEAD QUERIES
// ============================================

export async function getLeads(options?: { campaignId?: string; status?: Lead["status"]; limit?: number }) {
  const supabase = await createClient()
  
  let query = supabase
    .from("leads")
    .select("*, campaign:campaigns(id, name)")
    .order("created_at", { ascending: false })

  if (options?.campaignId) {
    query = query.eq("campaign_id", options.campaignId)
  }

  if (options?.status) {
    query = query.eq("status", options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching leads:", error)
    return []
  }

  return data as (Lead & { campaign: { id: string; name: string } | null })[]
}

export async function getLead(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("leads")
    .select("*, campaign:campaigns(id, name)")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching lead:", error)
    return null
  }

  return data as Lead & { campaign: { id: string; name: string } | null }
}

export async function getLeadStats() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("leads")
    .select("status, score")

  if (error) {
    console.error("Error fetching lead stats:", error)
    return { total: 0, new: 0, contacted: 0, replied: 0, meetings: 0, converted: 0 }
  }

  const leads = data as Lead[]
  return {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    replied: leads.filter(l => l.status === "replied").length,
    meetings: leads.filter(l => l.status === "meeting").length,
    converted: leads.filter(l => l.status === "converted").length,
  }
}

// ============================================
// MESSAGE QUERIES
// ============================================

export async function getMessages(leadId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching messages:", error)
    return []
  }

  return data as Message[]
}

// ============================================
// NOTIFICATION QUERIES
// ============================================

export async function getNotifications(options?: { unreadOnly?: boolean; limit?: number }) {
  const supabase = await createClient()
  
  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })

  if (options?.unreadOnly) {
    query = query.eq("read", false)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data as Notification[]
}

export async function getUnreadNotificationCount() {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("read", false)

  if (error) {
    console.error("Error fetching unread count:", error)
    return 0
  }

  return count ?? 0
}

// ============================================
// ANALYTICS QUERIES
// ============================================

export async function getDailyActivity(days: number = 7) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from("daily_activity")
    .select("*")
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching daily activity:", error)
    return []
  }

  return data as DailyActivity[]
}

export async function getAccountLogs(accountId?: string, days: number = 7) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  let query = supabase
    .from("account_logs")
    .select("*")
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

  if (accountId) {
    query = query.eq("account_id", accountId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching account logs:", error)
    return []
  }

  return data as AccountLog[]
}

// ============================================
// DASHBOARD KPI QUERIES
// ============================================

export async function getDashboardKPIs() {
  const supabase = await createClient()
  
  // Get counts in parallel
  const [
    { count: totalLeads },
    { count: totalCampaigns },
    { data: campaignData },
    { data: activityData },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("campaigns").select("*", { count: "exact", head: true }),
    supabase.from("campaigns").select("reply_rate, meetings"),
    supabase.from("daily_activity").select("emails_sent, replies_received, meetings_booked").order("date", { ascending: false }).limit(7),
  ])

  const campaigns = campaignData as Campaign[] || []
  const activity = activityData as DailyActivity[] || []

  const avgReplyRate = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + Number(c.reply_rate), 0) / campaigns.length
    : 0

  const totalMeetings = campaigns.reduce((sum, c) => sum + c.meetings, 0)

  const weeklyEmailsSent = activity.reduce((sum, a) => sum + a.emails_sent, 0)
  const weeklyReplies = activity.reduce((sum, a) => sum + a.replies_received, 0)

  return {
    totalLeads: totalLeads ?? 0,
    totalCampaigns: totalCampaigns ?? 0,
    avgReplyRate: Math.round(avgReplyRate * 10) / 10,
    totalMeetings,
    weeklyEmailsSent,
    weeklyReplies,
    conversionRate: totalLeads && totalLeads > 0 
      ? Math.round((totalMeetings / totalLeads) * 1000) / 10 
      : 0,
  }
}
