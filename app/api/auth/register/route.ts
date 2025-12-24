import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Missing fields!" }, { status: 400 });
    }

    await connectToDB();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // ESKİSİ: "Bu kullanıcı adı zaten alınmış."
      return NextResponse.json({ message: "Username already taken." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, password: hashedPassword });

    return NextResponse.json({ message: "Registration successful!" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}