import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Fix Range Rover — remove range2 extra image, make it a separate car
  const range1 = await prisma.car.findFirst({ where: { brandName: 'Land Rover', imageUrl: '/range.jpg' } });
  if (range1) {
    await prisma.carImage.deleteMany({ where: { carId: range1.id, imageUrl: '/range2.jpg' } });
    // Update price so it ranks above Porsche in popular cars
    await prisma.car.update({ where: { id: range1.id }, data: { price: 270, model: 'Range Rover Autobiography – Black' } });
    console.log('✅ Fixed Range Rover (removed extra image, updated price to 270)');
  }

  // 2. Add Range Rover as separate car (range2.jpg)
  const range2Exists = await prisma.car.findFirst({ where: { imageUrl: '/range2.jpg' } });
  if (!range2Exists) {
    await prisma.car.create({
      data: {
        name: 'Range Rover',
        brandName: 'Land Rover',
        model: 'Range Rover Autobiography – White',
        description: 'The definitive luxury SUV in stunning white. Supreme comfort on any terrain, executive-class interior, and commanding road presence.',
        price: 265,
        imageUrl: '/range2.jpg',
      },
    });
    console.log('✅ Created Range Rover (range2.jpg)');
  } else {
    console.log('⏭  Range Rover (range2) already exists');
  }

  // 3. Fix S-Class — remove s2 extra image, make it a separate car
  const s1 = await prisma.car.findFirst({ where: { brandName: 'Mercedes-Benz', imageUrl: '/s.jpg' } });
  if (s1) {
    await prisma.carImage.deleteMany({ where: { carId: s1.id, imageUrl: '/s2.jpg' } });
    await prisma.car.update({ where: { id: s1.id }, data: { model: 'S 500 Long – Black' } });
    console.log('✅ Fixed S-Class (removed extra image)');
  }

  // 4. Add S-Class as separate car (s2.jpg)
  const s2Exists = await prisma.car.findFirst({ where: { imageUrl: '/s2.jpg' } });
  if (!s2Exists) {
    await prisma.car.create({
      data: {
        name: 'S-Class',
        brandName: 'Mercedes-Benz',
        model: 'S 500 Long – White',
        description: 'The benchmark of the automotive world in elegant white. Intelligent drive, MBUX Hyperscreen, and first-class rear comfort.',
        price: 195,
        imageUrl: '/s2.jpg',
      },
    });
    console.log('✅ Created S-Class (s2.jpg)');
  } else {
    console.log('⏭  S-Class (s2) already exists');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
