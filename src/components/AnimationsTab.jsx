import React from 'react';
import { GSAP_ANIMATIONS, ANIMATION_PRESETS } from '../data/templates.js';

export default function AnimationsTab({ config, onConfigChange }) {
  const selectedAnimations = config.selectedAnimations || [];

  const toggleAnimation = (animId) => {
    const updated = selectedAnimations.includes(animId)
      ? selectedAnimations.filter(a => a !== animId)
      : [...selectedAnimations, animId];
    onConfigChange({ ...config, selectedAnimations: updated });
  };

  const applyPreset = (preset) => {
    onConfigChange({ ...config, selectedAnimations: [...new Set([...selectedAnimations, ...preset.animations])] });
  };

  const clearAll = () => onConfigChange({ ...config, selectedAnimations: [] });

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* Left: Presets + Selected */}
      <div className="w-72 shrink-0 flex flex-col gap-4 overflow-y-auto scroll-panel pr-1">
        {/* Presets */}
        <div className="card space-y-2">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Quick Presets</h3>
          {ANIMATION_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="w-full text-left p-3 rounded-lg bg-surface-2 border border-border hover:border-border-hover
                         hover:bg-surface-3 transition-all duration-150 group"
            >
              <div className="font-semibold text-xs text-gray-200 mb-0.5 group-hover:text-accent-light transition-colors">
                {preset.name}
              </div>
              <div className="text-[10px] text-muted leading-snug">{preset.description}</div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {preset.animations.map(a => (
                  <span key={a} className="text-[9px] px-1.5 py-0.5 bg-surface-3 rounded text-subtle">{a}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Selected summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Selected ({selectedAnimations.length})
            </h3>
            {selectedAnimations.length > 0 && (
              <button onClick={clearAll} className="btn-ghost text-xs py-1 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                Clear all
              </button>
            )}
          </div>

          {selectedAnimations.length === 0 ? (
            <p className="text-muted text-xs text-center py-4">No animations selected yet</p>
          ) : (
            <div className="space-y-1.5">
              {selectedAnimations.map(animId => {
                const anim = GSAP_ANIMATIONS[animId];
                if (!anim) return null;
                return (
                  <div key={animId} className="flex items-center justify-between p-2 rounded-lg bg-accent/10 border border-accent/20">
                    <span className="text-xs text-gray-300">{anim.name}</span>
                    <button
                      onClick={() => toggleAnimation(animId)}
                      className="text-muted hover:text-red-400 text-xs transition-colors"
                    >×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* GSAP info */}
        <div className="card bg-gradient-to-br from-surface-1 to-surface-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🟢</span>
            <span className="text-sm font-semibold text-gray-200">GSAP 3 Stack</span>
          </div>
          <div className="space-y-1">
            {['GSAP Core', 'ScrollTrigger', 'SplitText', 'MorphSVG', 'TextPlugin', 'DrawSVG'].map(plugin => (
              <div key={plugin} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal/70" />
                {plugin}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted">All plugins will be included in the generated prompt</p>
        </div>
      </div>

      {/* Right: Animation gallery */}
      <div className="flex-1 overflow-y-auto scroll-panel pr-1">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(GSAP_ANIMATIONS).map(([id, anim]) => {
            const isSelected = selectedAnimations.includes(id);

            return (
              <div
                key={id}
                className={`
                  card cursor-pointer transition-all duration-200 relative overflow-hidden
                  ${isSelected
                    ? 'border-accent/50 bg-accent/10 shadow-accent-sm'
                    : 'hover:border-border-hover hover:bg-surface-2'
                  }
                `}
                onClick={() => toggleAnimation(id)}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                )}

                {/* Animation preview visual */}
                <div className="h-16 mb-3 rounded-lg bg-surface-0 border border-border flex items-center justify-center overflow-hidden relative">
                  <AnimPreview animId={id} isSelected={isSelected} />
                </div>

                <div className="font-semibold text-xs text-gray-200 mb-0.5">{anim.name}</div>
                <div className="text-[10px] text-muted leading-snug mb-2">{anim.description}</div>

                {/* Code preview */}
                <div className="text-[9px] font-mono text-teal/70 bg-surface-0 rounded-md px-2 py-1.5 leading-relaxed truncate overflow-hidden">
                  {anim.code.split('\n')[0].substring(0, 60)}...
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Mini animation preview visuals
function AnimPreview({ animId, isSelected }) {
  const color = isSelected ? '#7c6af7' : '#4b5563';
  const colorLight = isSelected ? 'rgba(124,106,247,0.3)' : 'rgba(255,255,255,0.05)';

  const previews = {
    'scroll-reveal': (
      <div className="flex flex-col gap-1.5 w-28">
        {[1, 0.6, 0.3].map((o, i) => (
          <div key={i} className="h-2 rounded-full" style={{ background: color, opacity: o, width: `${100 - i * 20}%` }} />
        ))}
      </div>
    ),
    'parallax-hero': (
      <div className="relative w-24 h-12">
        <div className="absolute inset-0 rounded-lg" style={{ background: colorLight }} />
        <div className="absolute bottom-1 left-2 right-2 h-4 rounded" style={{ background: color, opacity: 0.8 }} />
        <div className="absolute top-1 left-4 right-8 h-2 rounded" style={{ background: color, opacity: 0.4 }} />
      </div>
    ),
    'text-reveal': (
      <div className="flex flex-col gap-1 w-28">
        {['████████', '██████', '████████████'].map((t, i) => (
          <div key={i} className="text-[8px] font-mono leading-none" style={{ color, opacity: 1 - i * 0.2 }}>{t}</div>
        ))}
      </div>
    ),
    'stagger-cards': (
      <div className="flex gap-2 items-end">
        {[0.3, 0.6, 1].map((o, i) => (
          <div key={i} className="w-7 rounded-md" style={{ height: `${24 + i * 12}px`, background: color, opacity: o }} />
        ))}
      </div>
    ),
    'counter-up': (
      <div className="text-2xl font-bold" style={{ color }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>9,847</span>
      </div>
    ),
    'magnetic-hover': (
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2" style={{ borderColor: color }} />
        <div className="absolute w-4 h-4 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
             style={{ background: color, transform: 'translate(-40%, -40%)' }} />
      </div>
    ),
    'cursor-follow': (
      <div className="relative w-16 h-12">
        <div className="absolute w-6 h-6 rounded-full border-2 top-2 left-4" style={{ borderColor: color }} />
        <div className="absolute w-2 h-2 rounded-full top-4 left-6" style={{ background: color }} />
      </div>
    ),
    'marquee-scroll': (
      <div className="w-28 overflow-hidden">
        <div className="flex gap-2 text-[9px] font-mono whitespace-nowrap" style={{ color }}>
          ★ SCROLL ★ MARQUEE ★ TEXT
        </div>
      </div>
    ),
    'floating-elements': (
      <div className="flex gap-3 items-center">
        {[0, -6, -3].map((y, i) => (
          <div key={i} className="w-6 h-6 rounded-lg" style={{ background: colorLight, border: `1px solid ${color}`, transform: `translateY(${y}px)` }} />
        ))}
      </div>
    ),
    '3d-tilt': (
      <div className="w-16 h-10 rounded-lg" style={{ background: colorLight, border: `1px solid ${color}`, transform: 'perspective(100px) rotateX(10deg) rotateY(-10deg)' }} />
    ),
    'particle-bg': (
      <div className="relative w-28 h-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute w-1 h-1 rounded-full"
               style={{ background: color, opacity: 0.6, left: `${(i * 37) % 90}%`, top: `${(i * 53) % 80}%` }} />
        ))}
      </div>
    ),
  };

  return previews[animId] || (
    <div className="text-2xl">✨</div>
  );
}
