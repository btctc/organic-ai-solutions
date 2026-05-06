import fs from 'fs';
import path from 'path';
import LegalPage from '@/components/landing/LegalPage';

export const metadata = {
  title: 'Privacy Policy — Organic AI Solutions',
  description: 'How Organic AI Solutions collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'privacy.md');
  const content = fs.readFileSync(filePath, 'utf8');
  return <LegalPage title="Privacy Policy" content={content} />;
}
