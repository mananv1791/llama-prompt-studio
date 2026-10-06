const { contextBridge, ipcRenderer } = require('electron');

const STREAM_CHANNELS = new Set(['ollama:token', 'ollama:done', 'ollama:error']);

const onStreamEvent = (channel, callback) => {
  const listener = (_, payload) => callback(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
};

contextBridge.exposeInMainWorld('electronAPI', {
  // Ollama
  listModels: () => ipcRenderer.invoke('ollama:list-models'),
  generate: (params) => ipcRenderer.invoke('ollama:generate', params),
  stream: (params) => ipcRenderer.invoke('ollama:stream', params),

  // Streaming events
  onToken: (callback) => onStreamEvent('ollama:token', callback),
  onDone: (callback) => onStreamEvent('ollama:done', callback),
  onError: (callback) => onStreamEvent('ollama:error', callback),
  removeAllListeners: (channel) => {
    if (STREAM_CHANNELS.has(channel)) ipcRenderer.removeAllListeners(channel);
  },

  // App utilities
  copy: (text) => ipcRenderer.invoke('app:copy', text),
  openURL: (url) => ipcRenderer.invoke('app:open-url', url),

  // Platform
  platform: process.platform,
});
