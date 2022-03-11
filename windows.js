const { app, BrowserWindow } = require('electron')
const main = require("./main.js")
const {SpotifyCred} = require("./api/spotify.js");
// THIS FILE CONTAINS WINDOW INFORMATION FOR HOST PANEL, VOLUME, QUEUE, AND SEARCH CONTROLS.

// Keep a reference for dev mode
let dev = false;
let volumeWindow = null;
let queueWindow = null;
let searchWindow = null;
let hostPanel = null;
const playerWidth = 650;

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

function createVolumeWindow(mainWindow, monitorWidth) {
  // Create the browser window.
  if (volumeWindow === null) {
    const mainWindowPos = mainWindow.getPosition();

    mainWindow.on("focus", () => {
      closeVolumeWindow();
    })

    volumeWindow = new BrowserWindow({
      x: mainWindowPos[0] + playerWidth + 20,
      y: mainWindowPos[1] + 20,
      width: 200,
      height: 75,
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

      if (mainWindow.theme === "Dark") {
        volumeWindow.webContents.send("colorScheme", {message: "Dark"});
      }
      else {
        volumeWindow.webContents.send("colorScheme", {message: "Light"});
      }
    })
  }
  else {
    closeVolumeWindow();
  }
}

function createQueueWindow(mainWindow, monitorWidth) {
  // Create the browser window.
  if (queueWindow === null) {
    const mainWindowPos = mainWindow.getPosition();
    mainWindow.on("focus", () => {
      closeQueueWindow();
    })

    queueWindow = new BrowserWindow({
      x: mainWindowPos[0] + playerWidth + 20,
      y: mainWindowPos[1],
      width: 400,
      height: 600,
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

      if (mainWindow.theme === "Dark") {
        queueWindow.webContents.send("colorScheme", {message: "Dark"});
      }
      else {
        queueWindow.webContents.send("colorScheme", {message: "Light"});
      }
    })
  }
  else {
    closeQueueWindow();
  }
}

function createSearchWindow(mainWindow, monitorWidth) {
  // Create the browser window.
  if (searchWindow === null) {
    const mainWindowPos = mainWindow.getPosition();
    mainWindow.on("focus", () => {
      closeSearchWindow();
    })

    searchWindow = new BrowserWindow({
      x: mainWindowPos[0] + playerWidth + 20,
      y: mainWindowPos[1],
      width: 400,
      height: 600,
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

      if (mainWindow.theme === "Dark") {
        searchWindow.webContents.send("colorScheme", {message: "Dark"});
      }
      else {
        searchWindow.webContents.send("colorScheme", {message: "Light"});
      }
    })
  }
  else {
    closeSearchWindow();
  }
}

function createHostPanelWindow(mainWindow, monitorWidth) {
    // Create the browser window.
    if (hostPanel === null) {
      // I don't think this functionality should be here for the host panel
      // mainWindow.on("focus", () => {
      //   closeHostPanelWindow();
      // })

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
  }

  function createSpotifyLoginWindow() {
    // Create the browser window.
    let spotify = new BrowserWindow({
      width: 700,
      height: 800,
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

    spotify.webContents.on("did-navigate", () => {
      // upon navigation, check if it made it to localhost (because it goes to the spotify scope page in-between)
      // if so, get the URL params and close the window
      if (spotify.webContents.getURL().substr(0, 16) === "http://localhost") {
        const result = spotify.webContents.getURL();
        const code = new URL(result).searchParams.get("code");
        //^ this should give the code but window isn't defined even tho as you type window it says the correct thing
        SpotifyCred.login(code);
        console.log("Successful Spotify Login");
        main.authSpotify();
        spotify.close();
      }
    })
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
      width: 700,
      height: 800,
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

function closeVolumeWindow() {
  try {
    if (volumeWindow !== null) {
      volumeWindow.close();
      volumeWindow = null;
    }
  }
  catch(err) {
    console.log(err);
  }
}

function closeQueueWindow() {
  try {
    if (queueWindow !== null) {
      queueWindow.close();
      queueWindow = null;
    }
  }
  catch(err) {
    console.log(err);
  }
}

function closeSearchWindow() {
  try {
    if (searchWindow !== null) {
      searchWindow.close();
      searchWindow = null;
    }
  }
  catch(err) {
    console.log(err);
  }
}

function closeHostPanelWindow() {
  try {
    if (hostPanel !== null) {
      hostPanel.close();
      hostPanel = null;
    }
  }
  catch(err) {
    console.log(err);
  }
}

module.exports = {
    createQueueWindow,
    createSearchWindow,
    createVolumeWindow,
    createHostPanelWindow,
    createSpotifyLoginWindow
}