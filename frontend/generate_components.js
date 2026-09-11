const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src');

const filesToCreate = {
  // Onboarding
  'components/Onboarding/ProgressBar.jsx': `import React from 'react';\nimport styles from './ProgressBar.module.css';\n\nconst ProgressBar = ({ progress }) => (\n  <div className={styles.container}>\n    <div className={styles.bar} style={{ width: \`\${progress}%\` }}></div>\n    <span className={styles.label}>{progress}%</span>\n  </div>\n);\n\nexport default ProgressBar;`,
  'components/Onboarding/ProgressBar.module.css': `.container { background: var(--color-background); border-radius: 9999px; height: 20px; width: 100%; position: relative; overflow: hidden; }\n.bar { background: var(--color-primary); height: 100%; transition: width 0.3s ease; }\n.label { position: absolute; top: 0; left: 50%; transform: translateX(-50%); font-size: 0.75rem; color: white; line-height: 20px; font-weight: bold; }`,

  // Invoices
  'components/Invoices/InvoiceForm.jsx': `import React from 'react';\nexport default () => <div>InvoiceForm</div>;`,
  'components/Invoices/InvoiceForm.module.css': ``,
  'components/Invoices/InvoiceTable.jsx': `import React from 'react';\nexport default () => <div>InvoiceTable</div>;`,
  'components/Invoices/InvoiceTable.module.css': ``,

  // Contracts
  'components/Contracts/ContractUpload.jsx': `import React from 'react';\nexport default () => <div>ContractUpload</div>;`,
  'components/Contracts/ContractUpload.module.css': ``,
  'components/Contracts/SignaturePanel.jsx': `import React from 'react';\nexport default () => <div>SignaturePanel</div>;`,
  'components/Contracts/SignaturePanel.module.css': ``,

  // Assets
  'components/Assets/FileUploader.jsx': `import React from 'react';\nexport default () => <div>FileUploader</div>;`,
  'components/Assets/FileUploader.module.css': ``,
  'components/Assets/AssetGallery.jsx': `import React from 'react';\nexport default () => <div>AssetGallery</div>;`,
  'components/Assets/AssetGallery.module.css': ``,

  // Pages
  'pages/LoginPage.jsx': `import React, { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';\nimport { useAuth } from '../hooks/useAuth';\nimport styles from './LoginPage.module.css';\n\nexport default function LoginPage() {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const { login } = useAuth();\n  const navigate = useNavigate();\n\n  const handleSubmit = async (e) => {\n    e.preventDefault();\n    try {\n      await login(email, password);\n      navigate('/');\n    } catch (err) {}\n  };\n\n  return (\n    <div className={styles.container}>\n      <form className={styles.form} onSubmit={handleSubmit}>\n        <h2>Login to ClientFlow</h2>\n        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />\n        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />\n        <button type="submit" className="btn btn-primary">Login</button>\n      </form>\n    </div>\n  );\n}`,
  'pages/LoginPage.module.css': `.container { display: flex; align-items: center; justify-content: center; height: 100vh; background: var(--color-background); }\n.form { background: white; padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow-md); display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 400px; }\n.form input { padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--border-radius); }`,
  
  'pages/ForgotPasswordPage.jsx': `import React from 'react';\nexport default () => <div>ForgotPasswordPage</div>;`,
  'pages/ForgotPasswordPage.module.css': ``,
  
  'pages/DashboardPage.jsx': `import React from 'react';\nimport StatCard from '../components/Dashboard/StatCard';\nimport ProgressChart from '../components/Dashboard/ProgressChart';\nimport RecentActivity from '../components/Dashboard/RecentActivity';\nimport styles from './DashboardPage.module.css';\n\nexport default function DashboardPage() {\n  return (\n    <div className={styles.grid}>\n      <StatCard title="Total Clients" value="24" />\n      <StatCard title="Active Projects" value="12" />\n      <StatCard title="Pending Invoices" value="3" />\n      <div style={{ gridColumn: '1 / -1' }}><ProgressChart data={[{name: 'A', progress: 50}]} /></div>\n    </div>\n  );\n}`,
  'pages/DashboardPage.module.css': `.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }`,
  
  'pages/ClientsPage.jsx': `import React from 'react';\nexport default () => <div>ClientsPage</div>;`,
  'pages/ClientsPage.module.css': ``,
  
  'pages/ClientDetailPage.jsx': `import React from 'react';\nexport default () => <div>ClientDetailPage</div>;`,
  'pages/ClientDetailPage.module.css': ``,
  
  'pages/ProjectsPage.jsx': `import React from 'react';\nexport default () => <div>ProjectsPage</div>;`,
  'pages/ProjectsPage.module.css': ``,
  
  'pages/ProjectDetailPage.jsx': `import React from 'react';\nexport default () => <div>ProjectDetailPage</div>;`,
  'pages/ProjectDetailPage.module.css': ``,
  
  'pages/InvoicesPage.jsx': `import React from 'react';\nexport default () => <div>InvoicesPage</div>;`,
  'pages/InvoicesPage.module.css': ``,
  
  'pages/ContractsPage.jsx': `import React from 'react';\nexport default () => <div>ContractsPage</div>;`,
  'pages/ContractsPage.module.css': ``,
  
  'pages/OnboardingPage.jsx': `import React from 'react';\nexport default () => <div>OnboardingPage</div>;`,
  'pages/OnboardingPage.module.css': ``,
  
  'pages/AssetsPage.jsx': `import React from 'react';\nexport default () => <div>AssetsPage</div>;`,
  'pages/AssetsPage.module.css': ``,
  
  'pages/NotificationsPage.jsx': `import React from 'react';\nexport default () => <div>NotificationsPage</div>;`,
  'pages/NotificationsPage.module.css': ``,
  
  'pages/UsersPage.jsx': `import React from 'react';\nexport default () => <div>UsersPage</div>;`,
  'pages/UsersPage.module.css': ``,
  
  'pages/ReportsPage.jsx': `import React from 'react';\nexport default () => <div>ReportsPage</div>;`,
  'pages/ReportsPage.module.css': ``,

  'App.jsx': `import React from 'react';\nimport { Routes, Route } from 'react-router-dom';\nimport AppLayout from './components/Layout/AppLayout';\nimport ProtectedRoute from './components/Layout/ProtectedRoute';\nimport LoginPage from './pages/LoginPage';\nimport DashboardPage from './pages/DashboardPage';\nimport ClientsPage from './pages/ClientsPage';\nimport ProjectsPage from './pages/ProjectsPage';\n\nfunction App() {\n  return (\n    <Routes>\n      <Route path="/login" element={<LoginPage />} />\n      <Route element={<ProtectedRoute />}>\n        <Route element={<AppLayout />}>\n          <Route path="/" element={<DashboardPage />} />\n          <Route path="/clients" element={<ClientsPage />} />\n          <Route path="/projects" element={<ProjectsPage />} />\n          <Route path="*" element={<div>Page not found or not yet implemented in mock</div>} />\n        </Route>\n      </Route>\n    </Routes>\n  );\n}\n\nexport default App;`
};

Object.entries(filesToCreate).forEach(([relPath, content]) => {
  const fullPath = path.join(basePath, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log('Created:', relPath);
});
