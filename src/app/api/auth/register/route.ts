import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { nome, email, senha, role } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        role,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Erro interno ao criar conta" }, { status: 500 });
  }
}
