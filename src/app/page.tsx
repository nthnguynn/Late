import ClientPage from './ClientPage';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Lỗi database (thiếu DATABASE_URL, chưa tạo bảng...) không được làm sập cả trang
  let zaloLink = '#';
  try {
    const config = await prisma.config.findUnique({
      where: { id: 'global' },
    });
    zaloLink = config?.zaloLink || '#';
  } catch (error) {
    console.error('Không đọc được cấu hình Zalo từ database:', error);
  }

  return (
    <ClientPage initialZaloLink={zaloLink} />
  );
}
