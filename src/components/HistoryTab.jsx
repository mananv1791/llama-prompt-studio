import React, { useCallback, useState } from 'react';

const STORAGE_KEY = 'llama_prompt_studio_history';

const readHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const writeHistory = (history) => {
  try {
    if (history.length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Ignore storage failures, e.g. private mode quota limits.
  }
};

export function useHistory() {
  const [history, setHistory] = useState(readHistory);

  const addEntry = useCallback((entry) => {
    const newEntry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...entry,
    };
    setHistory(current => {
      const updated = [newEntry, ...current].slice(0, 50);
      writeHistory(updated);
      return updated;
    });
    return newEntry;
  }, []);

  const removeEntry = useCallback((id) => {
    setHistory(current => {
      const updated = current.filter(e => e.id !== id);
      writeHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    writeHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}

export default function HistoryTab({ history, onRemove, onClearAll, onLoad }) {
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleCopy = async (entry) => {
    const api = window.electronAPI;
    if (api) await api.copy(entry.output);
    else navigator.clipboard.writeText(entry.output);
    setCopied(entry.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-3">
        <span className="text-4xl">📋</span>
        <h3 className="text-sm font-semibold text-gray-300">No history yet</h3>
        <p className="text-xs text-muted max-w-xs">
          Generated prompts will appear here. They're saved locally in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* List */}
      <div className="w-80 shrink-0 flex flex-col gap-2 overflow-y-auto scroll-panel pr-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-300">{history.length} saved prompts</span>
          <button onClick={onClearAll} className="btn-ghost text-xs py-1 px-2 text-red-400 hover:text-red-300">
            Clear all
          </button>
        </div>

        {history.map(entry => (
          <div
            key={entry.id}
            onClick={() => setSelected(entry)}
            className={`
              card-hover p-3 cursor-pointer
              ${selected?.id === entry.id ? 'border-accent/50 bg-accent/10' : ''}
            `}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="font-semibold text-xs text-gray-200 truncate flex-1">
                {entry.template?.icon} {entry.projectName || 'Untitled Project'}
              </span>
              <button
                onClick={e => { e.stopPropagation(); onRemove(entry.id); }}
                className="text-subtle hover:text-red-400 text-xs transition-colors shrink-0"
              >×</button>
            </div>
            <div className="text-[10px] text-muted mb-2">{entry.template?.name} · {entry.pages?.length || 0} pages · {entry.selectedAnimations?.length || 0} animations</div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-subtle">{formatDate(entry.createdAt)}</span>
              <span className="text-[10px] font-mono text-muted">
                {entry.output?.split(/\s+/).length?.toLocaleString() || 0}w
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {selected ? (
          <>
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-gray-200">
                {selected.template?.icon} {selected.projectName}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleCopy(selected)} className="btn-secondary text-xs py-1.5 px-3">
                  {copied === selected.id ? '✓ Copied!' : '📋 Copy'}
                </button>
                {onLoad && (
                  <button onClick={() => onLoad(selected)} className="btn-primary text-xs py-1.5 px-3">
                    ↺ Load Config
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 rounded-xl bg-surface-0 border border-border overflow-y-auto scroll-panel p-4">
              <pre className="text-[11px] text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                {selected.output}
              </pre>
            </div>
          </>
        ) : (
          <div className="flex-1 rounded-xl bg-surface-0 border border-border flex items-center justify-center">
            <p className="text-xs text-muted">Select a prompt to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
