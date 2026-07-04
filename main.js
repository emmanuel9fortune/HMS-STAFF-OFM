const bonjour = require('bonjour')()
const { app, BrowserWindow, Notification, powerSaveBlocker, screen, ipcMain } = require('electron');
const path = require('path');
// require('electron-reload')(__dirname, {
//     watch:[
//         path.join(__dirname, './hospital-client/public'),
//         path.join(__dirname, './hospital-client/src')
//     ]
// })
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');



///////////////////////////////////////////////////////
// Create Express Server
function createServer() {
    const serverApp = express();
    serverApp.use(cors({
        origin: "*" ,
        methods: ['GET', 'POST'],
    }));
    serverApp.use((req, res, next)=>{
      req.setTimeout(15000)
      req.setTimeout(15000)
      next()
    })
    
    serverApp.use(express.json());
    serverApp.use(cookieParser());
    serverApp.use(bodyParser.json());
    
    const buildPath = path.join(__dirname, 'hospital', 'build');
    serverApp.use(express.static(buildPath));

    serverApp.get('/', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });


    serverApp.set('trust proxy', 1);
    
    serverApp.post('/notify', (req, res)=>{

      const message = req.body.message

      try {
        const notification = new Notification({
            title: 'NOTIFICATION',
            body: message
        });

        notification.onclick = () => {};
        notification.show();
      } catch (error) {
        //console.log(error);
      }
    })
    serverApp.use((req, res) => {
        res.status(404).send(`Route not found: ${req.method} ${req.originalUrl}`);
    });

    
  serverApp.listen(4000, '0.0.0.0', () => {
    console.log('Server running on http://localhost:4000');

    // 👇 publish service for discovery
    // bonjour.publish({
    //   name: 'ofm_Med_Server',
    //   type: 'http',
    //   port: 4000
    // });
  });
}

///////////////////////////////////////////////////////
// Create Electron Window
function createWindow() {

  const {width, height} = screen.getPrimaryDisplay().workAreaSize

  
  const win = new BrowserWindow({
      width,
      height,
      webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          icon: path.join(__dirname, 'logo.jpg'),
          contextIsolation: true,
          nodeIntegration: false
      }
  });
  // win.loadURL('http://localhost:3000')
  // win.use(express.static(path.join(__dirname, 'hospital', 'build')));
  const buildPath = path.join(__dirname, 'hospital', 'build', 'index.html');
  win.loadFile(buildPath)

  // win.webContents.openDevTools()
  const notification = new Notification({
      title: 'My Electron App',
      body: 'This is a notification from your app!'
  });

  notification.onclick = () => {};
  notification.show();
}
///////////////////////////////////////////////////////
// App Lifecycle

function discoverBonjourService() {
  try {
      return new Promise((resolve, reject) => {
      const browser = bonjour.find({ type: 'http' });

      browser.on('up', (service) => {
        if (service.name === 'ofm_Med_Server') {
          const ip = service.addresses[0]; // IP address of the host
          console.log("Discovered IP:", ip);
          browser.stop(); // Stop discovery once found
          resolve(ip);
        }
      });

      setTimeout(() => {
        browser.stop();
        reject('Service not found');
      }, 5000);
    });
  } catch (error) {
    //console.log(error)
  }

}

ipcMain.handle('get-server-ip', async () => {
  try {
    const ip = await discoverBonjourService();
    return ip;
  } catch (err) {
    return null;
  }
});


app.commandLine.appendSwitch(
    "disable-http-cache"
)

app.whenReady().then(async() => {
    
    createServer();
    createWindow();
    const notification = new Notification({
        title: 'O.F.M. Medical center',
        body: 'Nurses dashboard display'
    });
    notification.onclick = () => {};
    notification.show();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

 