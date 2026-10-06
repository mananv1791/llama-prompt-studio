import React from 'react';

export default function TitleBar({ title, subtitle }) {
  return (
    <div className="h-11 flex items-center justify-between px-4 border-b border-border drag-region shrink-0 relative z-10">
      <div className="flex items-center gap-3">
        {/* macOS traffic lights placeholder */}
        <div className="flex gap-1.5 -webkit-app-region-no-drag">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e] opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] opacity-80" />
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-300 tracking-wide">
          {title || 'LLaMA Prompt Studio'}
        </span>
        {subtitle && (
          <>
            <span className="text-subtle text-xs">/</span>
            <span className="text-xs text-muted">{subtitle}</span>
          </>
        )}
      </div>

      <div className="w-16" /> {/* spacer */}
    </div>
  );
}
