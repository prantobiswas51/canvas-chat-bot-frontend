import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Terminal, RefreshCw, Search, Loader2, AlertTriangle, Pause, Play, ArrowDownToLine } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import logService, { LogProcessSummary, LogType } from '@/services/logService';

const LINE_OPTIONS = [100, 300, 500, 1000, 2000];
const AUTO_REFRESH_MS = 5000;

function statusBadge(status: string) {
  if (status === 'online') return <Badge variant="success" size="sm" dot>Online</Badge>;
  if (status === 'stopped') return <Badge variant="neutral" size="sm" dot>Stopped</Badge>;
  if (status === 'errored') return <Badge variant="danger" size="sm" dot>Errored</Badge>;
  return <Badge variant="warning" size="sm" dot>{status}</Badge>;
}

// Rough color-coding so NestJS's own [Nest] ... ERROR/WARN/LOG prefixes (and
// generic "error"/"warn" text) stand out without needing real log parsing.
function lineClassName(line: string): string {
  if (/\berror\b/i.test(line)) return 'text-rose-400';
  if (/\bwarn\b/i.test(line)) return 'text-amber-400';
  return 'text-slate-300';
}

export const LogBookPage: React.FC = () => {
  const [processes, setProcesses] = useState<LogProcessSummary[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [logType, setLogType] = useState<LogType>('out');
  const [maxLines, setMaxLines] = useState(300);
  const [lines, setLines] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoadingProcesses, setIsLoadingProcesses] = useState(true);
  const [isLoadingLines, setIsLoadingLines] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);
  // Mirrors wasAtBottomRef for rendering — the ref alone doesn't trigger a
  // re-render when it changes, so the "Jump to latest" button wouldn't
  // show/hide on scroll without this.
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Load the list of PM2-managed processes once, then whenever the auto-
  // refresh loop is on (statuses/restart counts drift over time too).
  const loadProcesses = useCallback(async () => {
    try {
      const list = await logService.listProcesses();
      setProcesses(list);
      setError(null);
      setSelectedProcess((prev) => (prev && list.some((p) => p.name === prev) ? prev : list[0]?.name ?? ''));
    } catch {
      setError('Could not reach PM2 on the server — make sure the backend is actually running under pm2.');
    } finally {
      setIsLoadingProcesses(false);
    }
  }, []);

  useEffect(() => {
    loadProcesses();
  }, [loadProcesses]);

  const loadLines = useCallback(async () => {
    if (!selectedProcess) return;
    setIsLoadingLines(true);
    try {
      const result = await logService.tail(selectedProcess, logType, maxLines);
      setLines(result.lines);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError(`Could not load ${logType} logs for "${selectedProcess}".`);
    } finally {
      setIsLoadingLines(false);
    }
  }, [selectedProcess, logType, maxLines]);

  useEffect(() => {
    loadLines();
  }, [loadLines]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      loadLines();
      loadProcesses();
    }, AUTO_REFRESH_MS);
    return () => clearInterval(timer);
  }, [autoRefresh, loadLines, loadProcesses]);

  // Only auto-scroll to the new bottom if the user was already there —
  // don't yank them back down while they're reading scrollback.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && wasAtBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    wasAtBottomRef.current = atBottom;
    setIsAtBottom(atBottom);
  };

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    wasAtBottomRef.current = true;
    setIsAtBottom(true);
  };

  const filteredLines = filter.trim()
    ? lines.filter((l) => l.toLowerCase().includes(filter.trim().toLowerCase()))
    : lines;

  const selected = processes.find((p) => p.name === selectedProcess);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#F81B57]" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Log Book</h1>
            <Badge variant="indigo" size="sm" dot>Live PM2</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tail the server's own PM2-managed process logs, right from the dashboard.</p>
        </div>

        <button
          onClick={() => setAutoRefresh((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            autoRefresh
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500'
          }`}
        >
          {autoRefresh ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {autoRefresh ? 'Auto-refreshing (5s)' : 'Auto-refresh paused'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Controls Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-slate-100 dark:bg-slate-900/40 p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedProcess}
            onChange={(e) => setSelectedProcess(e.target.value)}
            disabled={isLoadingProcesses || processes.length === 0}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#F81B57] disabled:opacity-50 cursor-pointer"
          >
            {processes.length === 0 && <option value="">No PM2 processes found</option>}
            {processes.map((p) => (
              <option key={p.pmId} value={p.name}>
                {p.name} ({p.status})
              </option>
            ))}
          </select>

          {selected && statusBadge(selected.status)}
          {selected && (
            <span className="text-[10px] text-slate-400 font-mono">
              pid {selected.pid ?? '—'} · {selected.restarts} restart{selected.restarts === 1 ? '' : 's'}
            </span>
          )}

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-0.5">
            {(['out', 'error'] as LogType[]).map((t) => (
              <button
                key={t}
                onClick={() => setLogType(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                  logType === t
                    ? t === 'error'
                      ? 'bg-rose-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t === 'out' ? 'stdout' : 'stderr'}
              </button>
            ))}
          </div>

          <select
            value={maxLines}
            onChange={(e) => setMaxLines(Number(e.target.value))}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#F81B57] cursor-pointer"
          >
            {LINE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                last {n}
              </option>
            ))}
          </select>

          <button
            onClick={loadLines}
            disabled={isLoadingLines}
            title="Refresh now"
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoadingLines ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex-1 min-w-[180px]">
          <Input
            placeholder="Filter visible lines..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
          />
        </div>

        {lastUpdated && (
          <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
            updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Terminal Panel */}
      <div className="relative flex-1 min-h-[400px] bg-[#0B0A1C] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center gap-1.5 px-3.5 py-2 border-b border-slate-800 bg-[#111029] shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 text-[10px] font-mono text-slate-500 truncate">
            {selectedProcess || 'no process selected'} — {logType === 'out' ? 'stdout' : 'stderr'}
            {filter.trim() && ` — filtered (${filteredLines.length}/${lines.length})`}
          </span>
        </div>

        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-3.5 font-mono text-[11px] leading-relaxed">
          {isLoadingProcesses ? (
            <div className="flex items-center gap-2 text-slate-500 py-6 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading PM2 processes...
            </div>
          ) : processes.length === 0 ? (
            <div className="text-slate-500 py-6 text-center">
              No PM2 processes visible from this backend. Make sure it's started with <code className="text-slate-300">pm2 start</code>{' '}
              and running as the same user as the PM2 daemon.
            </div>
          ) : filteredLines.length === 0 ? (
            <div className="text-slate-500 py-6 text-center">
              {filter.trim() ? 'No lines match your filter.' : 'No log output yet.'}
            </div>
          ) : (
            filteredLines.map((line, i) => (
              <div key={i} className={`whitespace-pre-wrap break-all ${lineClassName(line)}`}>
                {line}
              </div>
            ))
          )}
        </div>

        {!isAtBottom && filteredLines.length > 0 && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium shadow-lg cursor-pointer"
          >
            <ArrowDownToLine className="w-3 h-3" /> Jump to latest
          </button>
        )}
      </div>
    </div>
  );
};

export default LogBookPage;
