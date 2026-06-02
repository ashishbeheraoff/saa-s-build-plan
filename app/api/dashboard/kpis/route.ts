import { NextResponse } from "next/server"
import { getDashboardKPIs } from "@/lib/supabase/queries"

export async function GET() {
  try {
    const kpis = await getDashboardKPIs()
    return NextResponse.json(kpis)
  } catch (error) {
    console.error("Error fetching KPIs:", error)
    return NextResponse.json(
      { error: "Failed to fetch KPIs" },
      { status: 500 }
    )
  }
}
