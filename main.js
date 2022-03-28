// Import parts of electron to use
const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')
const url = require('url')
const AppMenu = require("./AppMenu");
const { Session } = require("./session.js");
const WindowsModule = require("./windows");
const {GoogleCred} = require("./api/google.js");
const {Database} = require("./api/firebase.js");
const {SpotifyCred} = require("./api/spotify");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

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

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // width: 450,
    // height: 600,
    width: 900,
    height: 600,
    show: false,
    resizable: false,
    icon: `${__dirname}/src/assets/images/logo.png`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  let indexPath

  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }
  mainWindow.loadURL(indexPath)

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      // ~mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createMainWindow();
  const mainScreen = screen.getPrimaryDisplay;
  const monitorWidth = mainScreen().size.width;
  new AppMenu (dev, mainWindow);
  mainWindow.theme = "Light";
  // ipcMain listeners go here!

  // ex: listener with data param
  ipcMain.on("test:withParam", (e, data) => {
    console.log(data.message);
  })

  // ex: listener without data param
  ipcMain.on("test:withoutParam", () => {
    console.log("This is a message sent via a console.log() in main.js.");
  })

  // resize mainWindow to player size
  ipcMain.on("windowSize:player", () => {
    if (process.platform === 'darwin') {
      mainWindow.setSize(650, 460, true);
    }
    else {
      mainWindow.setSize(650, 480, true);
    }
  });

  // resize mainWindow to welcome/connect size
  ipcMain.on("windowSize:welcome", () => {
    mainWindow.setSize(900, 600, true);
  })

  ipcMain.on("createSession", () => {
      const id = Session.createSession();
      mainWindow.webContents.send("createSession:success", {id});
  })

  ipcMain.on("getID", () => {
    let id = Session.getId();
    mainWindow.webContents.send("getID:return", {id});
  })

  ipcMain.on("joinSession", (e, data) => {
    Session.joinSession(data.id).then(res => {
      if (res) {
        mainWindow.webContents.send("joinSession:success");
      }
      else {
        mainWindow.webContents.send("joinSession:failure");
      }
    });
  })

  ipcMain.on("login:googleSuccess", (e, cred) => {
    console.log("Google Login Success");
    GoogleCred.setCredentials(cred);
    Database.initServer();
    //console.log(GoogleCred.getCredentials()); //for debugging or seeing attribute names
  })
  ipcMain.on("login:googleFailure", (e, mess) => {
    console.log("Google Login Failure");
    //console.log(mess); //for debugging or seeing error codes
  })

  ipcMain.on("setTheme", () => {
    // send color scheme event to all open windows
    if (mainWindow.theme === "Light") {
      mainWindow.theme = "Dark";
    }
    else if (mainWindow.theme === "Dark") {
      mainWindow.theme = "Light";
    }
    else mainWindow.theme = "Light";
    console.log(mainWindow.theme);
  })

  ipcMain.on("getSpotifyToken", (e) => {
    e.sender.send("getSpotifyToken:return", {token: SpotifyCred.accessT});
  })

  // window openers/closers for frontend use
  ipcMain.on("login:spotify", () => {
    WindowsModule.createSpotifyLoginWindow();
  })

  ipcMain.on("open:volume", () => {
    WindowsModule.createVolumeWindow(mainWindow, monitorWidth);
  })

  ipcMain.on("open:queue", () => {
    WindowsModule.createQueueWindow(mainWindow, monitorWidth);
  })

  ipcMain.on("open:search", () => {
    WindowsModule.createSearchWindow(mainWindow, monitorWidth);
  })

  ipcMain.on("open:hostpanel", () => {
    WindowsModule.createHostPanelWindow(mainWindow, monitorWidth);
  })

  ipcMain.on("search", (e, data) => {
    SpotifyCred.search(data.query).then((res) => {
      e.sender.send("search:res", {res})
    });
  })

  ipcMain.on("queue:add", (e, data) => {
    Session.queueSong(data.song);
  })

  ipcMain.on("queue:fetch", (e) => {
    // session queue can never truly be empty (due to firebase limitations), so check if the first queue item is a blank song template
    if (Session.queue[0].id !== "") {
      e.sender.send("queue:return", {queue: Session.queue});
    }
    else {
      e.sender.send("queue:return", {queue: []});
    }
  })

  ipcMain.on("queue:delete", (e, data) => {
    Session.deleteSong(data.song.id);
  })

  ipcMain.on("queue:update", (e, data) => {
    Session.changeQueue(data.queue);
  })

  ipcMain.on("currentSong:change", (e, data) => {
    console.log(data.song);
    console.log(data.newTime);
    Session.changeCurrentSong(data.song);

    // band-aid solution; this should be changed to send back the new song time from the session ideally
    if (data.newTime === 0) {
      mainWindow.webContents.send("player:change", {song: data.song});
    }
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on("before-quit", () => {
  // if session host quits the app, end the session
  Session.deleteSession();
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function authSpotify(){
  //console.log("Success!");
  mainWindow.webContents.send("auth:spotify");
}

exports.authSpotify = authSpotify;