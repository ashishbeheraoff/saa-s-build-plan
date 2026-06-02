import { NextResponse } from "next/server"
import { getLeads } from "@/lib/supabase/queries"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId") || undefined
    const status = searchParams.get("status") as "new" | "contacted" | "replied" | "meeting" | "converted" | "unsubscribed" | undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined

    const leads = await getLeads({ campaignId, status, limit })
    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    )
  }
}
