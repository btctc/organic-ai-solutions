import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://organicaisolutions.ai';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/assessment`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ];
}
