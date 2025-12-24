import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json({ message: "Eksik bilgi." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Şifre en az 6 karakter olmalı." }, { status: 400 });
    }

    await connectToDB();

    // 1. Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // 2. Yeni şifreyi şifrele (Hash)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Veritabanına kaydet
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
}