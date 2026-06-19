import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ORDER = [
  { brandName: 'Mercedes-Maybach', imageUrl: '/maybach.jpg', position: 1 },
  { brandName: 'Rolls-Royce',      imageUrl: '/rolls.jpg',   position: 2 },
  { brandName: 'Audi',             imageUrl: '/r8.jpg',      position: 3 },
  { brandName: 'Mercedes-Benz',    imageUrl: '/s.jpg',       position: 4 },
  { brandName: 'Mercedes-Benz',    imageUrl: '/s2.jpg',      position: 5 },
  { brandName: 'Land Rover',       imageUrl: '/range.jpg',   position: 6 },
  { brandName: 'Land Rover',       imageUrl: '/range2.jpg',  position: 7 },
  { brandName: 'Mercedes-Benz',    imageUrl: '/cls.jpg',     position: 8 },
  { brandName: 'Audi',             imageUrl: '/audi.jpg',    position: 9 },
  { brandName: 'Porsche',          imageUrl: '/porsche.jpg', position: 10 },
];

async function main() {
  for (const { brandName, imageUrl, position } of ORDER) {
    const car = await prisma.car.findFirst({ where: { brandName, imageUrl } });
    if (!car) { console.log(`⚠️  Not found: ${brandName} ${imageUrl}`); continue; }
    await prisma.car.update({ where: { id: car.id }, data: { position } });
    console.log(`✅ Position ${position}: ${car.brandName} ${car.name}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
