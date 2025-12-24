import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, currentPassword, newPassword } = await req.json();

    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json({ message: "Eksik bilgi." }, { status: 400 });
    }

    await connectToDB();

    // 1. Kullanıcıyı bul
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // 2. Eski şifre doğru mu?
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Mevcut şifre yanlış!" }, { status: 400 });
    }

    // 3. Yeni şifreyi hashle ve kaydet
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Şifre başarıyla güncellendi." }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
}