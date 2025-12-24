import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    await connectToDB();

    const user = await User.findOne({ username });
    if (!user) {
      // ESKİSİ: "Kullanıcı bulunamadı."
      return NextResponse.json({ message: "User not found." }, { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      // ESKİSİ: "Şifre yanlış."
      return NextResponse.json({ message: "Incorrect password." }, { status: 400 });
    }

    return NextResponse.json({ message: "Login successful", user: { username: user.username, id: user._id } }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}