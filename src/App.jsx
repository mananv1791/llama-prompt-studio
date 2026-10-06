import React, { useState, useCallback } from 'react';
import TitleBar from './components/TitleBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ConfigureTab from './components/ConfigureTab.jsx';
import AnimationsTab from './components/AnimationsTab.jsx';
import GenerateTab from './components/GenerateTab.jsx';
import HistoryTab, { useHistory } from './components/HistoryTab.jsx';
import { useOllama, useGenerate } from './hooks/useOllama.js';

const TAB_TITLES = {
  configure: 'Configure Project',
  animations: 'Animation Designer',
  generate: 'Generate Prompt',
  history: 'Prompt History',
};

const INITIAL_CONFIG = {
  projectName: '',
  template: null,
  industry: '',
  tone: 'professional',
  colorPalette: null,
  targetAudience: '',
  uniqueValue: '',
  selectedAnimations: [],
  pages: [],
  additionalFeatures: [],
  customInstructions: '',
  customPages: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('configure');
  const [config, setConfig] = useState(INITIAL_CONFIG);

  const ollama = useOllama();
  const generator = useGenerate();
  const { history, addEntry, removeEntry, clearHistory } = useHistory();

  // Save to history when generation completes
  const handleGenerationComplete = useCallback((output) => {
    addEntry({
      projectName: config.projectName,
      template: config.template,
      industry: config.industry,
      targetAudience: config.targetAudience,
      uniqueValue: config.uniqueValue,
      pages: config.pages,
      selectedAnimations: config.selectedAnimations,
      colorPalette: config.colorPalette,
      tone: config.tone,
      additionalFeatures: config.additionalFeatures,
      customInstructions: config.customInstructions,
      customPages: config.customPages,
      model: ollama.selectedModel,
      output,
    });
  }, [config, ollama.selectedModel, addEntry]);

  // Override the generator's generate to hook into completion
  const wrappedGenerator = {
    ...generator,
    generate: (params) => generator.generate({
      ...params,
      onComplete: (output) => {
        handleGenerationComplete(output);
        params.onComplete?.(output);
      },
    }),
  };

  const loadHistoryEntry = (entry) => {
    setConfig({
      ...INITIAL_CONFIG,
      projectName: entry.projectName || '',
      template: entry.template,
      pages: entry.pages || [],
      selectedAnimations: entry.selectedAnimations || [],
      colorPalette: entry.colorPalette,
      tone: entry.tone || 'professional',
      industry: entry.industry || '',
      targetAudience: entry.targetAudience || '',
      uniqueValue: entry.uniqueValue || '',
      additionalFeatures: entry.additionalFeatures || [],
      customInstructions: entry.customInstructions || '',
      customPages: entry.customPages || false,
    });
    setActiveTab('configure');
  };

  return (
    <div className="flex flex-col h-screen bg-surface-0 overflow-hidden relative">
      {/* Title bar */}
      <TitleBar title="LLaMA Prompt Studio" subtitle={TAB_TITLES[activeTab]} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isConnected={ollama.isConnected}
          modelName={ollama.selectedModel}
        />

        {/* Content area */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Tab header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
            <div>
              <h1 className="text-sm font-semibold text-gray-200">{TAB_TITLES[activeTab]}</h1>
              {activeTab === 'configure' && (
                <p className="text-[10px] text-muted mt-0.5">Set up your project, choose a template, and customize the pages</p>
              )}
              {activeTab === 'animations' && (
                <p className="text-[10px] text-muted mt-0.5">Select GSAP animations to include in your generated prompt</p>
              )}
              {activeTab === 'generate' && (
                <p className="text-[10px] text-muted mt-0.5">Generate a detailed Lovable.dev prompt using your local LLaMA model</p>
              )}
              {activeTab === 'history' && (
                <p className="text-[10px] text-muted mt-0.5">{history.length} saved prompts · stored locally</p>
              )}
            </div>

            {/* Quick status */}
            <div className="flex items-center gap-3">
              {config.template && (
                <span className="badge bg-surface-3 text-gray-300 text-[10px] border border-border">
                  {config.template.icon} {config.template.name}
                </span>
              )}
              {(config.selectedAnimations?.length || 0) > 0 && (
                <span className="badge bg-accent/15 text-accent-light border border-accent/25 text-[10px]">
                  ✨ {config.selectedAnimations.length} animations
                </span>
              )}
              {ollama.isConnected && (
                <span className="badge bg-teal/10 text-teal border border-teal/25 text-[10px]">
                  🟢 {ollama.selectedModel?.split(':')[0] || 'Ollama'}
                </span>
              )}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden p-4">
            {activeTab === 'configure' && (
              <ConfigureTab config={config} onConfigChange={setConfig} ollama={ollama} />
            )}
            {activeTab === 'animations' && (
              <AnimationsTab config={config} onConfigChange={setConfig} />
            )}
            {activeTab === 'generate' && (
              <GenerateTab config={config} ollama={ollama} generator={wrappedGenerator} />
            )}
            {activeTab === 'history' && (
              <HistoryTab
                history={history}
                onRemove={removeEntry}
                onClearAll={clearHistory}
                onLoad={loadHistoryEntry}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
