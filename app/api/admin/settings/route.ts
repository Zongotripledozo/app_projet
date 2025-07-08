import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"
import { query } from "@/lib/db"

// GET: fetch platform settings
export const GET = withAuth(async () => {
  try {
    const result = await query("SELECT * FROM settings LIMIT 1")
    const settings = result.rows[0] ?? null
    return NextResponse.json({ settings })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}, { adminRequired: true })

// POST: update platform settings
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json()
    // Update settings (assume id=1)
    const fields = Object.keys(body)
    const values = Object.values(body)
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ")
    const result = await query(
      `UPDATE settings SET ${setClause} WHERE id = 1 RETURNING *`,
      values
    )
    return NextResponse.json({ settings: result.rows[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}, { adminRequired: true })
