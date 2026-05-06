import fs from 'fs';
import path from 'path';
import LegalPage from '@/components/landing/LegalPage';

export const metadata = {
  title: 'Terms of Service — Organic AI Solutions',
  description: 'Terms governing your use of organicaisolutions.ai and related services.',
};

export default function TermsPage() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'terms.md');
  const content = fs.readFileSync(filePath, 'utf8');
  return <LegalPage title="Terms of Service" content={content} />;
}
