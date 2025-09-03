import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { email, senha } = await request.json();

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Check password
  const passwordValid = await bcrypt.compare(senha, user.senha);
  if (!passwordValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Return user data (excluding password)
  const { senha: _, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}
