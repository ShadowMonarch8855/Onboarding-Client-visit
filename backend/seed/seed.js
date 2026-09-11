import mongoose from 'mongoose';
import { env } from '../config/env.js';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Project from '../models/Project.js';
import OnboardingTemplateVersion from '../models/OnboardingTemplateVersion.js';
import Invoice from '../models/Invoice.js';
import Notification from '../models/Notification.js';

const seedData = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear data
    await mongoose.connection.dropDatabase();
    console.log('Database dropped.');

    // Users
    const admin = await User.create({ name: 'Admin User', email: 'admin@clientflow.com', password: 'Admin@123', role: 'admin' });
    const team1 = await User.create({ name: 'Team One', email: 'team1@clientflow.com', password: 'password123', role: 'team_member' });
    const team2 = await User.create({ name: 'Team Two', email: 'team2@clientflow.com', password: 'password123', role: 'team_member' });
    const clientUser = await User.create({ name: 'Client User', email: 'client@clientflow.com', password: 'password123', role: 'client' });
    console.log('Users created.');

    // Clients
    const c1 = await Client.create({ companyName: 'Acme Corp', contactName: 'John Doe', email: 'john@acme.com', phone: '+1 (555) 234-5678' });
    const c2 = await Client.create({ companyName: 'Globex Inc', contactName: 'Jane Smith', email: 'jane@globex.com', phone: '+1 (555) 876-5432' });
    const c3 = await Client.create({ companyName: 'Initech Tech', contactName: 'Bill Lumbergh', email: 'bill@initech.com', phone: '+1 (555) 987-6543' });
    console.log('Clients created.');

    // Projects
    const p1 = await Project.create({ client: c1._id, name: 'Website Redesign & Onboarding', status: 'in_progress', assignedUser: team1._id });
    const p2 = await Project.create({ client: c2._id, name: 'Mobile App Discovery & Kickoff', status: 'ready_to_start', assignedUser: team2._id });
    const p3 = await Project.create({ client: c3._id, name: 'Enterprise Cloud Migration', status: 'draft', assignedUser: team1._id });
    console.log('Projects created.');

    // -------------------------------------------------------------
    // INDUSTRY-STANDARD ONBOARDING TEMPLATES
    // -------------------------------------------------------------
    
    // 1. Client Visit & Strategic Onboarding Template
    await OnboardingTemplateVersion.create({
      name: 'Client Onsite Visit & Executive Onboarding',
      category: 'client_visit',
      description: 'Standardized 6-step blueprint for VIP client visits, stakeholder meetings, agenda confirmation, and executive project kickoff.',
      templateId: new mongoose.Types.ObjectId(),
      versionNo: 1,
      status: 'active',
      steps: [
        {
          title: 'Welcome & Visit Logistics Setup',
          description: 'Confirm visiting stakeholder attendee roster, dates of visit, travel accommodation requirements, and dietary restrictions.',
          type: 'form',
          placeholder: 'Enter names of visiting executives, expected arrival flight/dates, and local transport/hotel preferences...',
          required: true,
          position: 1
        },
        {
          title: 'Strategic Goals & Agenda Alignment',
          description: 'Share the primary organizational goals, KPIs, and key agenda items to be tackled during the onsite sessions.',
          type: 'questionnaire',
          placeholder: 'List the top 3 success criteria and key agenda priorities for the upcoming sessions...',
          required: true,
          position: 2
        },
        {
          title: 'Brand Assets & Media Kit Upload',
          description: 'Upload high-resolution logos, brand guidelines, deck templates, and presentation collaterals for the visit.',
          type: 'document',
          placeholder: 'Provide links or note confirmation of brand collateral and digital assets provided...',
          required: true,
          position: 3
        },
        {
          title: 'Systems & Facility Security Access',
          description: 'Verify NDA execution, visitor security badges, guest Wi-Fi pre-authorization, and secure demo platform access.',
          type: 'credentials',
          placeholder: 'Specify ID verification types and technical demo environments to pre-configure...',
          required: false,
          position: 4
        },
        {
          title: 'Executive Workshop & Session Sign-off',
          description: 'Review and sign off on the workshop outcomes, finalized scope deliverables, and assigned team leads.',
          type: 'approval',
          placeholder: 'Confirm agreement on workshop findings and deliverable action items...',
          required: true,
          position: 5
        },
        {
          title: 'Formal Project Kickoff & Milestone Plan',
          description: 'Final transition into active sprint execution with confirmed calendar milestones and recurring sync cadence.',
          type: 'general',
          placeholder: 'Set recurring weekly sync schedule, emergency escalation contacts, and milestone target dates...',
          required: true,
          position: 6
        }
      ]
    });

    // 2. Full-Stack Software Development Kickoff Template
    await OnboardingTemplateVersion.create({
      name: 'Software Engineering & Agile Development Kickoff',
      category: 'software_dev',
      description: 'Comprehensive technical onboarding for web, mobile, and cloud software engineering engagements.',
      templateId: new mongoose.Types.ObjectId(),
      versionNo: 1,
      status: 'active',
      steps: [
        {
          title: 'Technical Stakeholders & RACI Matrix',
          description: 'Identify Product Owner, Technical Lead, QA Contact, and Deployment Approver.',
          type: 'form',
          placeholder: 'List contact details for Product Owner, DevOps lead, and security compliance officer...',
          required: true,
          position: 1
        },
        {
          title: 'Repository, Cloud & API Access Provisioning',
          description: 'Share access credentials or invites for GitHub/GitLab, AWS/GCP, staging domains, and third-party APIs.',
          type: 'credentials',
          placeholder: 'Note GitHub usernames, cloud IAM roles, and sandbox API keys or invite statuses...',
          required: true,
          position: 2
        },
        {
          title: 'Architecture Review & Requirements Specification',
          description: 'Review system architecture diagrams, user personas, third-party integration constraints, and tech stack choices.',
          type: 'questionnaire',
          placeholder: 'Summarize core architectural constraints, approved database engines, and authentication standards...',
          required: true,
          position: 3
        },
        {
          title: 'CI/CD & Environment Definition',
          description: 'Define staging, UAT, and production deployment policies and automated testing requirements.',
          type: 'document',
          placeholder: 'Specify environment branching models, automated test coverage targets, and release schedule...',
          required: false,
          position: 4
        },
        {
          title: 'Sprint 1 Scope Agreement & Kickoff',
          description: 'Finalize initial backlog grooming, estimate user stories, and initiate first two-week sprint.',
          type: 'approval',
          placeholder: 'Acknowledge approved Sprint 1 backlog commitments and definition of done (DoD)...',
          required: true,
          position: 5
        }
      ]
    });

    // 3. Digital Marketing & Brand Growth Onboarding
    await OnboardingTemplateVersion.create({
      name: 'Digital Marketing & Growth Acceleration',
      category: 'digital_marketing',
      description: 'Streamlined onboarding for SEO, paid media, performance marketing, and creative asset handoff.',
      templateId: new mongoose.Types.ObjectId(),
      versionNo: 1,
      status: 'active',
      steps: [
        {
          title: 'Business Goals & ICP Discovery',
          description: 'Document target audience, customer pain points, average order value (AOV), and customer lifetime value (LTV).',
          type: 'questionnaire',
          placeholder: 'Specify Ideal Customer Profile (ICP), core value propositions, and competitor benchmarks...',
          required: true,
          position: 1
        },
        {
          title: 'Ad Accounts & Analytics Access',
          description: 'Provide partner access to Google Analytics 4, Google Ads, Meta Business Suite, and Tag Manager.',
          type: 'credentials',
          placeholder: 'List account IDs and confirmation of agency partner access granted...',
          required: true,
          position: 2
        },
        {
          title: 'Creative Assets & Copywriting Guidelines',
          description: 'Share brand fonts, color palettes, vector graphics, product imagery, and brand tone guidelines.',
          type: 'document',
          placeholder: 'Provide links to creative drive, brand book, and photography repository...',
          required: true,
          position: 3
        },
        {
          title: 'Budget Allocation & KPI Dashboard Agreement',
          description: 'Confirm monthly media spend, target ROAS/CAC, and reporting dashboard cadence.',
          type: 'approval',
          placeholder: 'Confirm media budget allocations across channels and reporting timeline...',
          required: true,
          position: 4
        }
      ]
    });

    console.log('3 Onboarding Templates successfully seeded.');

    // Invoices
    await Invoice.create({ project: p1._id, invoiceNumber: 'INV-1001', amount: 5000, dueDate: new Date(Date.now() + 14 * 86400000), status: 'sent' });
    await Invoice.create({ project: p2._id, invoiceNumber: 'INV-1002', amount: 8000, dueDate: new Date(Date.now() + 30 * 86400000), status: 'draft' });
    console.log('Invoices created.');

    // Notifications
    await Notification.create({ user: admin._id, type: 'info', title: 'System Ready', message: 'ClientFlow seeded with 3 industry onboarding templates.' });
    console.log('Notifications created.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
