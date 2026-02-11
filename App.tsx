import React, { useState, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { DesignState, AIState } from './types';
import { DesignCanvas } from './components/DesignCanvas';
import { generateArabicQuote } from './services/geminiService';
import { Icon } from './components/Icon';
import * as htmlToImage from 'html-to-image';

const INITIAL_STATE: DesignState = {
  headline: "الاستثمار في المستقبل يبدأ بقرار ذكي اليوم",
  subline: "تحليل شامل لأسواق المال الناشئة وتوقعات الربع القادم لعام 2025 من منظور خبراء الاقتصاد.",
  footerText: "al-investor.com",
  imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000",
  accentColor: "#00E1C1",
  secondaryColor: "#0D1137",
  isGrayscale: true,
  showCircle: true,
  customCss: "",
  logoUrl: null,
};

const COLOR_THEMES = [
  { id: 'default', name: 'المستثمر', accent: '#00E1C1', secondary: '#0D1137' },
  { id: 'luxury', name: 'فخامة', accent: '#D4AF37', secondary: '#000000' },
  { id: 'trust', name: 'الثقة', accent: '#38BDF8', secondary: '#0F172A' },
  { id: 'growth', name: 'النمو', accent: '#84CC16', secondary: '#064E3B' },
  { id: 'energy', name: 'الطاقة', accent: '#F43F5E', secondary: '#881337' },
  { id: 'vision', name: 'الرؤية', accent: '#A78BFA', secondary: '#4C1D95' },
  { id: 'modern', name: 'حداثة', accent: '#FB923C', secondary: '#1E293B' },
  { id: 'corporate', name: 'رسمي', accent: '#94A3B8', secondary: '#171717' },
];

const App: React.FC = () => {
  const [design, setDesign] = useState<DesignState>(INITIAL_STATE);
  const [aiState, setAiState] = useState<AIState>({ isLoading: false, error: null });
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'image'>('content');
  const canvasRef = useRef<HTMLDivElement>(null);

  const updateField = <K extends keyof DesignState>(key: K, value: DesignState[K]) => {
    setDesign(prev => ({ ...prev, [key]: value }));
  };

  const handleAiGenerate = async () => {
    const topic = prompt("عن أي موضوع تريد أن تكون العبارة؟", "الاستثمار الذكي");
    if (!topic) return;

    setAiState({ isLoading: true, error: null });
    try {
      const quote = await generateArabicQuote(topic);
      setDesign(prev => ({ ...prev, headline: quote }));
    } catch (err) {
      setAiState({ isLoading: false, error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي" });
    } finally {
      setAiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      if ('fonts' in document) {
        await (document as any).fonts.ready;
      }
      await new Promise(r => setTimeout(r, 400));
      const blob = await htmlToImage.toBlob(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `AlInvestor-Design-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert("عذراً، حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsDownloading(false);
    }
  }, [canvasRef, isDownloading]);

  const handleRandomImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setDesign(prev => ({ 
      ...prev, 
      imageUrl: `https://images.unsplash.com/photo-${randomId}?auto=format&fit=crop&q=80&w=1200` 
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDesign(prev => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDesign(prev => ({ ...prev, logoUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row overflow-hidden font-sans text-brand-slate">
      
      {/* Sidebar Controls */}
      <aside className="w-full md:w-[380px] bg-white border-l border-gray-200 flex flex-col h-screen shadow-xl z-30">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-brand-primary text-white">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-secondary rounded-lg flex items-center justify-center text-brand-primary shadow-lg">
                    <Icon name="Layout" size={20} />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight">مُصمم المستثمر</h1>
                    <p className="text-[10px] opacity-70">DESIGN SYSTEM v2.1</p>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
            {[
                { id: 'content', label: 'المحتوى', icon: 'Type' },
                { id: 'style', label: 'الهوية', icon: 'Palette' },
                { id: 'image', label: 'الوسائط', icon: 'Image' }
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-4 text-xs font-bold transition-all flex flex-col items-center gap-2 border-b-2 uppercase tracking-widest ${
                        activeTab === tab.id 
                        ? 'text-brand-primary border-brand-secondary bg-white' 
                        : 'text-gray-400 border-transparent hover:text-brand-primary hover:bg-gray-100/50'
                    }`}
                >
                    <Icon name={tab.icon as any} size={16} />
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>

        {/* Controls Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            
            {activeTab === 'content' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">العنوان الرئيسي</label>
                            <button 
                                onClick={handleAiGenerate}
                                disabled={aiState.isLoading}
                                className="text-[10px] flex items-center gap-1.5 text-brand-primary bg-brand-secondary/20 px-3 py-1.5 rounded-full hover:bg-brand-secondary/30 transition-all font-bold"
                            >
                                <Icon name="Sparkles" size={12} />
                                {aiState.isLoading ? 'جاري التوليد...' : 'ذكاء اصطناعي'}
                            </button>
                        </div>
                        <textarea 
                            value={design.headline}
                            onChange={(e) => updateField('headline', e.target.value)}
                            rows={3}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none text-right transition-all text-base leading-relaxed bg-gray-50/30 font-bold"
                            dir="rtl"
                            placeholder="اكتب العنوان هنا..."
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">شرح الصورة / نص إضافي</label>
                        <textarea 
                            value={design.subline}
                            onChange={(e) => updateField('subline', e.target.value)}
                            rows={4}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none text-right transition-all text-sm leading-relaxed bg-gray-50/30"
                            dir="rtl"
                            placeholder="اكتب وصفاً مختصراً أسفل الصورة..."
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">النطاق / التذييل</label>
                        <input 
                            type="text" 
                            value={design.footerText}
                            onChange={(e) => updateField('footerText', e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-left font-mono text-xs bg-gray-50/30"
                        />
                    </div>
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-8 animate-fadeIn">
                    
                    {/* Logo Upload Section */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">شعار العلامة التجارية</label>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <input 
                                    type="file" 
                                    id="logo-upload"
                                    accept="image/*" 
                                    onChange={handleLogoUpload} 
                                    className="hidden" 
                                />
                                <label 
                                    htmlFor="logo-upload" 
                                    className="flex items-center justify-center gap-2 w-full p-3 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-brand-secondary hover:bg-brand-secondary/5 transition-all bg-gray-50 text-gray-500"
                                >
                                    <Icon name="Upload" size={16} />
                                    <span className="text-[10px] font-bold">رفع شعار (PNG/SVG)</span>
                                </label>
                            </div>
                            {design.logoUrl && (
                                <button 
                                    onClick={() => updateField('logoUrl', null)}
                                    className="p-3 border border-red-100 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                                    title="استعادة الشعار الافتراضي"
                                >
                                    <Icon name="Undo" size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-100">
                        <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">ثيمات الألوان</label>
                        <div className="grid grid-cols-2 gap-3">
                            {COLOR_THEMES.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => {
                                        updateField('accentColor', theme.accent);
                                        updateField('secondaryColor', theme.secondary);
                                    }}
                                    className={`group relative p-2 rounded-xl border-2 transition-all hover:scale-[1.02] flex items-center gap-3 ${
                                        design.accentColor === theme.accent && design.secondaryColor === theme.secondary
                                            ? 'border-brand-primary bg-brand-primary/5' 
                                            : 'border-transparent bg-gray-50'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full shadow-sm flex overflow-hidden border border-gray-100 shrink-0">
                                        <div className="w-1/2 h-full" style={{ backgroundColor: theme.secondary }}></div>
                                        <div className="w-1/2 h-full" style={{ backgroundColor: theme.accent }}></div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-brand-slate block">{theme.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-100">
                        <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">خيارات العرض</label>
                        <div className="space-y-3">
                            <button 
                                onClick={() => updateField('isGrayscale', !design.isGrayscale)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${design.isGrayscale ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-brand-primary border-gray-200'}`}
                            >
                                <span className="text-sm font-bold">نمط أبيض وأسود</span>
                                <Icon name="Moon" size={18} />
                            </button>
                            <button 
                                onClick={() => updateField('showCircle', !design.showCircle)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${design.showCircle ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-brand-primary border-gray-200'}`}
                            >
                                <span className="text-sm font-bold">عنصر الدائرة البصري</span>
                                <Icon name="Maximize" size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-100">
                        <label className="text-xs font-bold text-brand-primary uppercase tracking-wider flex items-center gap-2">
                           <Icon name="Code" size={14} />
                           <span>CSS مخصص</span>
                        </label>
                        <div className="relative">
                            <textarea
                                value={design.customCss}
                                onChange={(e) => updateField('customCss', e.target.value)}
                                rows={6}
                                dir="ltr"
                                placeholder=".headline { color: red; }"
                                className="w-full p-4 bg-[#1e293b] text-brand-secondary font-mono text-xs rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none custom-scrollbar"
                            />
                            <div className="absolute top-2 right-2 text-[10px] text-gray-500 font-mono">CSS</div>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                            أضف أكواد CSS لتخصيص التصميم بشكل دقيق. سيتم تطبيق الأنماط مباشرة على القالب.
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'image' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">رفع صورة احترافية (3:2)</label>
                        <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-brand-secondary hover:bg-brand-secondary/5 transition-all cursor-pointer group bg-gray-50/50">
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <div className="flex flex-col items-center gap-4 text-gray-400 group-hover:text-brand-secondary transition-colors">
                                <div className="p-5 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
                                    <Icon name="Camera" size={32} />
                                </div>
                                <span className="text-xs font-bold">اسحب الصورة أو انقر للتحميل</span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleRandomImage}
                        className="w-full py-4 bg-white border-2 border-brand-primary text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white flex items-center justify-center gap-3 transition-all font-bold text-sm shadow-sm"
                    >
                        <Icon name="Search" size={18} />
                        تصفح مكتبة الصور
                    </button>
                </div>
            )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-white shadow-2xl">
            <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className={`w-full py-4 bg-brand-primary text-white rounded-xl shadow-lg transition-all transform flex items-center justify-center gap-3 font-bold text-base ${
                    isDownloading 
                    ? 'opacity-80 cursor-not-allowed' 
                    : 'hover:bg-black hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]'
                }`}
            >
                {isDownloading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <Icon name="Download" size={20} />
                )}
                <span>تحميل التصميم (PNG)</span>
            </button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 relative flex items-center justify-center p-6 md:p-12 overflow-hidden bg-[#F1F5F9]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0D1137 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10 w-full max-w-[500px]">
            <div className="absolute -top-12 right-0 flex items-center gap-4">
                <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-primary flex items-center justify-center text-[8px] text-white font-bold">AI</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-secondary flex items-center justify-center text-[8px] text-brand-primary font-bold">HD</div>
                </div>
                <span className="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-[0.2em]">Live Preview Mode</span>
            </div>
            
            <div className="shadow-[0_50px_100px_-20px_rgba(13,17,55,0.3)] rounded-sm overflow-hidden bg-white">
                <DesignCanvas ref={canvasRef} state={design} />
            </div>
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);