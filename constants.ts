// In a real app, this would be process.env.NEXT_PUBLIC_API_URL
// For this demo, we use a simulation flag
export const IS_DEMO_MODE = true; 

export const API_BASE = '/api';

export const MOCK_ARTICLES = [
  {
    id: '1',
    title: 'The Future of Electric Sports Cars',
    slug: 'future-electric-sports-cars',
    excerpt: 'Exploring the shift from combustion engines to high-torque electric motors in modern racing.',
    content: 'Full content goes here...',
    image: 'https://picsum.photos/seed/car1/800/600',
    category: 'News',
    author: 'Admin',
    publishedAt: new Date().toISOString(),
    featured: true,
  },
  {
    id: '2',
    title: 'Maintenance Tips for Vintage Classics',
    slug: 'maintenance-vintage-classics',
    excerpt: 'How to keep your old school ride running smooth in the modern era.',
    content: 'Full content goes here...',
    image: 'https://picsum.photos/seed/car2/800/600',
    category: 'Maintenance',
    author: 'Admin',
    publishedAt: new Date().toISOString(),
    featured: false,
  },
  {
    id: '3',
    title: 'Annual Grand Tour 2024 Recap',
    slug: 'grand-tour-2024-recap',
    excerpt: 'A look back at the most exciting moments from our yearly cross-country gathering.',
    content: 'Full content goes here...',
    image: 'https://picsum.photos/seed/car3/800/600',
    category: 'Events',
    author: 'Admin',
    publishedAt: new Date().toISOString(),
    featured: false,
  },
];