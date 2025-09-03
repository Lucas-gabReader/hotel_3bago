import { NextResponse } from "next/server";

export async function POST() {
  // In a real application, you would invalidate the session/token here
  // For now, we'll just return success
  return NextResponse.json({ message: "Logged out successfully" });
}
