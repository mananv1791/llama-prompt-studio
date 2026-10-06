const { app, BrowserWindow, ipcMain, shell, clipboard } = require('electron');
const path = require('path');
const http = require('http');

const isDev = !app.isPackaged;
const OLLAMA_TIMEOUT_MS = 120000;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.png'),
    show: false,
  });

  win.once('ready-to-show', () => win.show());

  if (isDev) {
    win.loadURL('http://localhost:5173');
    if (process.env.OPEN_DEVTOOLS === '1') {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ─── IPC: List Ollama Models ───────────────────────────────────────────────
ipcMain.handle('ollama:list-models', async () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:11434/api/tags', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          resolve({ success: false, error: `Ollama returned HTTP ${res.statusCode}` });
          return;
        }
        try {
          resolve({ success: true, data: JSON.parse(data) });
        } catch {
          resolve({ success: false, error: 'Failed to parse response' });
        }
      });
    });
    req.on('error', (e) => resolve({ success: false, error: e.message }));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({ success: false, error: 'Ollama not running. Start with: ollama serve' });
    });
  });
});

// ─── IPC: Generate Prompt via Ollama ─────────────────────────────────────
ipcMain.handle('ollama:generate', async (event, { model, prompt, systemPrompt }) => {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      stream: false,
      options: { temperature: 0.85, top_p: 0.95, num_predict: 4096 },
    });

    const options = {
      hostname: 'localhost',
      port: 11434,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          resolve({ success: false, error: data || `Ollama returned HTTP ${res.statusCode}` });
          return;
        }
        try {
          const parsed = JSON.parse(data);
          resolve({ success: true, content: parsed.message?.content || parsed.response || '' });
        } catch {
          resolve({ success: false, error: 'Failed to parse Ollama response' });
        }
      });
    });

    req.on('error', (e) => resolve({ success: false, error: e.message }));
    req.setTimeout(OLLAMA_TIMEOUT_MS, () => {
      req.destroy();
      resolve({ success: false, error: 'Request timed out after 120 seconds' });
    });
    req.write(body);
    req.end();
  });
});

// ─── IPC: Stream Generate (for real-time output) ─────────────────────────
ipcMain.handle('ollama:stream', async (event, { model, prompt, systemPrompt }) => {
  const sender = event.sender;

  const send = (channel, payload) => {
    if (!sender.isDestroyed()) sender.send(channel, payload);
  };

  return new Promise((resolve) => {
    let settled = false;
    let doneSent = false;
    let fullContent = '';
    let lineBuffer = '';

    const settle = (result) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    const finishWithError = (error) => {
      doneSent = true;
      send('ollama:error', error);
      settle({ success: false, error });
    };

    const body = JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      stream: true,
      options: { temperature: 0.85, top_p: 0.95, num_predict: 4096 },
    });

    const options = {
      hostname: 'localhost',
      port: 11434,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };

    const handleLine = (line) => {
      if (!line.trim()) return;
      try {
        const parsed = JSON.parse(line);
        if (parsed.error) {
          finishWithError(parsed.error);
          return;
        }

        const token = parsed.message?.content || parsed.response || '';
        if (token) {
          fullContent += token;
          send('ollama:token', token);
        }

        if (parsed.done && !doneSent) {
          doneSent = true;
          send('ollama:done', fullContent);
        }
      } catch {
        // Ignore malformed fragments; the next chunk may complete them.
      }
    };

    const req = http.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        let errorBody = '';
        res.on('data', (chunk) => (errorBody += chunk));
        res.on('end', () => {
          finishWithError(errorBody || `Ollama returned HTTP ${res.statusCode}`);
        });
        return;
      }

      res.on('data', (chunk) => {
        lineBuffer += chunk.toString();
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop() || '';
        lines.forEach(handleLine);
      });
      res.on('end', () => {
        if (lineBuffer) handleLine(lineBuffer);
        if (!doneSent) {
          doneSent = true;
          send('ollama:done', fullContent);
        }
        settle({ success: true, content: fullContent });
      });
    });

    req.on('error', (e) => {
      finishWithError(e.message);
    });
    req.setTimeout(OLLAMA_TIMEOUT_MS, () => {
      req.destroy(new Error('Request timed out after 120 seconds'));
    });
    req.write(body);
    req.end();
  });
});

// ─── IPC: Copy to Clipboard ───────────────────────────────────────────────
ipcMain.handle('app:copy', async (event, text) => {
  clipboard.writeText(text);
  return true;
});

// ─── IPC: Open External URL ───────────────────────────────────────────────
ipcMain.handle('app:open-url', async (event, url) => {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Only http and https URLs can be opened');
    }
    await shell.openExternal(parsed.toString());
    return true;
  } catch (e) {
    return { success: false, error: e.message };
  }
});
