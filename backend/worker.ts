
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/d1';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { eq, desc } from 'drizzle-orm';

// --- Type Definitions for Cloudflare Environment ---
interface D1Database {
  prepare(query: string): any;
  dump(): Promise<ArrayBuffer>;
  batch(statements: any[]): Promise<any[]>;
  exec(query: string): Promise<any>;
}

// Simplified R2 Bucket Interface
interface R2Bucket {
    put(key: string, body: any): Promise<any>;
    get(key: string): Promise<any>;
}

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket; // R2 Binding
  API_SECRET: string;
  PUBLIC_R2_URL: string; // e.g. https://pub-xxx.r2.dev
};

// --- Drizzle Schema ---
const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  image: text('image'),
  category: text('category'),
  author: text('author'),
  featured: integer('featured', { mode: 'boolean' }),
  publishedAt: integer('published_at'),
});

const members = sqliteTable('members', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  fullName: text('full_name').notNull(), // Mapped to full_name in SQL
  nickname: text('nickname'),
  birthDate: text('birth_date'),
  birthPlace: text('birth_place'),
  address: text('address'),
  phone: text('phone'),
  carType: text('car_type'),
  carYear: text('car_year'),
  carColor: text('car_color'),
  plateNumber: text('plate_number'),
  shirtSize: text('shirt_size'),
  reason: text('reason'),
  status: text('status').default('pending'),
  createdAt: integer('created_at'),
});

const settings = sqliteTable('settings', {
  id: text('id').primaryKey(),
  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),
  heroImage: text('hero_image'),
});

const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email'),
  passwordHash: text('password_hash'),
  role: text('role'),
});

const app = new Hono<{ Bindings: Bindings }>();

// Allow CORS
app.use('/api/*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

// --- AUTH ---
app.post('/api/auth/login', async (c) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { email, password } = body;
    
    // Simple plain text password check for demo.
    // In production, use bcrypt or argon2 verify here.
    const user = await db.select().from(users).where(eq(users.email, email)).get();
    
    if (user && user.passwordHash === password) {
      // Return a dummy JWT for now or implement real JWT signing
      return c.json({ token: 'mock-jwt-token-123', user: { email: user.email, role: user.role } });
    }
    return c.json({ error: 'Invalid credentials' }, 401);
  } catch (e) {
    return c.json({ error: 'Auth failed', details: String(e) }, 500);
  }
});

// --- UPLOAD (R2) ---
app.post('/api/upload', async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['file'];
        
        if (file instanceof File) {
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const arrayBuffer = await file.arrayBuffer();
            
            // Upload to R2
            if (c.env.BUCKET) {
               await c.env.BUCKET.put(fileName, arrayBuffer);
               // Construct Public URL
               const url = `${c.env.PUBLIC_R2_URL}/${fileName}`;
               return c.json({ url });
            } else {
               return c.json({ error: 'R2 Bucket not configured' }, 500);
            }
        }
        return c.json({ error: 'No file uploaded' }, 400);
    } catch (e) {
        return c.json({ error: 'Upload failed', details: String(e) }, 500);
    }
});

// --- ARTICLES ---
app.get('/api/articles', async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(articles).orderBy(desc(articles.publishedAt)).all();
  return c.json(result);
});

app.get('/api/articles/:slug', async (c) => {
    const db = drizzle(c.env.DB);
    const slug = c.req.param('slug');
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).get();
    if (!result) return c.json({ error: 'Not found' }, 404);
    return c.json(result);
});

app.post('/api/articles', async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const id = crypto.randomUUID();
  
  await db.insert(articles).values({
    id,
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    content: body.content,
    image: body.image,
    category: body.category,
    author: 'Admin',
    featured: body.featured || false,
    publishedAt: Math.floor(Date.now()),
  }).run();

  return c.json({ success: true, id });
});

app.put('/api/articles/:id', async (c) => {
    const db = drizzle(c.env.DB);
    const id = c.req.param('id');
    const body = await c.req.json();
    await db.update(articles).set(body).where(eq(articles.id, id)).run();
    return c.json({ success: true });
});

app.delete('/api/articles/:id', async (c) => {
    const db = drizzle(c.env.DB);
    const id = c.req.param('id');
    await db.delete(articles).where(eq(articles.id, id)).run();
    return c.json({ success: true });
});

// --- MEMBERS ---
app.get('/api/members', async (c) => {
    const db = drizzle(c.env.DB);
    const result = await db.select().from(members).orderBy(desc(members.createdAt)).all();
    return c.json(result);
});

app.post('/api/members', async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const id = crypto.randomUUID();
  await db.insert(members).values({
    id, ...body, status: 'pending', createdAt: Math.floor(Date.now())
  }).run();
  return c.json({ success: true, id });
});

app.put('/api/members/:id', async (c) => {
    const db = drizzle(c.env.DB);
    const id = c.req.param('id');
    const body = await c.req.json();
    await db.update(members).set(body).where(eq(members.id, id)).run();
    return c.json({ success: true });
});

// --- SETTINGS ---
app.get('/api/settings', async (c) => {
    try {
      const db = drizzle(c.env.DB);
      const config = await db.select().from(settings).where(eq(settings.id, 'default')).get();
      return c.json(config || {});
    } catch(e) {
      return c.json({}); // Return empty if table doesn't exist yet or other error
    }
});

app.put('/api/settings', async (c) => {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const existing = await db.select().from(settings).where(eq(settings.id, 'default')).get();
    if (existing) {
        await db.update(settings).set(body).where(eq(settings.id, 'default')).run();
    } else {
        await db.insert(settings).values({ id: 'default', ...body }).run();
    }
    return c.json({ success: true });
});

export default app;
