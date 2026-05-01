import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { BADGE_DEFINITIONS } from '../src/utils/badges.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@awssbggeu.in' },
    update: {},
    create: {
      email: 'admin@awssbggeu.in',
      passwordHash: adminPassword,
      name: 'Pawan Joshi',
      role: 'ADMIN',
      referralCode: 'ADMIN001',
      bio: 'Student Builder Group Lead'
    }
  });
  console.log('✓ Admin user created:', admin.email);

  // Create a sample member
  const memberPassword = await bcrypt.hash('member123456', 12);
  const member = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      email: 'member@example.com',
      passwordHash: memberPassword,
      name: 'Test Member',
      role: 'MEMBER',
      referralCode: 'MEMBER01',
      bio: 'A test member account'
    }
  });
  console.log('✓ Member user created:', member.email);

  // Create a sample event
  const event = await prisma.event.upsert({
    where: { id: 'seed-event-1' },
    update: {},
    create: {
      id: 'seed-event-1',
      title: "CLOUD IGNITE '26",
      description: 'Official inauguration of AWS Student Builder Group GEU with expert talks, live AWS demos, an interactive quiz, and networking.',
      date: new Date('2026-03-28T11:30:00+05:30'),
      location: 'Seminar Hall, CSIT Block, Graphic Era University, Dehradun',
      registrationLink: 'https://forms.gle/8qRq2BJUPNJ6aRkj8',
      pointsReward: 50,
      createdById: admin.id
    }
  });
  console.log('✓ Sample event created:', event.title);

  // Create sample resources
  const resources = [
    { title: 'AWS Cloud Practitioner Essentials', description: 'Free AWS training course for beginners', url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', category: 'Cloud', pointsReward: 20 },
    { title: 'React Official Tutorial', description: 'Learn React from the official docs', url: 'https://react.dev/learn', category: 'FullStack', pointsReward: 20 },
    { title: 'Introduction to Generative AI', description: 'AWS Skill Builder course on GenAI fundamentals', url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/17176/introduction-to-generative-ai-art-of-the-possible', category: 'AI', pointsReward: 20 },
  ];

  for (const r of resources) {
    await prisma.resource.upsert({
      where: { id: `seed-resource-${r.category.toLowerCase()}` },
      update: {},
      create: { id: `seed-resource-${r.category.toLowerCase()}`, ...r, createdById: admin.id }
    });
  }
  console.log('✓ Sample resources created');

  // Create a sample announcement
  await prisma.announcement.upsert({
    where: { id: 'seed-announcement-1' },
    update: {},
    create: {
      id: 'seed-announcement-1',
      title: 'Welcome to AWS Student Builder Group GEU!',
      body: 'We are excited to launch the member portal. Explore events, earn points, and start your builder journey today.',
      priority: 'HIGH',
      createdById: admin.id
    }
  });
  console.log('✓ Sample announcement created');

  // Seed badges
  for (const badge of BADGE_DEFINITIONS) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: badge
    });
  }
  console.log(`✓ ${BADGE_DEFINITIONS.length} badges seeded`);

  console.log('\n✅ Seed complete!');
  console.log('─────────────────────────────────');
  console.log('Admin login:  admin@awssbggeu.in / admin123456');
  console.log('Member login: member@example.com / member123456');
  console.log('─────────────────────────────────');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
