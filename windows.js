const { app, BrowserWindow, ipcMain } = require('electron')

// THIS FILE CONTAINS WINDOW INFORMATION FOR HOST PANEL, VOLUME, QUEUE, AND SEARCH CONTROLS.

// Keep a reference for dev mode
let dev = false;

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  dev = true;
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true');
  app.commandLine.appendSwitch('force-device-scale-factor', '1');
}

function createVolumeWindow() {
  // Create the browser window.
  volumeWindow = new BrowserWindow({
    width: 200,
    height: 100,
    frame: false,
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  volumeWindow.loadURL(`file://${__dirname}/dist/index.html#/volume`);

  // Don't show until we are ready and loaded
  volumeWindow.once('ready-to-show', () => {
    volumeWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      // ~mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  volumeWindow.on('closed', function() {
    volumeWindow = null
  })
}

function createQueueWindow() {
  // Create the browser window.
  queueWindow = new BrowserWindow({
    width: 400,
    height: 900,
    frame: false,
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  queueWindow.loadURL(`file://${__dirname}/dist/index.html#/queue`);

  // Don't show until we are ready and loaded
  queueWindow.once('ready-to-show', () => {
    queueWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      // ~mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  queueWindow.on('closed', function() {
    queueWindow = null
  })
}

function createSearchWindow() {
  // Create the browser window.
  searchWindow = new BrowserWindow({
    width: 400,
    height: 900,
    frame: false,
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  searchWindow.loadURL(`file://${__dirname}/dist/index.html#/search`);

  // Don't show until we are ready and loaded
  searchWindow.once('ready-to-show', () => {
    searchWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      // ~mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  searchWindow.on('closed', function() {
    searchWindow = null
  })
}

function createHostPanelWindow() {
    // Create the browser window.
    hostPanel = new BrowserWindow({
      width: 400,
      height: 900,
      frame: true, // TBD
      show: false,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
  
    hostPanel.loadURL(`file://${__dirname}/dist/index.html#/host`);
  
    // Don't show until we are ready and loaded
    hostPanel.once('ready-to-show', () => {
      hostPanel.show()
  
      // Open the DevTools automatically if developing
      if (dev) {
        const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
  
        installExtension(REACT_DEVELOPER_TOOLS)
          .catch(err => console.log('Error loading React DevTools: ', err))
        // ~mainWindow.webContents.openDevTools()
      }
    })
  
    // Emitted when the window is closed.
    hostPanel.on('closed', function() {
      hostPanel = null
    })
  }

module.exports = {
    createQueueWindow,
    createSearchWindow,
    createVolumeWindow,
    createHostPanelWindow
}