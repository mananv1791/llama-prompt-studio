import React from 'react';

const NAV_ITEMS = [
  { id: 'configure', icon: '⚙️', label: 'Configure' },
  { id: 'animations', icon: '✨', label: 'Animations' },
  { id: 'generate', icon: '🤖', label: 'Generate' },
  { id: 'history', icon: '📋', label: 'History' },
];

export default function Sidebar({ activeTab, onTabChange, isConnected, modelName }) {
  return (
    <aside className="w-[68px] flex flex-col items-center py-4 gap-1 border-r border-border shrink-0 relative z-10">
      {/* Logo */}
      <div className="mb-4 mt-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-teal flex items-center justify-center shadow-accent-sm">
          <span className="text-lg">⚡</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 w-full px-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            title={item.label}
            className={`
              relative flex flex-col items-center justify-center w-full py-2.5 rounded-lg
              transition-all duration-200 group
              ${activeTab === item.id
                ? 'bg-accent/20 text-accent-light'
                : 'text-muted hover:text-gray-300 hover:bg-surface-3'
              }
            `}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-[9px] mt-1 font-medium leading-none">{item.label}</span>
            {activeTab === item.id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Connection status at bottom */}
      <div className="mt-auto flex flex-col items-center gap-1">
        <div
          title={isConnected ? `Connected: ${modelName}` : 'Ollama not connected'}
          className={`w-2 h-2 rounded-full ${isConnected ? 'bg-teal animate-pulse-slow' : 'bg-red-500'}`}
        />
        <span className="text-[9px] text-muted">{isConnected ? 'live' : 'off'}</span>
      </div>
    </aside>
  );
}
