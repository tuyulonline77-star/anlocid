import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Article } from '../types';
import { getArticleBySlug } from '../services/mockDb';
import { Button } from '../components/ui';
import { ChevronLeft, Calendar, User } from 'lucide-react';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (slug) {
        const data = await getArticleBySlug(slug);
        setArticle(data || null);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center">Article not found</div>;

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Header Image */}
      <div className="h-[40vh] md:h-[50vh] relative w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 text-white container mx-auto">
          <div className="mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {article.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{article.title}</h1>
          <div className="flex items-center space-x-6 text-sm md:text-base text-slate-200">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(article.publishedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-30">
        <div className="max-w-3xl mx-auto bg-white rounded-t-3xl p-8 md:p-12 shadow-sm border border-slate-100 min-h-[500px]">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Articles
          </Link>
          
          <div className="prose prose-lg prose-slate max-w-none">
            {/* Simple paragraph splitting for demo since content is raw text/markdown */}
            {article.content.split('\n').map((p, i) => (
              <p key={i} className="mb-4 text-slate-700 leading-relaxed">
                {p || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}