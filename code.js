const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const vosk = require('vosk');
const wav = require('wav');
const ffmpeg = require('fluent-ffmpeg');

// Enable remote module
require('@electron/remote/main').initialize();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, '../assets/icon.png')
  });

  // Enable remote for this window
  require('@electron/remote/main').enable(mainWindow.webContents);

  const isDev = process.env.NODE_ENV === 'development';
 
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('select-audio-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Audio Files', extensions: ['wav', 'mp3', 'mp4', 'flac', 'ogg', 'm4a'] }
    ]
  });
 
  return result;
});

ipcMain.handle('select-model-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Vosk Model Directory'
  });
 
  return result;
});

ipcMain.handle('convert-audio', async (event, inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('wav')
      .audioFrequency(16000)
      .audioChannels(1)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .save(outputPath);
  });
});

ipcMain.handle('transcribe-audio', async (event, audioPath, modelPath) => {
  try {
    if (!fs.existsSync(modelPath)) {
      throw new Error('Model path does not exist');
    }

    // Initialize Vosk model
    vosk.setLogLevel(-1);
    const model = new vosk.Model(modelPath);
    const rec = new vosk.KaldiRecognizer(model, 16000);
   
    return new Promise((resolve, reject) => {
      const results = [];
      let isComplete = false;

      const reader = new wav.Reader();
     
      reader.on('format', (format) => {
        if (format.audioFormat !== 1 || format.sampleRate !== 16000 || format.channels !== 1) {
          reject(new Error('Audio format must be WAV 16kHz mono PCM'));
          return;
        }
      });

      reader.on('data', (chunk) => {
        if (!isComplete) {
          const result = rec.AcceptWaveform(chunk);
          if (result) {
            const partial = JSON.parse(rec.Result());
            if (partial.text) {
              results.push(partial.text);
              // Send progress to renderer
              event.sender.send('transcription-progress', {
                text: partial.text,
                isPartial: false
              });
            }
          } else {
            const partial = JSON.parse(rec.PartialResult());
            if (partial.partial) {
              event.sender.send('transcription-progress', {
                text: partial.partial,
                isPartial: true
              });
            }
          }
        }
      });

      reader.on('end', () => {
        if (!isComplete) {
          isComplete = true;
          const final = JSON.parse(rec.FinalResult());
          if (final.text) {
            results.push(final.text);
          }
         
          rec.delete();
          model.delete();
         
          resolve(results.join(' '));
        }
      });

      reader.on('error', (err) => {
        if (!isComplete) {
          isComplete = true;
          reject(err);
        }
      });

      // Read the audio file
      const stream = fs.createReadStream(audioPath);
      stream.pipe(reader);
     
      stream.on('error', (err) => {
        if (!isComplete) {
          isComplete = true;
          reject(err);
        }
      });
    });

  } catch (error) {
    throw error;
  }
});

ipcMain.handle('save-transcript', async (event, transcript) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled) {
    fs.writeFileSync(result.filePath, transcript);
    return result.filePath;
  }
 
  return null;
});
