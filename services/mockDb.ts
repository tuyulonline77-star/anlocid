
import { Article, Member, SiteSettings } from '../types';
import { IS_DEMO_MODE, API_BASE, MOCK_ARTICLES } from '../constants';

// --- LOCAL STORAGE KEYS (DEMO ONLY) ---
const KEY_ARTICLES = 'autoblog_articles';
const KEY_MEMBERS = 'autoblog_members';
const KEY_SETTINGS = 'autoblog_settings';
const KEY_AUTH = 'autoblog_auth';

// --- HELPER: MOCK DELAY ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- HELPER: INITIALIZE MOCK DATA ---
const initMock = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(KEY_ARTICLES)) {
    localStorage.setItem(KEY_ARTICLES, JSON.stringify(MOCK_ARTICLES));
  }
  if (!localStorage.getItem(KEY_SETTINGS)) {
    const defaultSettings: SiteSettings = {
      heroTitle: 'Experience the Thrill of the Drive',
      heroSubtitle: 'Join the most exclusive automotive community in the country.',
      heroImage: 'https://picsum.photos/seed/hero/1920/1080',
    };
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(defaultSettings));
  }
};

// ==========================================
// ARTICLE SERVICES
// ==========================================

export const getArticles = async (): Promise<Article[]> => {
  if (IS_DEMO_MODE) {
    initMock();
    await delay(300);
    const data = localStorage.getItem(KEY_ARTICLES);
    return data ? JSON.parse(data) : [];
  } else {
    const res = await fetch(`${API_BASE}/articles`);
    return res.json();
  }
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  if (IS_DEMO_MODE) {
    const articles = await getArticles();
    return articles.find(a => a.slug === slug);
  } else {
    const res = await fetch(`${API_BASE}/articles/${slug}`);
    if (!res.ok) return undefined;
    return res.json();
  }
};

export const saveArticle = async (article: Article): Promise<void> => {
  if (IS_DEMO_MODE) {
    const articles = await getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index >= 0) articles[index] = article;
    else articles.unshift(article);
    localStorage.setItem(KEY_ARTICLES, JSON.stringify(articles));
    await delay(300);
  } else {
    const isNew = !article.id || article.id.length < 5; // Simple check
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `${API_BASE}/articles` : `${API_BASE}/articles/${article.id}`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  if (IS_DEMO_MODE) {
    const articles = await getArticles();
    const filtered = articles.filter(a => a.id !== id);
    localStorage.setItem(KEY_ARTICLES, JSON.stringify(filtered));
  } else {
    await fetch(`${API_BASE}/articles/${id}`, { method: 'DELETE' });
  }
};

// ==========================================
// MEMBER SERVICES
// ==========================================

export const createMember = async (member: any): Promise<void> => {
  if (IS_DEMO_MODE) {
    initMock();
    const members = JSON.parse(localStorage.getItem(KEY_MEMBERS) || '[]');
    const newMember: Member = {
      ...member,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    members.unshift(newMember);
    localStorage.setItem(KEY_MEMBERS, JSON.stringify(members));
    await delay(500);
  } else {
    await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
  }
};

export const getMembers = async (): Promise<Member[]> => {
  if (IS_DEMO_MODE) {
    initMock();
    await delay(300);
    return JSON.parse(localStorage.getItem(KEY_MEMBERS) || '[]');
  } else {
    // In real app, include Auth Token header here
    const res = await fetch(`${API_BASE}/members`);
    return res.json();
  }
};

export const updateMemberStatus = async (id: string, status: Member['status']): Promise<void> => {
  if (IS_DEMO_MODE) {
    const members = await getMembers();
    const member = members.find(m => m.id === id);
    if (member) {
      member.status = status;
      localStorage.setItem(KEY_MEMBERS, JSON.stringify(members));
    }
  } else {
    await fetch(`${API_BASE}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }
};

// ==========================================
// SETTINGS & UPLOAD SERVICES
// ==========================================

export const getSettings = async (): Promise<SiteSettings> => {
  if (IS_DEMO_MODE) {
    initMock();
    return JSON.parse(localStorage.getItem(KEY_SETTINGS)!);
  } else {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  }
};

export const saveSettings = async (settings: SiteSettings): Promise<void> => {
  if (IS_DEMO_MODE) {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
    await delay(300);
  } else {
    await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  }
};

// Upload function - Returns URL
export const uploadImage = async (file: File): Promise<string> => {
    if (IS_DEMO_MODE) {
        await delay(1000);
        // Fake upload, return a dummy placeholder or object URL
        return URL.createObjectURL(file); 
    } else {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        return data.url;
    }
}

// ==========================================
// AUTH SERVICES
// ==========================================

export const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
  if (IS_DEMO_MODE) {
    await delay(500);
    if (email === 'admin@demo.com' && pass === 'password') {
      localStorage.setItem(KEY_AUTH, 'true');
      return true;
    }
    return false;
  } else {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
    });
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem(KEY_AUTH, data.token); // Store real token
        return true;
    }
    return false;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem(KEY_AUTH);
};

export const isAdminLoggedIn = (): boolean => {
  return !!localStorage.getItem(KEY_AUTH);
};
