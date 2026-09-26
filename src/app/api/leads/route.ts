import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { isAdminRequest } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email } = body;

    if (typeof fullName !== 'string' || !fullName.trim() || fullName.length > 100 ||
        typeof phone !== 'string' || !/^(?:0|\+84)[0-9]{9}$/.test(phone.replace(/[\s.-]/g, '')) ||
        typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Vui lòng kiểm tra họ tên, số điện thoại Việt Nam và email.' },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.replace(/[\s.-]/g, ''),
        email: email.trim(),
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

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  }
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
