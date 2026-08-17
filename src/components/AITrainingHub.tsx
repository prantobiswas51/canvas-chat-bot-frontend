import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Globe, 
  HelpCircle, 
  Trash2, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  MessageSquareText, 
  Sparkles, 
  Sliders, 
  Zap,
  Plus,
  Database,
  Search,
  Brain,
  ShieldCheck,
  Check
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface KnowledgeItem {
  id: string;
  name: string;
  type: 'file' | 'url' | 'qa';
  detail?: string;
  size?: string;
  addedAt: string;
  status: 'ready' | 'pending';
}

export const AITrainingHub: React.FC = () => {
  // Knowledge Library State
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: 'k-1',
      name: 'Canvas_Product_Catalog_2026.pdf',
      type: 'file',
      size: '2.4 MB',
      addedAt: '01 Aug 2026',
      status: 'ready',
    },
    {
      id: 'k-2',
      name: 'https://canvasart.com/pages/shipping-faq',
      type: 'url',
      detail: 'Scraped 14 sub-pages & return terms',
      size: '14 pages',
      addedAt: '02 Aug 2026',
      status: 'ready',
    },
    {
      id: 'k-3',
      name: 'Q: What is the delivery time for custom canvas in Dhaka?',
      type: 'qa',
      detail: 'A: Custom canvas orders take 2-3 days for framing and 24 hours for express delivery via Steadfast Courier.',
      size: 'Manual Entry',
      addedAt: 'Today at 09:30 AM',
      status: 'ready',
    },
    {
      id: 'k-4',
      name: 'Acrylic_Paint_Color_Mixing_Guide.docx',
      type: 'file',
      size: '850 KB',
      addedAt: 'Just now',
      status: 'pending',
    },
  ]);

  // AI Tone & Settings State
  const [aiTone, setAiTone] = useState<'art_expert' | 'professional' | 'friendly' | 'creative'>('art_expert');
  const [enforceKISS, setEnforceKISS] = useState<boolean>(true);

  // Training Execution & Status
  const [trainingStatus, setTrainingStatus] = useState<'up_to_date' | 'needs_training' | 'training_in_progress'>('needs_training');
  const [trainingProgress, setTrainingProgress] = useState<number>(0);

  // Active Data Source Tab ('files' | 'urls' | 'qa')
  const [activeSourceTab, setActiveSourceTab] = useState<'files' | 'urls' | 'qa'>('files');

  // Input & Search States
  const [librarySearch, setLibrarySearch] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragActive) setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      addNewFileItem(file.name, `${(file.size / 1024).toFixed(1)} KB`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      addNewFileItem(file.name, `${(file.size / 1024).toFixed(1)} KB`);
      e.target.value = '';
    }
  };

  const addNewFileItem = (name: string, size: string) => {
    const newItem: KnowledgeItem = {
      id: `k-file-${Date.now()}`,
      name,
      type: 'file',
      size,
      addedAt: 'Just now',
      status: 'pending',
    };
    setKnowledgeItems((prev) => [newItem, ...prev]);
    setTrainingStatus('needs_training');
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const newItem: KnowledgeItem = {
      id: `k-url-${Date.now()}`,
      name: urlInput.trim(),
      type: 'url',
      detail: 'Submitted for web crawling & indexation',
      size: 'Web Link',
      addedAt: 'Just now',
      status: 'pending',
    };

    setKnowledgeItems((prev) => [newItem, ...prev]);
    setUrlInput('');
    setTrainingStatus('needs_training');
  };

  const handleAddQA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaQuestion.trim() || !qaAnswer.trim()) return;

    const newItem: KnowledgeItem = {
      id: `k-qa-${Date.now()}`,
      name: `Q: ${qaQuestion.trim()}`,
      type: 'qa',
      detail: `A: ${qaAnswer.trim()}`,
      size: 'Direct Q&A',
      addedAt: 'Just now',
      status: 'pending',
    };

    setKnowledgeItems((prev) => [newItem, ...prev]);
    setQaQuestion('');
    setQaAnswer('');
    setTrainingStatus('needs_training');
  };

  const handleDeleteItem = (id: string) => {
    setKnowledgeItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleStartTraining = () => {
    setTrainingStatus('training_in_progress');
    setTrainingProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        setTrainingProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setKnowledgeItems((prev) =>
            prev.map((item) => ({ ...item, status: 'ready' }))
          );
          setTrainingStatus('up_to_date');
        }, 300);
      } else {
        setTrainingProgress(progress);
      }
    }, 200);
  };

  const pendingCount = knowledgeItems.filter((i) => i.status === 'pending').length;
  const filteredItems = knowledgeItems.filter(
    (item) =>
      item.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
      (item.detail && item.detail.toLowerCase().includes(librarySearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans antialiased max-w-7xl mx-auto">
      {/* Top Banner Header & Status Overview */}
      <div className="bg-white dark:bg-[#14132B] p-6 rounded-2xl border border-slate-200 dark:border-[#27264D] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F81B57]/15 border border-[#F81B57]/30 flex items-center justify-center text-[#F81B57] shrink-0 shadow-xs">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                AI Knowledge Base & Training Hub
              </h2>
              {trainingStatus === 'up_to_date' ? (
                <Badge variant="success" size="sm" dot>
                  Status: Up to Date
                </Badge>
              ) : trainingStatus === 'training_in_progress' ? (
                <Badge variant="brand" size="sm" className="animate-pulse">
                  Training in Progress ({trainingProgress}%)
                </Badge>
              ) : (
                <Badge variant="warning" size="sm" dot>
                  Needs Training ({pendingCount} pending)
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              Train Canvas AI Art Consultant with custom manuals, website content, and manual Q&A rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            leftIcon={
              trainingStatus === 'training_in_progress' ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )
            }
            disabled={trainingStatus === 'training_in_progress'}
            onClick={handleStartTraining}
            className="shadow-md shadow-[#F81B57]/20"
          >
            {trainingStatus === 'training_in_progress'
              ? `Training AI... ${trainingProgress}%`
              : 'Start Training AI'}
          </Button>
        </div>
      </div>

      {/* Training In Progress Progress Bar Notification */}
      {trainingStatus === 'training_in_progress' && (
        <div className="p-4 bg-[#F81B57]/10 border border-[#F81B57]/30 rounded-xl space-y-2 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#F81B57]">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-[#F81B57]" />
              Processing Knowledge Base Embeddings & Vector Indexing...
            </span>
            <span className="font-mono">{trainingProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-[#0B0B1E] rounded-full h-2 overflow-hidden border border-[#F81B57]/20">
            <div
              className="bg-[#F81B57] h-full transition-all duration-200 rounded-full"
              style={{ width: `${trainingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main 2-Column Responsive Dashboard Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Data Sources & Knowledge Library (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card A: Add Data Sources */}
          <Card className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4.5 h-4.5 text-[#F81B57]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Add New Data Source</h3>
              </div>

              {/* Source Type Selector Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0B0B1E] p-1 rounded-xl border border-slate-200 dark:border-[#27274D]">
                <button
                  type="button"
                  onClick={() => setActiveSourceTab('files')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeSourceTab === 'files'
                      ? 'bg-[#F81B57] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>File Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSourceTab('urls')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeSourceTab === 'urls'
                      ? 'bg-[#F81B57] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Web Crawling</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSourceTab('qa')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeSourceTab === 'qa'
                      ? 'bg-[#F81B57] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Manual Q&A</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Drag & Drop File Upload Area */}
            {activeSourceTab === 'files' && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                  dragActive
                    ? 'border-[#F81B57] bg-[#F81B57]/10 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0E0D21]/60 hover:border-[#F81B57]/50 hover:bg-slate-100 dark:hover:bg-[#161530]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,.txt,.docx,.doc"
                  className="hidden"
                />
                <div className="w-11 h-11 rounded-full bg-[#F81B57]/15 border border-[#F81B57]/30 flex items-center justify-center text-[#F81B57] shadow-xs">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to upload or drag & drop files here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    Supports PDF, TXT, DOCX (e.g. Canvas product manuals, color mixing guides)
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Website Crawling Form */}
            {activeSourceTab === 'urls' && (
              <form onSubmit={handleAddUrl} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://canvasart.com/pages/shipping-faq"
                      required
                      className="w-full bg-slate-100 dark:bg-[#0E0D21] border border-slate-300 dark:border-[#27274D] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#F81B57]"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
                    Add URL
                  </Button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Submit e-store documentation or policy links. The crawler will extract knowledge text automatically.
                </p>
              </form>
            )}

            {/* Tab 3: Manual Q&A Input Form */}
            {activeSourceTab === 'qa' && (
              <form onSubmit={handleAddQA} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Question</label>
                  <input
                    type="text"
                    value={qaQuestion}
                    onChange={(e) => setQaQuestion(e.target.value)}
                    placeholder="e.g. What is the delivery time for custom canvas in Dhaka?"
                    required
                    className="w-full bg-slate-100 dark:bg-[#0E0D21] border border-slate-300 dark:border-[#27274D] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#F81B57]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Answer</label>
                  <textarea
                    rows={3}
                    value={qaAnswer}
                    onChange={(e) => setQaAnswer(e.target.value)}
                    placeholder="e.g. Custom canvas orders take 2-3 days for framing and 24 hours for express delivery via Steadfast Courier."
                    required
                    className="w-full bg-slate-100 dark:bg-[#0E0D21] border border-slate-300 dark:border-[#27274D] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#F81B57] resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Add Knowledge Pair
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Card B: Knowledge Base Library Table & Search */}
          <Card className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Knowledge Base Index</h3>
                <p className="text-xs text-slate-500">{filteredItems.length} sources active in vector store</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Filter knowledge sources..."
                  className="w-full bg-slate-100 dark:bg-[#0E0D21] border border-slate-300 dark:border-[#27274D] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#F81B57]"
                />
              </div>
            </div>

            {/* Document List */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No knowledge sources match "{librarySearch}".
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#181835] border border-slate-200 dark:border-[#27274D] flex items-center justify-center shrink-0 shadow-xs">
                        {item.type === 'file' ? (
                          <FileText className="w-4 h-4 text-indigo-500" />
                        ) : item.type === 'url' ? (
                          <Globe className="w-4 h-4 text-[#F81B57]" />
                        ) : (
                          <MessageSquareText className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate text-xs">
                            {item.name}
                          </p>
                          {item.status === 'ready' ? (
                            <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30 shrink-0 font-bold">
                              Indexed
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0 font-bold">
                              Pending Training
                            </span>
                          )}
                        </div>
                        {item.detail && (
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.detail}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">{item.size}</span>
                      <span className="text-[10px] text-slate-400 font-mono hidden md:inline">{item.addedAt}</span>

                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete source from Knowledge Base"
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: AI Persona, Rules & Status Metrics (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card C: AI Persona & Behavioral Tone */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Sliders className="w-4.5 h-4.5 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Bot Tone & Behavior</h3>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                Persona Preset
              </label>
              
              <div className="space-y-2">
                {[
                  { id: 'art_expert', label: 'Art Expert (Recommended)', desc: 'Specialized consultant on mediums & tools' },
                  { id: 'professional', label: 'Professional & Formal', desc: 'Direct, clear, and structured SaaS style' },
                  { id: 'friendly', label: 'Friendly & Casual', desc: 'Warm, empathetic customer support' },
                  { id: 'creative', label: 'Creative & Energetic', desc: 'Vibrant and expressive responses' },
                ].map((tone) => {
                  const isSelected = aiTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setAiTone(tone.id as any)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-[#F81B57] bg-[#F81B57]/10 font-semibold shadow-xs'
                          : 'border-slate-200 dark:border-[#27274D] hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-[#0E0D21]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                        isSelected ? 'border-[#F81B57] bg-[#F81B57] text-white' : 'border-slate-400'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{tone.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{tone.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enforce KISS Method Card */}
            <div className="pt-2">
              <div className="bg-slate-50 dark:bg-[#0E0D21] p-3.5 rounded-xl border border-slate-200 dark:border-[#27274D] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      Enforce KISS Method
                    </label>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Keep It Short & Simple (Max 3 sentences)
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enforceKISS}
                    onClick={() => setEnforceKISS(!enforceKISS)}
                    className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      enforceKISS ? 'bg-[#F81B57]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform ${
                        enforceKISS ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Card D: Vector Store & System Rule Metrics Card */}
          <Card className="p-5 space-y-3.5 bg-gradient-to-b from-white to-slate-50 dark:from-[#14132B] dark:to-[#0F0E24]">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Database className="w-4.5 h-4.5 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Vector Store Status</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-100 dark:bg-[#0B0B1E] p-2.5 rounded-xl border border-slate-200 dark:border-[#27274D]">
                <span className="text-[9px] uppercase font-mono text-slate-400 block">Total Embeddings</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-mono">1,480</span>
              </div>
              <div className="bg-slate-100 dark:bg-[#0B0B1E] p-2.5 rounded-xl border border-slate-200 dark:border-[#27274D]">
                <span className="text-[9px] uppercase font-mono text-slate-400 block">Vector Chunks</span>
                <span className="text-sm font-extrabold text-emerald-500 font-mono">3,892</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Live Stock Lookup Active
              </p>
              <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Multi-Language (EN/BN/Banglish)
              </p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AITrainingHub;
