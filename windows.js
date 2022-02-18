const { app, BrowserWindow, ipcMain } = require('electron')
const main = require("./main.js")
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
    icon: `${__dirname}/src/assets/images/logo.png`,
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
    icon: `${__dirname}/src/assets/images/logo.png`,
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
    icon: `${__dirname}/src/assets/images/logo.png`,
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
      icon: `${__dirname}/src/assets/images/logo.png`,
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

  function createSpotifyLoginWindow() {
    // Create the browser window.
    spotify = new BrowserWindow({
      width: 500,
      height: 500,
      frame: true, // TBD
      show: false,
      icon: `${__dirname}/src/assets/images/logo.png`,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });


    spotify.loadURL("https://accounts.spotify.com/authorize?client_id=2bab0f940a6547628f9beb01de54e982&response_type=code&redirect_uri=http://localhost:8080&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state");
    var result = window.location.search;
    //const code = new URLSearchParams(window.location.search).get('code')
    //^ this should give the code but window isnt defined even tho as you type window it says the correct thing
    console.log(code);
    main.authSpotify();
    spotify.close();

    // Don't show until we are ready and loaded
    spotify.once('ready-to-show', () => {
      spotify.show()
  
      // Open the DevTools automatically if developing
      if (dev) {
        const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
  
        installExtension(REACT_DEVELOPER_TOOLS)
          .catch(err => console.log('Error loading React DevTools: ', err))
        // ~mainWindow.webContents.openDevTools()
      }
    })
   
    // Emitted when the window is closed.
    spotify.on('closed', function() {
      hostPanel = null
    })
  }

  function createGoogleLoginWindow() {
    // Create the browser window.
    google = new BrowserWindow({
      width: 500,
      height: 500,
      frame: true, // TBD
      show: false,
      icon: `${__dirname}/src/assets/images/logo.png`,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
  
    google.loadURL("https://www.google.com/");
  
    // Don't show until we are ready and loaded
    google.once('ready-to-show', () => {
      google.show()
  
      // Open the DevTools automatically if developing
      if (dev) {
        const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
  
        installExtension(REACT_DEVELOPER_TOOLS)
          .catch(err => console.log('Error loading React DevTools: ', err))
        // ~mainWindow.webContents.openDevTools()
      }
    })
  
    // Emitted when the window is closed.
    google.on('closed', function() {
      hostPanel = null
    })
  }

module.exports = {
    createQueueWindow,
    createSearchWindow,
    createVolumeWindow,
    createHostPanelWindow,
    createSpotifyLoginWindow,
    createGoogleLoginWindow
}