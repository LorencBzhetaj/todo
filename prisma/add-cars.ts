import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cars = [
    {
      name: 'Maybach S 580',
      brandName: 'Mercedes-Maybach',
      model: 'S 580 4MATIC',
      description: 'The pinnacle of luxury. Handcrafted interior, rear-seat entertainment, and a twin-turbo V8. The ultimate chauffeur experience.',
      price: 350,
      imageUrl: '/maybach.jpg',
      extraImages: [],
    },
    {
      name: 'R8 V10',
      brandName: 'Audi',
      model: 'R8 V10 Performance',
      description: 'Mid-engine supercar with a naturally aspirated 5.2L V10. Pure driving emotion wrapped in Audi precision.',
      price: 280,
      imageUrl: '/r8.jpg',
      extraImages: [],
    },
    {
      name: 'Range Rover',
      brandName: 'Land Rover',
      model: 'Range Rover Autobiography',
      description: 'The definitive luxury SUV. Supreme comfort on any terrain, executive-class interior, and commanding road presence.',
      price: 220,
      imageUrl: '/range.jpg',
      extraImages: ['/range2.jpg'],
    },
    {
      name: 'S-Class',
      brandName: 'Mercedes-Benz',
      model: 'S 500 Long',
      description: 'The benchmark of the automotive world. Intelligent drive, MBUX Hyperscreen, and first-class rear comfort.',
      price: 200,
      imageUrl: '/s.jpg',
      extraImages: ['/s2.jpg'],
    },
    {
      name: 'Ghost',
      brandName: 'Rolls-Royce',
      model: 'Ghost Extended',
      description: 'Post Opulent design philosophy. Whisper-quiet cabin, bespoke options, and unmatched British craftsmanship.',
      price: 500,
      imageUrl: '/rolls.jpg',
      extraImages: [],
    },
  ];

  for (const { extraImages, ...data } of cars) {
    const existing = await prisma.car.findFirst({ where: { name: data.name, brandName: data.brandName } });
    if (existing) {
      console.log(`⏭  Already exists: ${data.brandName} ${data.name}`);
      continue;
    }
    const car = await prisma.car.create({ data });
    for (const url of extraImages) {
      await prisma.carImage.create({ data: { carId: car.id, imageUrl: url } });
    }
    console.log(`✅ Created: ${data.brandName} ${data.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
