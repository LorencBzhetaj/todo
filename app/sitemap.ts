import { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://automart.al';
  return [
    { url: base,                changeFrequency: 'weekly',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/cars`,      changeFrequency: 'daily',   priority: 0.9, lastModified: new Date() },
    { url: `${base}/about`,     changeFrequency: 'monthly', priority: 0.7, lastModified: new Date() },
    { url: `${base}/contact`,   changeFrequency: 'monthly', priority: 0.7, lastModified: new Date() },
  ];
}
