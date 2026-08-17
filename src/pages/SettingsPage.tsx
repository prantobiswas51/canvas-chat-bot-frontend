import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  Bot,
  Save,
  Server,
  ShieldAlert,
  Sparkles,
  Settings as SettingsIcon,
  Database,
  ChevronRight,
  Activity,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import AITrainingHub from '@/components/AITrainingHub';
import ChannelsPanel from '@/components/settings/ChannelsPanel';
import AiInstructionsPanel from '@/components/settings/AiInstructionsPanel';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'training' | 'system'>('system');
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api');
  const [webhookUrl, setWebhookUrl] = useState('http://localhost:3000/api/v1/webhooks/meta-omnichannel');
  const [botName, setBotName] = useState('Canvas AI Bot');
  const [creativityTemp, setCreativityTemp] = useState<number>(0.2);
  const [testingConnection, setTestingConnection] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
    }, 1200);
  };

  return (
    <div className="w-full space-y-6 font-sans antialiased max-w-7xl mx-auto">
      {/* 1. Top Breadcrumb & Page Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#14132B] p-6 rounded-2xl border border-slate-200 dark:border-[#27264D] shadow-xs">
        <div className="space-y-1.5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span>AI Settings</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#F81B57] font-semibold">
              {activeTab === 'training' ? 'Knowledge Base & Training' : 'System & NestJS API Config'}
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            Canvas AI Settings & Operations
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl">
            Manage AI training embeddings, NestJS microservice webhooks, omni-channel JWT authentication, and human handoff rules.
          </p>
        </div>

        {/* Quick Highlights Pills */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-2 text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold font-mono">NestJS API: Online (24ms)</span>
          </div>

          <div className="bg-slate-100 dark:bg-[#0B0B1E] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#27264D] flex items-center gap-2 text-xs">
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-slate-400 font-mono">PostgreSQL:</span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 font-mono">Ready</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Tabs Bar */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#14132B] p-1.5 rounded-2xl border border-slate-200 dark:border-[#27264D] shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('training')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'training'
              ? 'bg-[#F81B57] text-white shadow-md shadow-[#F81B57]/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1C1B3D]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Knowledge Base & AI Training Hub</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'system'
              ? 'bg-[#F81B57] text-white shadow-md shadow-[#F81B57]/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1C1B3D]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>System & NestJS API Config</span>
        </button>
      </div>

      {/* Tab 1 View: AI Training Hub */}
      {activeTab === 'training' && <AITrainingHub />}

      {/* Tab 2 View: System & NestJS API Config (High-Hierarchy Dashboard Grid) */}
      {activeTab === 'system' && (
        <form onSubmit={handleSave} className="space-y-6">
          {saved && (
            <div className="p-4 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
              <span className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                System and NestJS microservice configurations saved successfully!
              </span>
              <Badge variant="success" size="sm">Saved</Badge>
            </div>
          )}

          {/* 2-Column Grid Layout for System Config */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: NestJS Backend & Webhook Integration (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1: NestJS API Endpoint & Server Status */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
                    <Server className="w-5 h-5 text-[#F81B57]" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">NestJS API Endpoint & Webhook Server</h3>
                  </div>

                  <Badge variant="success" size="sm" dot>
                    NestJS v10.3 Active
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Backend Base API URL"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      helperText="Connected to NestJS REST Controllers & Auth Guards"
                    />
                    <Input label="JWT Access Strategy Expiry" value="15 Minutes (Sliding Window)" disabled />
                  </div>

                  <Input
                    label="Omnichannel Webhook Endpoint URL"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    helperText="Receives Meta Graph API (Messenger & Instagram) webhooks"
                  />

                  {/* Health Check Bar */}
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0E0D21] border border-slate-200 dark:border-[#27264D] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <span className="text-slate-700 dark:text-slate-300">Ping Response:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">200 OK (24ms)</span>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />}
                      onClick={handleTestConnection}
                    >
                      {testingConnection ? 'Testing...' : 'Test Connection'}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Card 2: Connected Channels (WhatsApp / Messenger / Instagram) */}
              <ChannelsPanel />

            </div>

            {/* RIGHT COLUMN: AI Persona Parameters & Human Handoff Rules (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">

              {/* Real, live-editable AI instructions — everything else on this
                  page (and the Training Hub tab) is still a visual mockup. */}
              <AiInstructionsPanel />

              {/* Card 3: Canvas AI Bot Configuration */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3.5 text-[#F81B57]">
                  <Bot className="w-5 h-5 text-[#F81B57]" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">AI Bot Model Parameters</h3>
                </div>

                <div className="space-y-4">
                  <Input
                    label="AI Bot Display Name"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                  />

                  {/* Temperature Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span>Creativity Temperature</span>
                      <span className="font-mono text-[#F81B57]">{creativityTemp} (Factual)</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={creativityTemp}
                      onChange={(e) => setCreativityTemp(parseFloat(e.target.value))}
                      className="w-full accent-[#F81B57] cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>0.0 (Strict Facts)</span>
                      <span>0.5 (Balanced)</span>
                      <span>1.0 (Creative)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Supported Languages</label>
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <Badge variant="indigo" size="sm">English</Badge>
                      <Badge variant="indigo" size="sm">Bengali (বাংলা)</Badge>
                      <Badge variant="indigo" size="sm">Banglish</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 4: Human Handoff Triggers */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3.5 text-amber-500">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Human Moderator Handoff Rules</h3>
                </div>

                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#F81B57] focus:ring-[#F81B57] mt-0.5"
                    />
                    <span className="group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                      Auto-transfer on bulk / wholesale inquiries (&gt; 50 pcs)
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#F81B57] focus:ring-[#F81B57] mt-0.5"
                    />
                    <span className="group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                      Strictly enforce real-time inventory lookup (Never guess prices)
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#F81B57] focus:ring-[#F81B57] mt-0.5"
                    />
                    <span className="group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                      Restrict product recommendations strictly to Canvas Art Supplies brand
                    </span>
                  </label>
                </div>
              </Card>

            </div>
          </div>

          {/* Action Save Bar */}
          <div className="flex items-center justify-end p-4 bg-white dark:bg-[#14132B] rounded-2xl border border-slate-200 dark:border-[#27264D]">
            <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />} className="shadow-md shadow-[#F81B57]/20">
              Save System Configurations
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;
