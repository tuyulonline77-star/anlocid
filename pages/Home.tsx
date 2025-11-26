import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Article, SiteSettings, CATEGORIES } from '../types';
import { getArticles, getSettings } from '../services/mockDb';
import { Card, CardContent, Button } from '../components/ui';
import { ArrowRight, Calendar } from 'lucide-react';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [articlesData, settingsData] = await Promise.all([
        getArticles(),
        getSettings()
      ]);
      setArticles(articlesData);
      setSettings(settingsData);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src={settings?.heroImage || 'https://picsum.photos/1920/1080'} 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {settings?.heroTitle || 'Welcome to AutoBlog'}
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-8">
            {settings?.heroSubtitle}
          </p>
          <div className="flex justify-center gap-4">
             <Link to="/register">
               <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">Join Community</Button>
             </Link>
             <Link to="#articles">
               <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white">Read Articles</Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Ads Banner (Simulated) */}
      <div className="container mx-auto px-4">
        <div className="w-full h-32 bg-slate-100 rounded-xl flex items-center justify-center border border-dashed border-slate-300">
           <span className="text-slate-400 font-medium">Advertisement Space</span>
        </div>
      </div>

      {/* Main Content */}
      <div id="articles" className="container mx-auto px-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <Button 
            variant={activeCategory === 'All' ? 'primary' : 'outline'}
            onClick={() => setActiveCategory('All')}
            className="rounded-full"
          >
            All
          </Button>
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'primary' : 'outline'}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <Link to={`/article/${article.slug}`} key={article.id} className="group">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-slate-200">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-900">
                      {article.category}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-slate-500 text-xs mb-3 space-x-2">
                       <Calendar className="w-3 h-3" />
                       <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                       <span>•</span>
                       <span>{article.author}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      Read Article <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-500 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}