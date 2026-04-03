import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const SUBS_FILE = path.join(process.cwd(), "content", "subscribers.json")

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  let subscribers: string[] = []
  if (fs.existsSync(SUBS_FILE)) {
    subscribers = JSON.parse(fs.readFileSync(SUBS_FILE, "utf-8"))
  }

  if (!subscribers.includes(email)) {
    subscribers.push(email)
    fs.writeFileSync(SUBS_FILE, JSON.stringify(subscribers, null, 2))
  }

  return NextResponse.json({ ok: true })
}
