import React from 'react';
import { WEBSITE_TEMPLATES, COLOR_PALETTES, INDUSTRY_TYPES, TONE_OPTIONS } from '../data/templates.js';
import ModelSelector from './ModelSelector.jsx';

export default function ConfigureTab({ config, onConfigChange, ollama }) {
  const update = (key, val) => onConfigChange(current => ({ ...current, [key]: val }));

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* Left column */}
      <div className="w-72 shrink-0 flex flex-col gap-4 overflow-y-auto scroll-panel pr-1">
        {/* Model selector */}
        <ModelSelector
          models={ollama.models}
          selectedModel={ollama.selectedModel}
          onSelect={ollama.setSelectedModel}
          isConnected={ollama.isConnected}
          isLoading={ollama.isLoading}
          error={ollama.error}
          onRefresh={ollama.refreshModels}
          formatSize={ollama.formatModelSize}
        />

        {/* Project basics */}
        <div className="card space-y-3">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Project Info</h3>

          <div>
            <label className="section-label">Project Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="My Awesome Website"
              value={config.projectName || ''}
              onChange={e => update('projectName', e.target.value)}
            />
          </div>

          <div>
            <label className="section-label">Industry</label>
            <div className="select-wrapper">
              <select
                className="select-field"
                value={config.industry || ''}
                onChange={e => update('industry', e.target.value)}
              >
                <option value="">Select industry...</option>
                {INDUSTRY_TYPES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="section-label">Target Audience</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., SaaS founders, designers, devs"
              value={config.targetAudience || ''}
              onChange={e => update('targetAudience', e.target.value)}
            />
          </div>

          <div>
            <label className="section-label">Unique Value Proposition</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="What makes this product special?"
              value={config.uniqueValue || ''}
              onChange={e => update('uniqueValue', e.target.value)}
            />
          </div>
        </div>

        {/* Tone */}
        <div className="card space-y-3">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Brand Tone</h3>
          <div className="grid grid-cols-2 gap-2">
            {TONE_OPTIONS.map(tone => (
              <button
                key={tone.id}
                onClick={() => update('tone', tone.id)}
                className={`
                  p-2.5 rounded-lg border text-left transition-all duration-150
                  ${config.tone === tone.id
                    ? 'bg-accent/15 border-accent/40 text-gray-100'
                    : 'bg-surface-2 border-border hover:border-border-hover text-gray-400 hover:text-gray-200'
                  }
                `}
              >
                <div className="text-sm leading-none mb-1">{tone.label}</div>
                <div className="text-[10px] text-muted leading-tight">{tone.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto scroll-panel pr-1">
        {/* Template selector */}
        <div className="card">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Website Template</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {WEBSITE_TEMPLATES.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => {
                  onConfigChange(current => ({
                    ...current,
                    template: tmpl,
                    pages: current.customPages ? current.pages : tmpl.pages,
                  }));
                }}
                className={`
                  p-3 rounded-xl border text-left transition-all duration-200 group
                  ${config.template?.id === tmpl.id
                    ? 'bg-accent/15 border-accent/40 shadow-accent-sm'
                    : 'bg-surface-2 border-border hover:border-border-hover hover:bg-surface-3'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-xl">{tmpl.icon}</span>
                  {config.template?.id === tmpl.id && (
                    <span className="badge bg-accent/20 text-accent-light text-[10px]">Selected</span>
                  )}
                </div>
                <div className="font-semibold text-xs text-gray-200 mb-0.5">{tmpl.name}</div>
                <div className="text-[10px] text-muted leading-snug">{tmpl.description}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tmpl.pages.slice(0, 3).map(p => (
                    <span key={p} className="text-[9px] px-1.5 py-0.5 bg-surface-3 rounded text-subtle">{p}</span>
                  ))}
                  {tmpl.pages.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-surface-3 rounded text-subtle">+{tmpl.pages.length - 3}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pages customizer */}
        {config.template && (
          <div className="card animate-slide-up">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Pages to Build</h3>
            <div className="flex flex-wrap gap-2">
              {config.pages?.map((page, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onConfigChange(current => ({
                      ...current,
                      customPages: true,
                      pages: (current.pages || []).filter((_, idx) => idx !== i),
                    }));
                  }}
                  className="tag-active group"
                >
                  {page}
                  <span className="text-accent/60 group-hover:text-red-400 transition-colors ml-0.5">×</span>
                </button>
              ))}
              <button
                onClick={() => {
                  const name = prompt('Page name:');
                  if (name?.trim()) {
                    onConfigChange(current => ({
                      ...current,
                      customPages: true,
                      pages: [...(current.pages || []), name.trim()],
                    }));
                  }
                }}
                className="tag"
              >
                + Add Page
              </button>
            </div>
          </div>
        )}

        {/* Color palette */}
        <div className="card">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Color Palette</h3>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_PALETTES.map(pal => (
              <button
                key={pal.id}
                onClick={() => update('colorPalette', pal)}
                className={`
                  p-3 rounded-lg border flex items-center gap-3 transition-all duration-150
                  ${config.colorPalette?.id === pal.id
                    ? 'border-accent/50 bg-accent/10'
                    : 'bg-surface-2 border-border hover:border-border-hover'
                  }
                `}
              >
                <div className="flex gap-1 shrink-0">
                  {[pal.bg, pal.primary, pal.secondary, pal.accent].map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-black/20" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-xs text-gray-300 font-medium truncate">{pal.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Additional features */}
        <div className="card">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Extra Features</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Dark/Light Mode Toggle', 'Blog / CMS', 'Authentication', 'Search Functionality',
              'Newsletter Signup', 'Contact Form', 'Analytics', 'Internationalization (i18n)',
              'PWA Support', 'Loading Skeleton Screens', 'Infinite Scroll', 'Video Background',
            ].map(feature => (
              <button
                key={feature}
                onClick={() => {
                  onConfigChange(current => {
                    const currentFeatures = current.additionalFeatures || [];
                    const updated = currentFeatures.includes(feature)
                      ? currentFeatures.filter(f => f !== feature)
                      : [...currentFeatures, feature];
                    return { ...current, additionalFeatures: updated };
                  });
                }}
                className={config.additionalFeatures?.includes(feature) ? 'tag-active' : 'tag'}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        {/* Custom instructions */}
        <div className="card">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Custom Instructions</h3>
          <textarea
            className="input-field resize-none"
            rows={4}
            placeholder="Any specific requirements, brand guidelines, tech constraints, or special design requests..."
            value={config.customInstructions || ''}
            onChange={e => update('customInstructions', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
