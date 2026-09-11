import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'ClientFlow_Rules_Boundaries_Responsibilities.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 45, bottom: 50, left: 50, right: 50 },
  bufferPages: true
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colors
const PRIMARY = '#1E3A8A';   // Dark Blue
const SECONDARY = '#3B82F6'; // Blue
const ACCENT = '#10B981';    // Emerald green
const TEXT_DARK = '#1F2937'; // Slate 800
const TEXT_MUTED = '#4B5563';// Slate 600
const BG_LIGHT = '#F3F4F6';  // Light Gray
const BORDER_COLOR = '#E5E7EB';

function drawHeaderBanner(title, subtitle) {
  doc.rect(50, 45, 495, 75).fill(PRIMARY);
  doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text(title, 65, 60);
  doc.fillColor('#93C5FD').fontSize(11).font('Helvetica').text(subtitle, 65, 90);
  doc.moveDown(2);
  doc.y = 135;
}

function drawSectionHeading(heading) {
  doc.moveDown(0.8);
  const y = doc.y;
  doc.rect(50, y, 4, 18).fill(SECONDARY);
  doc.fillColor(PRIMARY).fontSize(14).font('Helvetica-Bold').text(heading, 62, y + 2);
  doc.moveDown(0.6);
}

function drawSubHeading(subheading) {
  doc.moveDown(0.4);
  doc.fillColor(SECONDARY).fontSize(11).font('Helvetica-Bold').text(subheading);
  doc.moveDown(0.2);
}

function drawParagraph(text) {
  doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica').lineGap(2).text(text);
  doc.moveDown(0.4);
}

function drawBullet(title, description) {
  doc.fillColor(PRIMARY).fontSize(9.5).font('Helvetica-Bold').text('• ' + title + ': ', { continued: true });
  doc.fillColor(TEXT_DARK).font('Helvetica').text(description);
  doc.moveDown(0.25);
}

function drawRoleBox(roleName, badgeColor, description, duties, boundaries) {
  const startY = doc.y;
  
  doc.fillColor(badgeColor).fontSize(12).font('Helvetica-Bold').text(`Role: ${roleName}`);
  doc.moveDown(0.2);
  doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica-Oblique').text(description);
  doc.moveDown(0.4);

  doc.fillColor(PRIMARY).fontSize(10).font('Helvetica-Bold').text('Core Responsibilities:');
  duties.forEach(d => drawBullet(d.title, d.desc));
  
  doc.moveDown(0.3);
  doc.fillColor('#DC2626').fontSize(10).font('Helvetica-Bold').text('Boundaries & Restrictions:');
  boundaries.forEach(b => drawBullet(b.title, b.desc));
  
  doc.moveDown(0.8);
}

// ---------------- PAGE 1 ----------------
drawHeaderBanner('ClientFlow System Architecture & Guide', 'Rules, Boundaries, Roles & Operational Standard Operating Procedure (SOP)');

drawSectionHeading('1. Executive Overview & System Purpose');
drawParagraph('ClientFlow is an end-to-end MERN stack Onboarding & Client Management Platform designed to streamline the lifecycle between agencies, consulting teams, and onboarding clients. It enforces deterministic progression across client registration, proposal/contract execution, onboarding steps, asset exchange, and financial settlements.');

drawSectionHeading('2. How The System Works (Lifecycle Workflow)');
drawSubHeading('Phase 1: Client Creation & Setup');
drawParagraph('Administrators or Team Members initiate client records in the system. A designated project is spawned with custom configurations, initial timezone setting, and an assigned Team Member.');

drawSubHeading('Phase 2: Contract Execution & Compliance');
drawParagraph('A contract package is drafted and versioned with SHA hashes. The system dispatches digital execution requests. The client or authorized administrator executes the signature through the integrated e-signature module.');

drawSubHeading('Phase 3: Financial Clearance (Invoices & Payments)');
drawParagraph('Prior to or alongside kickoff, milestone invoices are generated. Payments can be confirmed manually or via mock automated webhook triggers.');

drawSubHeading('Phase 4: Multi-Step Interactive Onboarding');
drawParagraph('Clients progress step-by-step through customized onboarding workflows (Welcome, Information Collection, Credential Handover, Requirement Review). Each step validates required inputs before allowing completion.');

drawSubHeading('Phase 5: Asset Exchange & Completion Review');
drawParagraph('Clients upload required brand identity assets and documentation via strict mime-type verified upload pipelines. Team Members review submitted onboarding instances and issue formal approvals or revision requests.');

// ---------------- PAGE 2 ----------------
doc.addPage();
drawHeaderBanner('Role Matrix & Boundaries', 'Detailed Permissions, Operational Scopes & Security Fences');

drawSectionHeading('3. Role Matrix & Responsibilities');

drawRoleBox(
  'Administrator (Admin)',
  '#4F46E5',
  'Total operational governance and control over the platform, users, and audit records.',
  [
    { title: 'User Governance', desc: 'Create, suspend, and configure Admin, Team Member, and Client accounts.' },
    { title: 'System-Wide Monitoring', desc: 'Inspect financial health, audit logs, overall project delivery, and system statistics.' },
    { title: 'Contract & Invoice Oversight', desc: 'Issue invoices, draft contracts, override approval states, and handle exceptions.' }
  ],
  [
    { title: 'No Password Access', desc: 'Cannot retrieve cleartext user passwords; only resets can be triggered.' },
    { title: 'Immutable Audit Logs', desc: 'Cannot delete or alter append-only audit trail entries.' }
  ]
);

drawRoleBox(
  'Team Member',
  '#059669',
  'Dedicated project delivery specialists driving client onboarding and review processes.',
  [
    { title: 'Project Management', desc: 'Manage assigned client workspaces, track project milestones, and update statuses.' },
    { title: 'Onboarding Review', desc: 'Review submitted client onboarding documentation, approve steps, or request revisions.' },
    { title: 'Client Collaboration', desc: 'Monitor asset uploads, dispatch invoices, and maintain milestone communication.' }
  ],
  [
    { title: 'No User Administration', desc: 'Strictly prohibited from creating user accounts or editing global system settings.' },
    { title: 'Project Scope Restriction', desc: 'Restricted from modifying projects outside their assigned operational territory.' }
  ]
);

drawRoleBox(
  'Client User',
  '#D97706',
  'External stakeholder interacting with assigned project workspaces and workflows.',
  [
    { title: 'Execution & Compliance', desc: 'Digitally execute contracts and fulfill invoicing obligations.' },
    { title: 'Onboarding Submissions', desc: 'Fill out required wizard questions, provide brand details, and upload assets.' }
  ],
  [
    { title: 'Strict Workspace Isolation', desc: 'Zero access to other client data, other projects, internal logs, or global invoices.' },
    { title: 'Read-Only Administrative Fields', desc: 'Cannot adjust template structures, change assigned team members, or alter financial totals.' }
  ]
);

// ---------------- PAGE 3 ----------------
doc.addPage();
drawHeaderBanner('Operational Rules & Best Practices', 'Security Policies, Step Protocols, and Data Handling Rules');

drawSectionHeading('4. Rules to Follow (System Operational Policies)');

drawSubHeading('Authentication & Session Governance');
drawBullet('HttpOnly Security', 'All sessions rely on strict SameSite HttpOnly cookies. Never attempt to inject tokens into client localStorage.');
drawBullet('Access Credentials', 'Admin credentials (admin@clientflow.com) must be stored in secure vaults and rotated upon personnel changes.');
drawBullet('Password Hygiene', 'Passwords must satisfy complexity checks and bcrypt salted hashing.');

drawSubHeading('Data Integrity & Audit Compliance');
drawBullet('Append-Only Logging', 'Every state transition (CREATE, UPDATE, ARCHIVE, SIGN, REVIEW) triggers an immutable audit log entry.');
drawBullet('Idempotent Invoicing', 'Invoice reference numbers are unique and must follow INV-{timestamp} or predefined sequential indexing.');
drawBullet('Contract Hash Verification', 'Every contract upload generates an immutable version hash preventing document repudiation.');

drawSubHeading('Asset Handling & Validation Guidelines');
drawBullet('Strict File Allowlist', 'Only supported file types (PDF, PNG, JPG, DOCX, XLSX, ZIP) under 10MB are accepted by the pipeline.');
drawBullet('UUID Sanitization', 'Uploaded files are randomized using UUIDv4 filenames to completely eliminate directory traversal and collision risks.');

drawSectionHeading('5. Quick Reference: Seed Login Accounts');

const tableTop = doc.y + 10;
doc.rect(50, tableTop, 495, 22).fill(PRIMARY);
doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold');
doc.text('Role', 60, tableTop + 6);
doc.text('Email Identifier', 180, tableTop + 6);
doc.text('Default Password', 350, tableTop + 6);

const rows = [
  { role: 'Administrator', email: 'admin@clientflow.com', pass: 'Admin@123' },
  { role: 'Team Member 1', email: 'team1@clientflow.com', pass: 'password123' },
  { role: 'Team Member 2', email: 'team2@clientflow.com', pass: 'password123' },
  { role: 'Client Stakeholder', email: 'client@clientflow.com', pass: 'password123' }
];

let currY = tableTop + 22;
rows.forEach((r, idx) => {
  const bg = idx % 2 === 0 ? BG_LIGHT : '#FFFFFF';
  doc.rect(50, currY, 495, 20).fill(bg);
  doc.fillColor(TEXT_DARK).fontSize(9).font('Helvetica');
  doc.text(r.role, 60, currY + 5);
  doc.text(r.email, 180, currY + 5);
  doc.text(r.pass, 350, currY + 5);
  currY += 20;
});

doc.rect(50, tableTop, 495, currY - tableTop).stroke(BORDER_COLOR);

doc.moveDown(3);
doc.fillColor(TEXT_MUTED).fontSize(8.5).font('Helvetica-Oblique').text('Generated automatically by ClientFlow System Architecture Suite. Confidential - For Internal & Client Use Only.', 50, 780, { align: 'center', width: 495 });

// Finalize PDF file
doc.end();

writeStream.on('finish', () => {
  console.log('PDF successfully written to:', outputPath);
});
