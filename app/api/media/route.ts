import { connectToDB } from "@/lib/db";
import Media from "@/models/Media";
import { NextResponse } from "next/server";

// 1. LİSTELEME (GET) - Sadece giriş yapanınkileri getir
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // URL'den userId'yi al

    if (!userId) {
      return NextResponse.json({ data: [] }); // ID yoksa boş liste dön
    }

    await connectToDB();
    // Sadece bu userId'ye sahip olanları bul
    const userMedia = await Media.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ data: userMedia }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// 2. EKLEME / GÜNCELLEME (POST)
export async function POST(req: Request) {
  try {
    await connectToDB();
    const data = await req.json();

    // userId kontrolü
    if (!data.userId) {
      return NextResponse.json({ message: "User ID missing" }, { status: 400 });
    }

    // Bu kullanıcı bu filmi daha önce eklemiş mi?
    const existingMedia = await Media.findOne({ 
      tmdbId: data.tmdbId, 
      userId: data.userId // <-- ÖNEMLİ: Sadece kendi listesinde ara
    });

    if (existingMedia) {
      const updatedMedia = await Media.findByIdAndUpdate(existingMedia._id, data, { new: true });
      return NextResponse.json({ message: "Updated", data: updatedMedia }, { status: 200 });
    } else {
      const newMedia = await Media.create(data);
      return NextResponse.json({ message: "Created", data: newMedia }, { status: 201 });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// 3. SİLME (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "ID gerekli" }, { status: 400 });

    await connectToDB();
    await Media.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}