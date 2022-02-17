// C:\Users\sdkca\Desktop\electron-workspace\build.js
var electronInstaller = require("electron-winstaller");
// In this case, we can use relative paths
var settings = {
  // Specify the folder where the built app is located
  appDirectory: "./release/win/Auxio-win32-x64",
  // Specify the existing folder where
  outputDirectory: "./release/installers/windows",
  // The name of the Author of the app (the name of your company)
  authors: "Joel Coddington, Daniel March, Jeston Bond",
  // The name of the executable of your built
  exe: "./Auxio.exe",
  description: "Collaborative Spotify Player",
};

electronInstaller.createWindowsInstaller(settings).then(
  () => {
    console.log("Installer creation succeeded.");
  },
  (e) => {
    console.log(`Installer creation error: ${e.message}`);
  }
);
