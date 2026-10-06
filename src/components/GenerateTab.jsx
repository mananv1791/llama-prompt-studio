import React, { useEffect, useRef, useState } from 'react';
import { LOVABLE_SYSTEM_PROMPT, buildUserPrompt } from '../data/systemPrompt.js';

const STAGES = {
  idle: { label: 'Ready to Generate', color: 'text-muted', icon: '⚡' },
  thinking: { label: 'Analyzing project...', color: 'text-amber-400', icon: '🧠' },
  generating: { label: 'Generating prompt...', color: 'text-accent-light', icon: '✍️' },
  done: { label: 'Complete!', color: 'text-teal', icon: '✅' },
  error: { label: 'Error occurred', color: 'text-red-400', icon: '⚠️' },
};

export default function GenerateTab({ config, ollama, generator }) {
  const outputRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const output = generator.streamedOutput || generator.finalOutput;
  const stage = STAGES[generator.stage] || STAGES.idle;

  // Auto-scroll during streaming
  useEffect(() => {
    if (outputRef.current && generator.isGenerating) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [generator.streamedOutput]);

  const handleGenerate = () => {
    if (!ollama.selectedModel) return;
    const userPrompt = buildUserPrompt(config);
    generator.generate({
      model: ollama.selectedModel,
      prompt: userPrompt,
      systemPrompt: LOVABLE_SYSTEM_PROMPT,
    });
  };

  const handleCopy = async () => {
    const api = window.electronAPI;
    if (api) {
      await api.copy(output);
    } else {
      navigator.clipboard.writeText(output);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLovable = () => {
    const url = 'https://lovable.dev';
    if (window.electronAPI) window.electronAPI.openURL(url);
    else window.open(url, '_blank');
  };

  const wordCount = output ? output.split(/\s+/).filter(Boolean).length : 0;
  const charCount = output ? output.length : 0;

  const isReady = ollama.selectedModel && config.template && config.projectName;
  const hasOutput = output && output.length > 0;

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* Left: Controls */}
      <div className="w-72 shrink-0 flex flex-col gap-4 overflow-y-auto scroll-panel pr-1">
        {/* Summary */}
        <div className="card space-y-3">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Generation Summary</h3>

          <SummaryRow label="Model" value={ollama.selectedModel || '—'} ok={!!ollama.selectedModel} />
          <SummaryRow label="Template" value={config.template?.name || '—'} ok={!!config.template} />
          <SummaryRow label="Project" value={config.projectName || '—'} ok={!!config.projectName} />
          <SummaryRow label="Pages" value={`${config.pages?.length || 0} pages`} ok={(config.pages?.length || 0) > 0} />
          <SummaryRow label="Animations" value={`${config.selectedAnimations?.length || 0} effects`} ok={(config.selectedAnimations?.length || 0) > 0} />
          <SummaryRow label="Color" value={config.colorPalette?.name || '—'} ok={!!config.colorPalette} />
          <SummaryRow label="Tone" value={config.tone || '—'} ok={!!config.tone} />
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!isReady || generator.isGenerating}
          className={`
            relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm
            transition-all duration-200 overflow-hidden
            ${isReady && !generator.isGenerating
              ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-accent hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-surface-3 text-muted cursor-not-allowed'
            }
          `}
        >
          {generator.isGenerating ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="25 50" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <span>🤖</span>
              Generate Prompt
            </>
          )}
          {/* Shimmer */}
          {isReady && !generator.isGenerating && (
            <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer opacity-20" />
          )}
        </button>

        {!isReady && (
          <div className="text-[10px] text-muted text-center -mt-2">
            {!ollama.selectedModel && '⚠ No model selected'}
            {ollama.selectedModel && !config.template && '⚠ Choose a template'}
            {ollama.selectedModel && config.template && !config.projectName && '⚠ Enter a project name'}
          </div>
        )}

        {/* Progress */}
        {generator.isGenerating && (
          <div className="card space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${stage.color}`}>
                {stage.icon} {stage.label}
              </span>
              <span className="text-xs text-muted font-mono">{generator.progress}%</span>
            </div>
            <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
              <div
                className="h-full progress-shimmer rounded-full transition-all duration-300"
                style={{ width: `${generator.progress}%` }}
              />
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted">
              <span>~{generator.tokenCount} words generated</span>
              <span className="ml-auto">Model: {ollama.selectedModel?.split(':')[0]}</span>
            </div>
          </div>
        )}

        {/* Stats when done */}
        {generator.stage === 'done' && hasOutput && (
          <div className="card bg-teal/5 border-teal/20 animate-slide-up space-y-2">
            <p className="text-xs font-semibold text-teal mb-2">✅ Generation Complete</p>
            <div className="grid grid-cols-2 gap-2">
              <StatBox label="Words" value={wordCount.toLocaleString()} />
              <StatBox label="Chars" value={charCount.toLocaleString()} />
              <StatBox label="Animations" value={config.selectedAnimations?.length || 0} />
              <StatBox label="Pages" value={config.pages?.length || 0} />
            </div>
          </div>
        )}

        {/* Actions */}
        {hasOutput && (
          <div className="space-y-2 animate-slide-up">
            <button onClick={handleCopy} className="btn-secondary w-full justify-center">
              {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
            </button>
            <button onClick={handleOpenLovable} className="btn-ghost w-full justify-center text-accent-light hover:bg-accent/10">
              🚀 Open Lovable.dev ↗
            </button>
            <button onClick={generator.reset} className="btn-ghost w-full justify-center text-muted hover:text-gray-300">
              🔄 Reset & Start Over
            </button>
          </div>
        )}

        {/* Error */}
        {generator.error && (
          <div className="card bg-red-500/10 border-red-500/20 animate-fade-in">
            <p className="text-red-400 text-xs font-medium mb-1">Generation failed</p>
            <p className="text-red-300/70 text-xs">{generator.error}</p>
          </div>
        )}

      </div>

      {/* Right: Output */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Output toolbar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${stage.color}`}>
              {stage.icon} {stage.label}
            </span>
            {hasOutput && (
              <span className="text-[10px] text-muted font-mono">
                {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
              </span>
            )}
          </div>
          {hasOutput && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowRaw(!showRaw)}
                className={`btn-ghost text-xs py-1 px-2 ${showRaw ? 'text-accent-light bg-accent/10' : ''}`}
              >
                {showRaw ? '👁 Preview' : '📄 Raw'}
              </button>
              <button onClick={handleCopy} className="btn-ghost text-xs py-1 px-2">
                {copied ? '✓' : '📋'}
              </button>
            </div>
          )}
        </div>

        {/* Output area */}
        <div
          ref={outputRef}
          className="flex-1 rounded-xl bg-surface-0 border border-border overflow-y-auto scroll-panel p-4 relative"
        >
          {!hasOutput && !generator.isGenerating ? (
            <EmptyState isReady={isReady} onGenerate={handleGenerate} />
          ) : (
            <div className={`text-xs leading-relaxed ${showRaw ? 'font-mono text-gray-400' : ''}`}>
              {showRaw ? (
                <pre className="whitespace-pre-wrap text-gray-300 font-mono text-[11px]">{output}</pre>
              ) : (
                <MarkdownPreview text={output} isStreaming={generator.isGenerating} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple markdown-like preview renderer
function MarkdownPreview({ text, isStreaming }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return (
          <h1 key={i} className="text-lg font-bold text-white mt-4 mb-2 border-b border-border pb-2">{line.slice(2)}</h1>
        );
        if (line.startsWith('## ')) return (
          <h2 key={i} className="text-sm font-bold text-accent-light mt-4 mb-1.5">{line.slice(3)}</h2>
        );
        if (line.startsWith('### ')) return (
          <h3 key={i} className="text-xs font-bold text-teal mt-3 mb-1">{line.slice(4)}</h3>
        );
        if (line.startsWith('- ') || line.startsWith('* ')) return (
          <div key={i} className="flex gap-2 text-gray-300 text-xs">
            <span className="text-accent shrink-0 mt-0.5">▸</span>
            <span>{line.slice(2)}</span>
          </div>
        );
        if (/^\d+\. /.test(line)) return (
          <div key={i} className="flex gap-2 text-gray-300 text-xs">
            <span className="text-muted shrink-0 font-mono text-[10px] mt-0.5">{line.match(/^\d+/)[0]}.</span>
            <span>{line.replace(/^\d+\. /, '')}</span>
          </div>
        );
        if (line.startsWith('```')) return (
          <div key={i} className="h-px bg-border my-1" />
        );
        if (line.startsWith('**') && line.endsWith('**')) return (
          <p key={i} className="text-gray-200 font-semibold text-xs">{line.slice(2, -2)}</p>
        );
        if (line.trim() === '') return <div key={i} className="h-2" />;
        return (
          <p key={i} className="text-gray-400 text-xs leading-relaxed">
            {line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`(.*?)`/g, '$1')}
          </p>
        );
      })}
      {isStreaming && <span className="streaming-cursor" />}
    </div>
  );
}

function EmptyState({ isReady, onGenerate }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-3xl">
        🤖
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Ready to Generate</h3>
        <p className="text-xs text-muted max-w-xs">
          Finish the required project fields, then generate a detailed Lovable.dev prompt using your selected local model.
        </p>
      </div>
      {isReady && (
        <button onClick={onGenerate} className="btn-primary">
          🚀 Generate Now
        </button>
      )}
    </div>
  );
}

function SummaryRow({ label, value, ok }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`font-medium truncate max-w-[140px] ${ok ? 'text-gray-200' : 'text-subtle'}`}>{value}</span>
        <span className={ok ? 'text-teal' : 'text-subtle'}>{ok ? '✓' : '○'}</span>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-surface-2 rounded-lg p-2 text-center">
      <div className="text-sm font-bold text-gray-200">{value}</div>
      <div className="text-[10px] text-muted">{label}</div>
    </div>
  );
}
