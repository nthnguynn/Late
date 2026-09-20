import ClientPage from './ClientPage';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Home() {
  const config = await prisma.config.findUnique({
    where: { id: 'global' },
  });

  const zaloLink = config?.zaloLink || '#';

  return (
    <ClientPage initialZaloLink={zaloLink} />
  );
}
