const { Menu, BrowserWindow } = require("electron");
const WindowsModule = require("./windows");
const SpotifyLogin =  require("./api/spotify.js");
const {Database} = require("./api/firebase.js");
const googleLogin = require("./api/google.js");
const {Session} = require("./session.js");

const isMac = process.platform === "darwin";

class AppMenu extends Menu {
  // add any window objects needed to constructor
  constructor(isDev, win) {
    super();

    let template = [];

    if (isMac) {
      template.unshift({
        role: "appMenu",
      });
    }

    template.push({
      label: "Preferences",
      submenu: [
        {
          label: "Toggle Light/Dark Mode",
          click: () => {
              // send color scheme event to all open windows
              if (win.theme === "Light") {
                win.theme = "Dark";
              }
              else if (win.theme === "Dark") {
                win.theme = "Light";
              }
              const windows = BrowserWindow.getAllWindows();
              windows.forEach((w) => {
                w.webContents.send("colorScheme", {message: win.theme});
              })

          },
          accelerator: "CmdOrCtrl+P"
        }
      ]
    });

    if (isDev) {
      template.push({
        label: "Developer",
        submenu: [
          { role: "reload" },
          { role: "forcereload" },
          { type: "separator" },
          { role: "toggledevtools" },
          {
            label: "Test IPC",
            click: () => {
                win.webContents.send("ipcTest");
            }
          },
          {
            label: "createVolumeWindow()",
            click: () => {
                WindowsModule.createVolumeWindow();
            }
          },
          {
            label: "createQueueWindow()",
            click: () => {
                WindowsModule.createQueueWindow();
            }
          },
          {
            label: "createSearchWindow()",
            click: () => {
                WindowsModule.createSearchWindow();
            }
          },
          {
            label: "createHostPanelWindow()",
            click: () => {
              WindowsModule.createHostPanelWindow();
            }
          },

          {
            label: "FirebaseAuth()", //CALL THIS BEFORE REQUESTING/MODIFYING DATA FROM FIREBASE
            click: () => {
              Database.initServer();
              Database.requestCredentials();
            }
          },
          {
            label: "DatabaseTestCreate()",
            click: () => {
              Database.createData("userData/user1123581321345589",
                {
                  "param1": "stringInput",
                  "param2": 69720375,
                  "param3": 3.14
                }
              );
            }

          },
          {
            label: "DatabaseTestRead()",
            click: () => {
              Database.getData("userData/user1123581321345589", (snapshot) => { console.log(snapshot.val()); });
            }
          },
          {
            label: "createSession",
            click: () => {
                Session.createSession();
                let id = Session.getId();
                console.log("Created Session With Id:", id); //for debugging or seeing attribute names
            }
          },
          {
            label: "deleteSession",
            click: () => {
                let id = Session.getId();
                if(id != ""){
                    Session.deleteSession();
                    console.log("Deleted Session With Id:", id); //for debugging or seeing attribute names
                }
            }
          },
          {
            label: "joinSession",
            click: () => {
                Session.joinSession("GOO-ZK7-10MG")
                setTimeout(() => {
                  console.log(Session.test());
                }, 3000);
            }
          },
          {
            label: "queueSong",
            click: () => {
                Session.queueSong("Bury a Friend");
            }
          },
          {
            label: "loginSpotify()",
            click: () => {
              SpotifyLogin.login();
            }
          },
          {
            label: "DatabaseTestDelete()",
            click: () => {
              Database.createData("userData/user1123581321345589", {});
            }
          }

        ],
      });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}

module.exports = AppMenu;