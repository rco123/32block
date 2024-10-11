
const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1580,
    height: 900,
    icon: path.join(__dirname, '../dist/', 'favicon.ico'),  // favicon 경로 직접 설정
    frame: true,
    webPreferences: {
      nodeIntegration: true,  // Node.js API 통합
      contextIsolation: false, // IPC 사용을 위해 contextIsolation 비활성화
      
      //enableRemoteModule: false,  // 원격 모듈 비활성화
      //sandbox: true  // 샌드박스 모드 활성화
    },
    
  })

//   mainWindow.webContents.session.clearStorageData({
//     storages: ['autofill'],
//   });
  

  //mainWindow.loadURL('http://localhost:3000')
  // dist 폴더에 생성된 index.html을 로드
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))

  // 메뉴 바 제거
  Menu.setApplicationMenu(null)

  // DevTools 자동 열기
  mainWindow.webContents.openDevTools();

  // DevTools 열기/닫기 단축키 설정
  app.whenReady().then(() => {
    
    // 다른 펑션 키 (예: F5)로도 DevTools 제어 가능
    globalShortcut.register('F5', () => {
      mainWindow.webContents.toggleDevTools();   // DevTools 열기/닫기 토글
    });
  });

}


app.whenReady().then(createWindow)

// 메인 프로세스에서 렌더러 프로세스로부터 메시지를 수신
ipcMain.on('request-data', (event, arg) => {
  console.log('Received message from renderer:', arg)
  
  // 렌더러 프로세스로 응답 전송
  event.reply('response-data', 'Hello from the main process!')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

