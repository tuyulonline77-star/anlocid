
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleBySlug, saveArticle, deleteArticle, getArticles, uploadImage } from '../../services/mockDb';
import { Article, CATEGORIES } from '../../types';
import { Button, Input, Textarea, Label, Select, Card, CardContent } from '../../components/ui';
import { Trash, Save, Upload, Image as ImageIcon } from 'lucide-react';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Article>({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: CATEGORIES[0],
    author: 'Admin',
    publishedAt: new Date().toISOString(),
    featured: false
  });

  useEffect(() => {
    if (id && id !== 'new') {
      const load = async () => {
        // In real API mode, we would fetchById, but here we reuse logic
        const articles = await getArticles();
        const found = articles.find(a => a.id === id);
        if (found) setFormData(found);
      };
      load();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev, 
        [name]: value,
        slug: name === 'title' && !id ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setUploading(true);
          try {
              const url = await uploadImage(e.target.files[0]);
              setFormData(prev => ({ ...prev, image: url }));
          } catch (error) {
              alert('Upload failed: ' + error);
          } finally {
              setUploading(false);
          }
      }
  };

  const handleSave = async () => {
    setLoading(true);
    await saveArticle(formData);
    setLoading(false);
    navigate('/admin/articles');
  };

  const handleDelete = async () => {
    if (confirm('Delete this article?')) {
        await deleteArticle(formData.id);
        navigate('/admin/articles');
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{id === 'new' ? 'Create Article' : 'Edit Article'}</h1>
        <div className="space-x-2">
            {id !== 'new' && (
                <Button variant="danger" onClick={handleDelete}><Trash className="w-4 h-4 mr-2"/> Delete</Button>
            )}
            <Button onClick={handleSave} disabled={loading || uploading}>
                <Save className="w-4 h-4 mr-2"/> {loading ? 'Saving...' : 'Save Article'}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
             <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input name="title" value={formData.title} onChange={handleChange} placeholder="Article Title" />
                    </div>
                    <div className="space-y-2">
                        <Label>Slug (URL)</Label>
                        <Input name="slug" value={formData.slug} onChange={handleChange} placeholder="url-friendly-slug" />
                    </div>
                    <div className="space-y-2">
                        <Label>Excerpt</Label>
                        <Textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label>Content (Markdown)</Label>
                        <Textarea name="content" value={formData.content} onChange={handleChange} className="min-h-[500px] font-mono" />
                    </div>
                </CardContent>
             </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select name="category" value={formData.category} onChange={handleChange}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Featured Image</Label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            {formData.image ? (
                                <div className="relative aspect-video">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-md" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                        <span className="text-white text-sm font-medium">Change Image</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8">
                                    <ImageIcon className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                                    <span className="text-sm text-slate-500">Click to upload image</span>
                                </div>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                        </div>
                        {uploading && <p className="text-xs text-blue-600 text-center animate-pulse">Uploading to Cloudflare R2...</p>}
                        
                        <div className="mt-2">
                             <Label className="text-xs text-slate-400">Or use URL</Label>
                             <Input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." className="mt-1" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <input 
                            type="checkbox" 
                            id="featured" 
                            name="featured" 
                            checked={formData.featured} 
                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <Label htmlFor="featured" className="mb-0">Featured Article</Label>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
