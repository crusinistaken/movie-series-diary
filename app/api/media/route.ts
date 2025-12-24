import { connectToDB } from "@/lib/db";
import Media from "@/models/Media";
import { NextResponse } from "next/server";

// 1. LİSTELEME (GET) - Tüm listeyi getirir
export async function GET() {
  try {
    await connectToDB();
    // En son eklenen en üstte görünsün diye sort kullanıyoruz
    const allMedia = await Media.find().sort({ createdAt: -1 });
    return NextResponse.json({ data: allMedia }, { status: 200 });
  } catch (error) {
    console.error("GET Hatası:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// 2. EKLEME ve GÜNCELLEME (POST)
export async function POST(req: Request) {
  try {
    await connectToDB();
    const data = await req.json();

    // Bu film/dizi veritabanında zaten var mı? (tmdbId ile kontrol)
    const existingMedia = await Media.findOne({ tmdbId: data.tmdbId });

    if (existingMedia) {
      // VARSA GÜNCELLE (Örn: Status değişti, Puan verildi, Bölüm ilerledi)
      const updatedMedia = await Media.findByIdAndUpdate(
        existingMedia._id, 
        data, 
        { new: true } // Güncellenmiş halini geri döndür
      );
      return NextResponse.json({ message: "Updated", data: updatedMedia }, { status: 200 });
    } else {
      // YOKSA YENİ OLUŞTUR
      const newMedia = await Media.create(data);
      return NextResponse.json({ message: "Created", data: newMedia }, { status: 201 });
    }

  } catch (error) {
    console.error("POST Hatası:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// 3. SİLME (DELETE)
export async function DELETE(req: Request) {
  try {
    // URL'den ID'yi al (örn: /api/media?id=12345...)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID gerekli" }, { status: 400 });
    }

    await connectToDB();
    await Media.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Hatası:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}