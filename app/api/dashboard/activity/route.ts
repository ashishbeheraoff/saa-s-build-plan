import { NextResponse } from "next/server"
import { getDailyActivity } from "@/lib/supabase/queries"

export async function GET() {
  try {
    const activity = await getDailyActivity(7)
    return NextResponse.json(activity)
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    )
  }
}
