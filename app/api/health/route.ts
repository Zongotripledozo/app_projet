import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"

export async function GET() {
  try {
    const dbStatus = await testConnection()

    return NextResponse.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      database: dbStatus ? "Connected" : "Disconnected",
      environment: "Local SQLite",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "ERROR",
        error: "Service unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
