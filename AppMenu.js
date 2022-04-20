const { Menu, BrowserWindow } = require("electron");
const WindowsModule = require("./windows");
const SpotifyLogin =  require("./api/spotify.js");
const {Database} = require("./api/firebase.js");
const {Session} = require("./session.js");
const {songStruct, SpotifyCred} = require("./api/spotify.js")

const isMac = process.platform === "darwin";

class AppMenu extends Menu {
  // add any window objects needed to constructor
  constructor(isDev, win) {
    super();

    let template = [
      {
        role: "editMenu",
      }
    ];

    if (isMac) {
      template.unshift({
        role: "appMenu",
      });
    }

    template.push({
      label: "Session",
      submenu: [
        {
          label: "Leave Session",
          accelerator: "CmdOrCtrl+L",
          click: () => {
              Session.leaveSession();
              win.webContents.send("session:leave");
              console.log("Left the session");
          }
        },
      ]
    });

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
            label: "DatabaseTestReadOnce()", //CALL THIS BEFORE REQUESTING/MODIFYING DATA FROM FIREBASE
            click: () => {
              Database.getDataOnce("userData/user1123581321345589").then((snapshot) => 
              {

                if (snapshot.exists()) {
                  console.log(snapshot.val()); //data retrieved
                } else { //found on database but field is nonexistent
                  console.log("No data available");
                }

              }).catch((error) => {
                console.log("Data not found");
              });
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
            label: "DatabaseTestRemoveListener()",
            click: () => {
              Database.removeAllListeners("userData/user1123581321345589");
            }
          },
          {
            label: "DatabaseTestDelete()",
            click: () => {
              Database.createData("userData/user1123581321345589", {});
            }
          },
          {
            label: "shuffleQueue",
            click: () => {
                Session.shuffleQueue();
      
            }
          },
          {
            label: "nextSong",
            click: () => {
                Session.nextSong();
            }
          },
          {
            label: "joinSession",
            click: () => {
                Session.joinSession("2FI-ULR-844P");
                console.log("Joined the session");
            }
          },
          {
            label: "getHostInfo",
            click: () => {
                SpotifyCred.getHostPlaylists();
            }
          },
          {
            label: "queuePlaylist",
            click: () => {
              SpotifyCred.getHostPlaylists().then(function(data1){
                SpotifyCred.getSongsInPlaylist(data1[0].id).then(function(data2) {
                  data2.forEach(item => { //Get every Artist
                    Session.queueSong(item);
                  });
                });
              });
                
            }
          },
          {
            label: "deleteSong",
            click: () => {
                Session.clearQueue();  
              //Session.deleteSong("test");
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