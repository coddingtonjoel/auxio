const { Menu, BrowserWindow } = require("electron");
const WindowsModule = require("./windows");

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
          }
        ],
      });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}

module.exports = AppMenu;