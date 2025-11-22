import { PrismaClient, UserRole, IncidentType, IncidentSeverity, SubscriptionPlan } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Acme Manufacturing company
  const company = await prisma.company.create({
    data: {
      name: 'Acme Manufacturing',
      plan: SubscriptionPlan.Growth,
      subscriptionStatus: 'active',
    },
  });

  console.log('Created company:', company.name);

  // Create sites
  const site1 = await prisma.site.create({
    data: {
      companyId: company.id,
      name: 'Main Production Facility',
      address: '123 Industrial Blvd, Manufacturing City, MC 12345',
      coordsLat: 40.7128,
      coordsLng: -74.0060,
    },
  });

  const site2 = await prisma.site.create({
    data: {
      companyId: company.id,
      name: 'Warehouse & Distribution',
      address: '456 Logistics Way, Manufacturing City, MC 12345',
      coordsLat: 40.7580,
      coordsLng: -74.0390,
    },
  });

  console.log('Created sites:', site1.name, site2.name);

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users: Yusuf (Admin), Aisha (Manager), Raj (Supervisor)
  const yusuf = await prisma.user.create({
    data: {
      companyId: company.id,
      name: 'Yusuf Ahmed',
      email: 'yusuf@acmemanufacturing.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  const aisha = await prisma.user.create({
    data: {
      companyId: company.id,
      name: 'Aisha Patel',
      email: 'aisha@acmemanufacturing.com',
      password: hashedPassword,
      role: UserRole.MANAGER,
    },
  });

  const raj = await prisma.user.create({
    data: {
      companyId: company.id,
      name: 'Raj Kumar',
      email: 'raj@acmemanufacturing.com',
      password: hashedPassword,
      role: UserRole.SUPERVISOR,
    },
  });

  console.log('Created users: Yusuf, Aisha, Raj');

  // Create inspection templates
  const template1 = await prisma.inspectionTemplate.create({
    data: {
      name: 'Daily Safety Walkthrough',
      description: 'Standard daily safety inspection checklist',
      isGlobal: false,
      schema: {
        items: [
          {
            id: '1',
            question: 'Are all emergency exits clear and accessible?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '2',
            question: 'Are fire extinguishers properly mounted and accessible?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '3',
            question: 'Are walkways clear of obstructions?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '4',
            question: 'Are safety signs visible and legible?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '5',
            question: 'Are personal protective equipment stations properly stocked?',
            type: 'yes_no',
            required: true,
          },
        ],
      },
    },
  });

  const template2 = await prisma.inspectionTemplate.create({
    data: {
      name: 'Weekly Equipment Inspection',
      description: 'Weekly inspection of production equipment',
      isGlobal: false,
      schema: {
        items: [
          {
            id: '1',
            question: 'Are all machine guards in place?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '2',
            question: 'Are emergency stop buttons functional?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '3',
            question: 'Are there any visible leaks or damage?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '4',
            question: 'Is equipment properly lubricated?',
            type: 'yes_no',
            required: false,
          },
          {
            id: '5',
            question: 'Are warning labels intact and readable?',
            type: 'yes_no',
            required: true,
          },
        ],
      },
    },
  });

  const template3 = await prisma.inspectionTemplate.create({
    data: {
      name: 'Monthly Facility Audit',
      description: 'Comprehensive monthly facility safety audit',
      isGlobal: false,
      schema: {
        items: [
          {
            id: '1',
            question: 'Is the facility compliant with all safety regulations?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '2',
            question: 'Are all safety training records up to date?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '3',
            question: 'Are hazardous materials properly stored and labeled?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '4',
            question: 'Is the ventilation system functioning properly?',
            type: 'yes_no',
            required: true,
          },
          {
            id: '5',
            question: 'Are electrical panels accessible and properly labeled?',
            type: 'yes_no',
            required: true,
          },
        ],
      },
    },
  });

  console.log('Created 3 inspection templates');

  // Create sample incidents
  const incident1 = await prisma.incident.create({
    data: {
      companyId: company.id,
      siteId: site1.id,
      reporterId: raj.id,
      reporterName: raj.name,
      type: IncidentType.hazard,
      severity: IncidentSeverity.medium,
      description: 'Spilled liquid on floor near production line 3. Area marked with warning signs.',
      coordsLat: 40.7128,
      coordsLng: -74.0060,
      photos: ['https://example.com/photo1.jpg'],
      status: 'new',
    },
  });

  const incident2 = await prisma.incident.create({
    data: {
      companyId: company.id,
      siteId: site1.id,
      reporterId: raj.id,
      reporterName: raj.name,
      type: IncidentType.near_miss,
      severity: IncidentSeverity.low,
      description: 'Worker almost tripped over loose cable. Cable has been secured.',
      coordsLat: 40.7130,
      coordsLng: -74.0062,
      status: 'closed',
    },
  });

  console.log('Created sample incidents');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

