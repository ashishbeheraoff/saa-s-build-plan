"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "./server"
import type { Account, Campaign, Lead, Notification } from "./queries"

// ============================================
// ACCOUNT MUTATIONS
// ============================================

export async function createAccount(data: {
  name: string
  platform: Account["platform"]
  email?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Not authenticated")

  const { data: account, error } = await supabase
    .from("accounts")
    .insert({
      user_id: user.id,
      name: data.name,
      platform: data.platform,
      email: data.email,
      status: "active",
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/accounts")
  return account as Account
}

export async function updateAccount(id: string, data: Partial<Pick<Account, "name" | "status" | "daily_limit">>) {
  const supabase = await createClient()

  const { data: account, error } = await supabase
    .from("accounts")
    .update(data)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/accounts")
  return account as Account
}

export async function deleteAccount(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("id", id)

  if (error) throw error

  revalidatePath("/accounts")
}

// ============================================
// CAMPAIGN MUTATIONS
// ============================================

export async function createCampaign(data: {
  name: string
  type?: Campaign["type"]
  total_leads?: number
  start_date?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Not authenticated")

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert({
      user_id: user.id,
      name: data.name,
      type: data.type || "outbound",
      total_leads: data.total_leads || 0,
      start_date: data.start_date,
      status: "draft",
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/campaigns")
  return campaign as Campaign
}

export async function updateCampaign(id: string, data: Partial<Pick<Campaign, "name" | "status" | "type" | "total_leads" | "start_date" | "end_date">>) {
  const supabase = await createClient()

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .update(data)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/campaigns")
  return campaign as Campaign
}

export async function deleteCampaign(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("campaigns")
    .delete()
    .eq("id", id)

  if (error) throw error

  revalidatePath("/campaigns")
}

// ============================================
// LEAD MUTATIONS
// ============================================

export async function createLead(data: {
  name: string
  email: string
  company?: string
  title?: string
  campaign_id?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Not authenticated")

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      user_id: user.id,
      name: data.name,
      email: data.email,
      company: data.company,
      title: data.title,
      campaign_id: data.campaign_id,
      status: "new",
      score: 50,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/leads")
  return lead as Lead
}

export async function updateLead(id: string, data: Partial<Pick<Lead, "name" | "email" | "company" | "title" | "status" | "score" | "campaign_id">>) {
  const supabase = await createClient()

  const { data: lead, error } = await supabase
    .from("leads")
    .update(data)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/leads")
  return lead as Lead
}

export async function deleteLead(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)

  if (error) throw error

  revalidatePath("/leads")
}

// ============================================
// NOTIFICATION MUTATIONS
// ============================================

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)

  if (error) throw error

  revalidatePath("/")
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false)

  if (error) throw error

  revalidatePath("/")
}

export async function deleteNotification(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", id)

  if (error) throw error

  revalidatePath("/")
}

export async function createNotification(data: {
  type: Notification["type"]
  title: string
  message: string
  lead_id?: string
  campaign_id?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Not authenticated")

  const { data: notification, error } = await supabase
    .from("notifications")
    .insert({
      user_id: user.id,
      type: data.type,
      title: data.title,
      message: data.message,
      lead_id: data.lead_id,
      campaign_id: data.campaign_id,
      read: false,
    })
    .select()
    .single()

  if (error) throw error

  return notification as Notification
}

// ============================================
// PROFILE MUTATIONS
// ============================================

export async function updateProfile(data: { full_name?: string; avatar_url?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", user.id)

  if (error) throw error

  revalidatePath("/")
}

// ============================================
// DAILY ACTIVITY MUTATIONS
// ============================================

export async function incrementDailyActivity(field: "emails_sent" | "replies_received" | "meetings_booked" | "new_leads") {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Not authenticated")

  const today = new Date().toISOString().split("T")[0]

  // Try to update existing record
  const { data: existing } = await supabase
    .from("daily_activity")
    .select("id, " + field)
    .eq("user_id", user.id)
    .eq("date", today)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("daily_activity")
      .update({ [field]: (existing[field] as number) + 1 })
      .eq("id", existing.id)

    if (error) throw error
  } else {
    // Create new record
    const { error } = await supabase
      .from("daily_activity")
      .insert({
        user_id: user.id,
        date: today,
        [field]: 1,
      })

    if (error) throw error
  }

  revalidatePath("/analytics")
}
