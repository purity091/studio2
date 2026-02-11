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

const AVAILABLE_LOGOS = [
    { id: 'main', path: '/logos/Logo.svg', name: 'شعار رئيسي' },
    { id: 'white', path: '/logos/alinvestor white.svg', name: 'شعار أبيض' },
    { id: 'v1', path: '/logos/Logo (1).svg', name: 'موديل 1' },
    { id: 'v2', path: '/logos/Logo (2).svg', name: 'موديل 2' },
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
            // alert("عذراً، حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى.");
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
        <div className="app-container">

            {/* Sidebar Controls */}
            <aside className="sidebar">

                {/* Header */}
                <div className="sidebar-header">
                    <div className="header-content">
                        <div className="header-icon-box">
                            <Icon name="Layout" size={20} />
                        </div>
                        <div>
                            <h1 className="header-title">مُصمم المستثمر</h1>
                            <p className="header-subtitle">DESIGN SYSTEM v2.1</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-container">
                    {[
                        { id: 'content', label: 'المحتوى', icon: 'Type' },
                        { id: 'style', label: 'الهوية', icon: 'Palette' },
                        { id: 'image', label: 'الوسائط', icon: 'Image' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`tab-button ${activeTab === tab.id
                                ? 'tab-active'
                                : 'tab-inactive'
                                }`}
                        >
                            <Icon name={tab.icon as any} size={16} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Controls Content */}
                <div className="controls-area custom-scrollbar">

                    {activeTab === 'content' && (
                        <div className="animate-fadeIn">
                            <div className="control-group">
                                <div className="control-header">
                                    <label className="control-label">العنوان الرئيسي</label>
                                    <button
                                        onClick={handleAiGenerate}
                                        disabled={aiState.isLoading}
                                        className="ai-btn"
                                    >
                                        <Icon name="Sparkles" size={12} />
                                        {aiState.isLoading ? 'جاري التوليد...' : 'ذكاء اصطناعي'}
                                    </button>
                                </div>
                                <textarea
                                    value={design.headline}
                                    onChange={(e) => updateField('headline', e.target.value)}
                                    rows={3}
                                    className="textarea-input textarea-primary"
                                    dir="rtl"
                                    placeholder="اكتب العنوان هنا..."
                                />
                            </div>

                            <div className="control-group">
                                <label className="control-label">شرح الصورة / نص إضافي</label>
                                <textarea
                                    value={design.subline}
                                    onChange={(e) => updateField('subline', e.target.value)}
                                    rows={4}
                                    className="textarea-input textarea-secondary"
                                    dir="rtl"
                                    placeholder="اكتب وصفاً مختصراً أسفل الصورة..."
                                />
                            </div>

                            <div className="control-group">
                                <label className="control-label">النطاق / التذييل</label>
                                <input
                                    type="text"
                                    value={design.footerText}
                                    onChange={(e) => updateField('footerText', e.target.value)}
                                    className="text-input"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'style' && (
                        <div className="animate-fadeIn">

                            {/* Logo Upload Section */}
                            <div className="control-group">
                                <label className="control-label">شعار العلامة التجارية</label>
                                <div className="feature-row">
                                    <div className="file-input-wrapper">
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="file-label"
                                        >
                                            <Icon name="Upload" size={16} />
                                            <span className="file-label-text">رفع شعار مخصص</span>
                                        </label>
                                    </div>
                                    {design.logoUrl && (
                                        <button
                                            onClick={() => updateField('logoUrl', null)}
                                            className="reset-btn"
                                            title="استعادة الشعار الافتراضي"
                                        >
                                            <Icon name="Undo" size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="logo-selection-grid">
                                    {AVAILABLE_LOGOS.map(logo => (
                                        <button
                                            key={logo.id}
                                            onClick={() => updateField('logoUrl', logo.path)}
                                            className={`logo-item-btn ${design.logoUrl === logo.path ? 'logo-item-active' : ''}`}
                                            title={logo.name}
                                        >
                                            <img src={logo.path} alt={logo.name} className="logo-preview-img" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="control-group control-separator">
                                <label className="control-label">ثيمات الألوان</label>
                                <div className="theme-grid">
                                    {COLOR_THEMES.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => {
                                                updateField('accentColor', theme.accent);
                                                updateField('secondaryColor', theme.secondary);
                                            }}
                                            className={`theme-btn ${design.accentColor === theme.accent && design.secondaryColor === theme.secondary
                                                ? 'theme-active'
                                                : ''
                                                }`}
                                        >
                                            <div className="theme-icon">
                                                <div className="theme-half" style={{ backgroundColor: theme.secondary }}></div>
                                                <div className="theme-half" style={{ backgroundColor: theme.accent }}></div>
                                            </div>
                                            <span className="theme-name">{theme.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="control-group control-separator">
                                <label className="control-label">خيارات العرض</label>
                                <div className="toggle-group">
                                    <button
                                        onClick={() => updateField('isGrayscale', !design.isGrayscale)}
                                        className={`toggle-btn ${design.isGrayscale ? 'toggle-active' : 'toggle-inactive'}`}
                                    >
                                        <span className="toggle-btn-text">نمط أبيض وأسود</span>
                                        <Icon name="Moon" size={18} />
                                    </button>
                                    <button
                                        onClick={() => updateField('showCircle', !design.showCircle)}
                                        className={`toggle-btn ${design.showCircle ? 'toggle-active' : 'toggle-inactive'}`}
                                    >
                                        <span className="toggle-btn-text">عنصر الدائرة البصري</span>
                                        <Icon name="Maximize" size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="control-group control-separator">
                                <label className="control-label label-with-icon">
                                    <Icon name="Code" size={14} />
                                    <span>CSS مخصص</span>
                                </label>
                                <div className="css-editor-wrapper">
                                    <textarea
                                        value={design.customCss}
                                        onChange={(e) => updateField('customCss', e.target.value)}
                                        rows={6}
                                        dir="ltr"
                                        placeholder=".headline { color: red; }"
                                        className="css-editor custom-scrollbar"
                                    />
                                    <div className="css-badge">CSS</div>
                                </div>
                                <p className="section-caption">
                                    أضف أكواد CSS لتخصيص التصميم بشكل دقيق. سيتم تطبيق الأنماط مباشرة على القالب.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'image' && (
                        <div className="animate-fadeIn">
                            <div className="control-group">
                                <label className="control-label">رفع صورة احترافية (3:2)</label>
                                <div className="upload-zone">
                                    <input type="file" accept="image/*" onChange={handleFileUpload} className="file-input-overlay" />
                                    <div className="upload-content">
                                        <div className="upload-icon-circle">
                                            <Icon name="Camera" size={32} />
                                        </div>
                                        <span className="upload-text">اسحب الصورة أو انقر للتحميل</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleRandomImage}
                                className="library-btn"
                            >
                                <Icon name="Search" size={18} />
                                تصفح مكتبة الصور
                            </button>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="footer-actions">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="download-btn"
                    >
                        {isDownloading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            <Icon name="Download" size={20} />
                        )}
                        <span>تحميل التصميم (PNG)</span>
                    </button>
                </div>
            </aside>

            {/* Main Preview Area */}
            <main className="main-preview">
                <div className="preview-bg-pattern"></div>

                <div className="preview-container">
                    <div className="preview-badges">
                        <div className="badge-group">
                            <div className="badge-circle badge-primary">AI</div>
                            <div className="badge-circle badge-secondary">HD</div>
                        </div>
                        <span className="preview-mode-text">Live Preview Mode</span>
                    </div>

                    <div className="design-wrapper">
                        <DesignCanvas ref={canvasRef} state={design} />
                    </div>
                </div>
            </main>
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);