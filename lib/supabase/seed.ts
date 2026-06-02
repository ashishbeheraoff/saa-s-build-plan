"use server"

import { createClient } from "./server"

// Sample data that mimics the mock data structure
export async function seedDatabaseForUser(userId: string) {
  const supabase = await createClient()

  // Create accounts
  const accountsData = [
    {
      user_id: userId,
      name: "John Smith",
      platform: "gmail" as const,
      status: "active" as const,
      email: "john.smith@company.com",
      sent_today: 18,
      daily_limit: 25,
      health_score: 95,
      last_activity: new Date().toISOString(),
    },
    {
      user_id: userId,
      name: "Sarah Jones",
      platform: "outlook" as const,
      status: "active" as const,
      email: "sarah.jones@company.com",
      sent_today: 12,
      daily_limit: 20,
      health_score: 88,
      last_activity: new Date().toISOString(),
    },
    {
      user_id: userId,
      name: "Mike Wilson",
      platform: "linkedin" as const,
      status: "paused" as const,
      email: "mike.wilson@company.com",
      sent_today: 0,
      daily_limit: 30,
      health_score: 72,
      last_activity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: userId,
      name: "Emma Davis",
      platform: "twitter" as const,
      status: "disconnected" as const,
      email: "emma.davis@company.com",
      sent_today: 0,
      daily_limit: 25,
      health_score: 45,
      last_activity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const { data: accounts, error: accountsError } = await supabase
    .from("accounts")
    .insert(accountsData)
    .select()

  if (accountsError) {
    console.error("Error seeding accounts:", accountsError)
    throw accountsError
  }

  // Create campaigns
  const campaignsData = [
    {
      user_id: userId,
      name: "Series A Founders Q1",
      status: "active" as const,
      type: "outbound" as const,
      total_leads: 500,
      contacted: 342,
      replied: 145,
      meetings: 28,
      reply_rate: 42.4,
      open_rate: 68.5,
      start_date: "2024-01-15",
    },
    {
      user_id: userId,
      name: "VP Sales Outreach",
      status: "active" as const,
      type: "outbound" as const,
      total_leads: 300,
      contacted: 198,
      replied: 87,
      meetings: 15,
      reply_rate: 43.9,
      open_rate: 72.0,
      start_date: "2024-01-20",
    },
    {
      user_id: userId,
      name: "DevTool CTOs",
      status: "paused" as const,
      type: "nurture" as const,
      total_leads: 200,
      contacted: 124,
      replied: 52,
      meetings: 8,
      reply_rate: 41.9,
      open_rate: 65.0,
      start_date: "2024-01-10",
    },
    {
      user_id: userId,
      name: "Healthcare Tech Leaders",
      status: "completed" as const,
      type: "outbound" as const,
      total_leads: 150,
      contacted: 150,
      replied: 48,
      meetings: 12,
      reply_rate: 32.0,
      open_rate: 58.0,
      start_date: "2023-12-01",
      end_date: "2024-01-31",
    },
    {
      user_id: userId,
      name: "E-commerce Founders",
      status: "draft" as const,
      type: "follow-up" as const,
      total_leads: 250,
      contacted: 0,
      replied: 0,
      meetings: 0,
      reply_rate: 0,
      open_rate: 0,
    },
  ]

  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .insert(campaignsData)
    .select()

  if (campaignsError) {
    console.error("Error seeding campaigns:", campaignsError)
    throw campaignsError
  }

  // Create leads (linked to campaigns)
  const leadsData = [
    {
      user_id: userId,
      campaign_id: campaigns[0].id,
      name: "Alex Chen",
      email: "alex.chen@techventures.com",
      company: "TechVentures Inc",
      title: "CEO & Co-founder",
      status: "replied" as const,
      score: 85,
      last_contacted: new Date().toISOString(),
    },
    {
      user_id: userId,
      campaign_id: campaigns[1].id,
      name: "Maria Rodriguez",
      email: "maria@salesforcepro.com",
      company: "SalesForce Pro",
      title: "VP of Sales",
      status: "meeting" as const,
      score: 92,
      last_contacted: new Date().toISOString(),
    },
    {
      user_id: userId,
      campaign_id: campaigns[0].id,
      name: "James Wilson",
      email: "james@datadriven.ai",
      company: "DataDriven AI",
      title: "Founder",
      status: "replied" as const,
      score: 78,
      last_contacted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: userId,
      campaign_id: campaigns[2].id,
      name: "Sarah Kim",
      email: "sarah.kim@devtools.corp",
      company: "DevTools Corp",
      title: "CTO",
      status: "contacted" as const,
      score: 65,
      last_contacted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: userId,
      campaign_id: campaigns[0].id,
      name: "David Brown",
      email: "david@scaleup.studios",
      company: "ScaleUp Studios",
      title: "Head of Growth",
      status: "contacted" as const,
      score: 72,
      last_contacted: new Date().toISOString(),
    },
    {
      user_id: userId,
      campaign_id: campaigns[2].id,
      name: "Lisa Thompson",
      email: "lisa@cloudnative.inc",
      company: "CloudNative Inc",
      title: "Director of Engineering",
      status: "unsubscribed" as const,
      score: 25,
      last_contacted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: userId,
      campaign_id: campaigns[3].id,
      name: "Michael Zhang",
      email: "michael@fintech.solutions",
      company: "FinTech Solutions",
      title: "VP Engineering",
      status: "converted" as const,
      score: 98,
      last_contacted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: userId,
      campaign_id: campaigns[0].id,
      name: "Jennifer Lee",
      email: "jennifer@healthai.startup",
      company: "HealthAI Startup",
      title: "CEO",
      status: "new" as const,
      score: 50,
    },
  ]

  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .insert(leadsData)
    .select()

  if (leadsError) {
    console.error("Error seeding leads:", leadsError)
    throw leadsError
  }

  // Create notifications
  const notificationsData = [
    {
      user_id: userId,
      type: "reply" as const,
      title: "New Reply",
      message: "Alex Chen replied to your outreach message",
      read: false,
      lead_id: leads[0].id,
      campaign_id: campaigns[0].id,
    },
    {
      user_id: userId,
      type: "meeting" as const,
      title: "Meeting Booked",
      message: "Maria Rodriguez booked a meeting for Tuesday at 2pm",
      read: false,
      lead_id: leads[1].id,
      campaign_id: campaigns[1].id,
    },
    {
      user_id: userId,
      type: "system" as const,
      title: "Campaign Completed",
      message: "Healthcare Tech Leaders campaign has reached all leads",
      read: true,
      campaign_id: campaigns[3].id,
    },
    {
      user_id: userId,
      type: "warning" as const,
      title: "Account Health Low",
      message: "Emma Davis account health dropped below 50%. Consider reconnecting.",
      read: false,
    },
    {
      user_id: userId,
      type: "reply" as const,
      title: "New Reply",
      message: "James Wilson is interested in scheduling a call",
      read: false,
      lead_id: leads[2].id,
      campaign_id: campaigns[0].id,
    },
  ]

  const { error: notificationsError } = await supabase
    .from("notifications")
    .insert(notificationsData)

  if (notificationsError) {
    console.error("Error seeding notifications:", notificationsError)
    throw notificationsError
  }

  // Create daily activity data (last 7 days)
  const dailyActivityData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dailyActivityData.push({
      user_id: userId,
      date: date.toISOString().split("T")[0],
      emails_sent: Math.floor(Math.random() * 50) + 30,
      replies_received: Math.floor(Math.random() * 25) + 10,
      meetings_booked: Math.floor(Math.random() * 5) + 1,
      new_leads: Math.floor(Math.random() * 20) + 5,
    })
  }

  const { error: activityError } = await supabase
    .from("daily_activity")
    .insert(dailyActivityData)

  if (activityError) {
    console.error("Error seeding daily activity:", activityError)
    throw activityError
  }

  // Create account logs for activity graph
  const accountLogsData = []
  for (const account of accounts!) {
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      accountLogsData.push({
        user_id: userId,
        account_id: account.id,
        date: date.toISOString().split("T")[0],
        emails_sent: account.status === "active" ? Math.floor(Math.random() * 20) + 5 : 0,
      })
    }
  }

  const { error: accountLogsError } = await supabase
    .from("account_logs")
    .insert(accountLogsData)

  if (accountLogsError) {
    console.error("Error seeding account logs:", accountLogsError)
    throw accountLogsError
  }

  return {
    accounts: accounts?.length || 0,
    campaigns: campaigns?.length || 0,
    leads: leads?.length || 0,
    notifications: notificationsData.length,
    dailyActivity: dailyActivityData.length,
    accountLogs: accountLogsData.length,
  }
}

export async function checkIfUserHasData(userId: string) {
  const supabase = await createClient()
  
  const { count } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  return (count ?? 0) > 0
}
