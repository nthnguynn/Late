import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    let config = await prisma.config.findUnique({
      where: { id: 'global' },
    });

    if (!config) {
      config = await prisma.config.create({
        data: { id: 'global', zaloLink: '' },
      });
    }

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi lấy config:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi máy chủ' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { zaloLink } = body;

    const config = await prisma.config.upsert({
      where: { id: 'global' },
      update: { zaloLink },
      create: { id: 'global', zaloLink },
    });

    return NextResponse.json({ success: true, config }, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi lưu config:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi máy chủ' },
      { status: 500 }
    );
  }
}
