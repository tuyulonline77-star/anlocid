export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or HTML
  image: string;
  category: string;
  author: string;
  publishedAt: string;
  featured?: boolean;
}

export interface Member {
  id: string;
  email: string;
  fullName: string;
  nickname: string;
  birthDate: string; // YYYY-MM-DD
  birthPlace: string;
  address: string;
  phone: string;
  carType: string;
  carYear: string;
  carColor: string;
  plateNumber: string;
  shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export const CATEGORIES = ['News', 'Reviews', 'Events', 'Maintenance', 'Tips'];
export const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];