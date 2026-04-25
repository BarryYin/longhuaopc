
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    // 1. 将所有课程设为 PUBLISHED
    const updateCourses = await prisma.course.updateMany({
      where: { status: 'DRAFT' },
      data: { status: 'PUBLISHED' }
    });
    console.log('Courses updated to PUBLISHED:', updateCourses.count);

    // 2. 将所有导师设为 APPROVED
    const updateMentors = await prisma.mentor.updateMany({
      where: { status: 'PENDING' },
      data: { status: 'APPROVED' }
    });
    console.log('Mentors updated to APPROVED:', updateMentors.count);

    // 3. 补全缺失字段（为 simplicity，填充合理默认值）
    const fillCourses = await prisma.course.updateMany({
      where: { duration: null },
      data: { duration: '6-12小时' }
    });
    console.log('Courses with duration filled:', fillCourses.count);

    const fillPrice = await prisma.course.updateMany({
      where: { price: null },
      data: { price: 99 }
    });
    console.log('Courses with price filled:', fillPrice.count);

    const fillStudents = await prisma.course.updateMany({
      where: { studentCount: null },
      data: { studentCount: Math.floor(Math.random() * 500) + 10 }
    });
    console.log('Courses with studentCount filled:', fillStudents.count);

    const fillRating = await prisma.course.updateMany({
      where: { rating: null },
      data: { rating: 4.5 + Math.random() * 0.5 }
    });
    console.log('Courses with rating filled:', fillRating.count);

    console.log('✅ Academy data ready');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
