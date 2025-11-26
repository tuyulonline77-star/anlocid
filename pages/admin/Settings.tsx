import React, { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '../../services/mockDb';
import { SiteSettings } from '../../types';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Textarea } from '../../components/ui';
import { Save, ImageIcon } from 'lucide-react';

export default function AdminSettings() {
    const [settings, setSettings] = useState<SiteSettings>({
        heroTitle: '',
        heroSubtitle: '',
        heroImage: ''
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await getSettings();
            setSettings(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await saveSettings(settings);
        setSaving(false);
        alert('Settings updated successfully!');
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Site Settings</h1>
            
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <ImageIcon className="w-5 h-5 mr-2" />
                            Homepage Banner
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        
                        <div className="space-y-2">
                            <Label>Hero Title</Label>
                            <Input 
                                name="heroTitle" 
                                value={settings.heroTitle} 
                                onChange={handleChange} 
                                placeholder="Main headline text"
                            />
                            <p className="text-xs text-slate-500">Big bold text displayed on the homepage cover.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Hero Subtitle</Label>
                            <Textarea 
                                name="heroSubtitle" 
                                value={settings.heroSubtitle} 
                                onChange={handleChange} 
                                rows={2}
                                placeholder="Subtitle text"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Hero Image URL</Label>
                            <div className="flex gap-2">
                                <Input 
                                    name="heroImage" 
                                    value={settings.heroImage} 
                                    onChange={handleChange} 
                                    placeholder="https://..."
                                />
                            </div>
                            <p className="text-xs text-slate-500">Use a direct URL to an image (Cloudflare R2 or External).</p>
                        </div>

                        {/* Preview */}
                        <div className="mt-4 border rounded-lg overflow-hidden relative h-48">
                            <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center text-white p-4 text-center">
                                <h2 className="text-2xl font-bold">{settings.heroTitle || 'Preview Title'}</h2>
                                <p className="mt-2">{settings.heroSubtitle || 'Preview Subtitle'}</p>
                            </div>
                            <img 
                                src={settings.heroImage || 'https://via.placeholder.com/800x400'} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                             <Button type="submit" disabled={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Changes'}
                             </Button>
                        </div>

                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
