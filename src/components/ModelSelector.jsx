import React from 'react';

export default function ModelSelector({ models, selectedModel, onSelect, isConnected, isLoading, error, onRefresh, formatSize }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-teal animate-pulse-slow' : 'bg-red-400'}`} />
          <span className="text-sm font-semibold text-gray-200">Ollama Connection</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn-ghost text-xs py-1 px-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="20 40" />
              </svg>
              Scanning...
            </span>
          ) : '↻ Refresh'}
        </button>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
          <p className="text-red-400 text-xs font-medium mb-1">⚠ Connection Failed</p>
          <p className="text-red-300/70 text-xs">{error}</p>
          <div className="mt-2 p-2 bg-surface-0 rounded-md">
            <code className="text-xs text-teal font-mono">$ ollama serve</code>
          </div>
        </div>
      ) : models.length === 0 && !isLoading ? (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
          <p className="text-amber-400 text-xs">No models found. Pull a model first:</p>
          <code className="text-xs text-teal font-mono mt-1 block">$ ollama pull llama3.2</code>
        </div>
      ) : (
        <div className="space-y-1.5">
          {models.map((model) => (
            <button
              key={model.name}
              onClick={() => onSelect(model.name)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm
                transition-all duration-150 border
                ${selectedModel === model.name
                  ? 'bg-accent/15 border-accent/40 text-gray-100'
                  : 'bg-surface-2 border-border hover:border-border-hover hover:bg-surface-3 text-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">
                  {model.name.includes('llama') ? '🦙' :
                   model.name.includes('mistral') ? '🌬️' :
                   model.name.includes('codellama') || model.name.includes('code') ? '💻' :
                   model.name.includes('qwen') ? '🈵' :
                   model.name.includes('phi') ? 'φ' : '🤖'}
                </span>
                <div className="text-left">
                  <div className="font-medium text-xs leading-tight">{model.name.split(':')[0]}</div>
                  <div className="text-muted text-[10px]">{model.name.split(':')[1] || 'latest'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {formatSize && model.size && (
                  <span className="text-[10px] text-muted font-mono">{formatSize(model.size)}</span>
                )}
                {selectedModel === model.name && (
                  <span className="w-4 h-4 rounded-full bg-accent/30 flex items-center justify-center">
                    <span className="text-accent-light text-[10px]">✓</span>
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
