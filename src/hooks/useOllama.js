import { useState, useEffect, useCallback, useRef } from 'react';

const getElectronAPI = () => {
  if (typeof window === 'undefined') return null;
  return window.electronAPI || null;
};

// Mock for browser testing (when not in Electron)
const mockAPI = {
  listModels: async () => ({
    success: true,
    data: {
      models: [
        { name: 'llama3.2:latest', size: 2019393189, modified_at: new Date().toISOString() },
        { name: 'llama3.1:8b', size: 4661224676, modified_at: new Date().toISOString() },
        { name: 'mistral:latest', size: 4113301824, modified_at: new Date().toISOString() },
        { name: 'codellama:13b', size: 7365960935, modified_at: new Date().toISOString() },
        { name: 'qwen2.5:7b', size: 4685548560, modified_at: new Date().toISOString() },
      ],
    },
  }),
  stream: async ({ model, prompt, systemPrompt }, onToken, onDone) => {
    // Simulate streaming in browser
    const mockResponse = `# Mock Project — Complete Development Brief for Lovable.dev

## PROJECT OVERVIEW
This is a browser preview. In the actual Electron app, this will connect to your local Ollama instance and generate a real, detailed prompt using ${model}.

## TECH STACK
- React 18 + Vite + TypeScript
- Tailwind CSS v3 with custom design tokens
- GSAP 3.12+ with ScrollTrigger, SplitText, and MorphSVG plugins
- React Router v6 for client-side routing
- Framer Motion for page transitions

## PAGES
The following pages will be built with full animation sequences...

*[In the Electron app, your local LLaMA/Ollama model will generate thousands of words of detailed instructions here]*`;

    for (let i = 0; i < mockResponse.length; i += 3) {
      await new Promise(r => setTimeout(r, 20));
      onToken(mockResponse.slice(i, i + 3));
    }
    onDone(mockResponse);
    return { success: true, content: mockResponse };
  },
  copy: async (text) => {
    await navigator.clipboard.writeText(text);
    return true;
  },
  openURL: async (url) => { window.open(url, '_blank'); },
};

const getRuntimeAPI = () => getElectronAPI() || mockAPI;

export function useOllama() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const api = getRuntimeAPI();
      const result = await api.listModels();
      if (result.success) {
        const modelList = result.data?.models || [];
        setModels(modelList);
        setIsConnected(true);
        setSelectedModel(current => current || modelList[0]?.name || '');
      } else {
        setError(result.error || 'Failed to connect to Ollama');
        setIsConnected(false);
        setModels([]);
        setSelectedModel('');
      }
    } catch (e) {
      setError(e.message);
      setIsConnected(false);
      setSelectedModel('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  const formatModelSize = (bytes) => {
    if (!bytes) return '';
    const gb = bytes / 1e9;
    return gb >= 1 ? `${gb.toFixed(1)}GB` : `${(bytes / 1e6).toFixed(0)}MB`;
  };

  return {
    models,
    selectedModel,
    setSelectedModel,
    isConnected,
    isLoading,
    error,
    refreshModels,
    formatModelSize,
    api: getRuntimeAPI(),
    isBrowser: !getElectronAPI(),
  };
}

export function useGenerate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedOutput, setStreamedOutput] = useState('');
  const [finalOutput, setFinalOutput] = useState('');
  const [progress, setProgress] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('idle'); // idle | thinking | generating | done | error
  const tokenCountRef = useRef(0);
  const progressRef = useRef(0);
  const progressInterval = useRef(null);
  const stageTimer = useRef(null);
  const finishedRef = useRef(false);

  const clearProgressTimer = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const clearStageTimer = () => {
    if (stageTimer.current) {
      clearTimeout(stageTimer.current);
      stageTimer.current = null;
    }
  };

  const startProgressSimulation = () => {
    clearProgressTimer();
    progressInterval.current = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + Math.random() * 2, 90);
      setProgress(Math.round(progressRef.current));
    }, 300);
  };

  const stopProgressSimulation = (final = 100) => {
    clearProgressTimer();
    setProgress(final);
  };

  const generate = useCallback(async ({ model, prompt, systemPrompt, onToken, onComplete, onError }) => {
    clearProgressTimer();
    clearStageTimer();
    setIsGenerating(true);
    setStreamedOutput('');
    setFinalOutput('');
    setError(null);
    setTokenCount(0);
    setStage('thinking');
    progressRef.current = 0;
    tokenCountRef.current = 0;
    finishedRef.current = false;
    startProgressSimulation();

    const electronAPI = getElectronAPI();

    // Clean up previous listeners
    if (electronAPI) {
      electronAPI.removeAllListeners('ollama:token');
      electronAPI.removeAllListeners('ollama:done');
      electronAPI.removeAllListeners('ollama:error');
    }

    stageTimer.current = setTimeout(() => {
      setStage('generating');
      stageTimer.current = null;
    }, 1500);

    const complete = (content) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      clearStageTimer();
      stopProgressSimulation(100);
      setFinalOutput(content);
      setStage('done');
      setIsGenerating(false);
      onComplete?.(content);
    };

    const fail = (err) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const message = err?.message || err || 'Generation failed';
      clearStageTimer();
      stopProgressSimulation(0);
      setError(message);
      setStage('error');
      setIsGenerating(false);
      onError?.(message);
    };

    try {
      if (electronAPI) {
        // Real Electron streaming
        electronAPI.onToken((token) => {
          if (finishedRef.current) return;
          tokenCountRef.current += token.split(/\s+/).filter(Boolean).length;
          setTokenCount(tokenCountRef.current);
          setStreamedOutput(prev => prev + token);
          onToken?.(token);
        });

        electronAPI.onDone((content) => {
          complete(content);
        });

        electronAPI.onError((err) => {
          fail(err);
        });

        const result = await electronAPI.stream({ model, prompt, systemPrompt });
        if (!result?.success) fail(result?.error);
      } else {
        // Browser mock streaming
        let accumulated = '';
        const result = await mockAPI.stream(
          { model, prompt, systemPrompt },
          (token) => {
            if (finishedRef.current) return;
            tokenCountRef.current += token.split(/\s+/).filter(Boolean).length;
            setTokenCount(tokenCountRef.current);
            accumulated += token;
            setStreamedOutput(accumulated);
            onToken?.(token);
          },
          (content) => {
            complete(content);
          }
        );
        if (!result?.success) fail(result?.error);
      }
    } catch (e) {
      fail(e);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearProgressTimer();
      clearStageTimer();
    };
  }, []);

  const reset = useCallback(() => {
    finishedRef.current = true;
    setIsGenerating(false);
    setStreamedOutput('');
    setFinalOutput('');
    setProgress(0);
    setTokenCount(0);
    setError(null);
    setStage('idle');
    clearProgressTimer();
    clearStageTimer();
  }, []);

  return {
    isGenerating,
    streamedOutput,
    finalOutput,
    progress,
    tokenCount,
    error,
    stage,
    generate,
    reset,
  };
}
