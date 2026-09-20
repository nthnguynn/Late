import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email } = body;

    if (!fullName || !phone || !email) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        fullName,
        phone,
        email,
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Lỗi khi lưu lead:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi máy chủ' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lead:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi máy chủ' },
      { status: 500 }
    );
  }
}
