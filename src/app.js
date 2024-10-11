const Blockly = require('blockly');  // Blockly 전체 모듈 가져오기
// JavaScript 코드 생성기 로드 및 할당
const { javascriptGenerator } = require('blockly/javascript');
//Blockly.JavaScript = require('blockly/javascript');

const { cstoolbox } = require("./toolbox")
//require('./ublock/robo.js')

const {showAlert, changeIp} = require("./util")
const {disCamViewWindow} = require("./video")

const fs = require('fs')
const path = require('path')
const os = require('os')


require('./styles.css');
require('./css_s/bootstrap.min.css');
const { ipcRenderer } = require('electron');

const BlocklyMsg = require('blockly/msg/ko'); // 한글 메시지를 가져옴

const { delay, turnLedOn, turnLedOff } = require("./ublock/code")


setTimeout(() => {
    console.log("loading user Block")
    require('./ublock/robo.js')
    console.log('Blockly:', Blockly);
    console.log('Blockly.JavaScript:', javascriptGenerator);
    console.log('Workspace:', workspace);
}, 500);


// // 메시지 파일을 Blockly에 적용
// Blockly.setLocale = function (locale) {
//     Object.assign(Blockly.Msg, locale);
// };

// 메시지 파일을 직접 적용
// Object.assign(Blockly.Msg, BlocklyMsg);

let workspace;
let blocklyBox;
let blocklyArea
let toolbox; // toolbox 변수를 추가
let camViewButton;
let genCode;
let runStop = true

const maxLines = 50; // 최대 줄 수 설정
const lines = []; // 출력창에 표시될 텍스트를 저장할 배열


// 로드 이벤트 리스너
window.addEventListener('load', function () {

    // if (!window.demoWorkspace && !isInitialized) {
    //     console.log("load event ==================");
    //     console.log("Initializing workspace...");
    //     isInitialized = true;  // 초기화 플래그 설정
    // }
    // else {
    //     return;
    // }

    console.log("load event ==================");
    console.log("Initializing workspace...");

    blocklyArea = document.getElementById('blocklyArea');
    console.log("blocklyArea    ", blocklyArea);

    blocklyBox = document.getElementById('blocklyBox');
    console.log("blocklyBox    ", blocklyBox);


    // toolbox XML을 가져옴
    toolbox = document.getElementById('toolbox'); // toolbox 정의
    console.log("toolbox: ", toolbox);


    if (!workspace) {
        console.log("Initializing workspace...");

        workspace = Blockly.inject(blocklyBox, {
            grid: {
                spacing: 25,
                length: 3,
                colour: '#ccc',
                snap: true
            },
            media: './media/',
            toolbox: cstoolbox,

            zoom: {
                controls: true,
                wheel: true
            }
        });

        // 워크스페이스가 성공적으로 초기화되었는지 확인
        if (workspace) {
            console.log("Workspace initialized:", workspace);
        }
        else {
            console.log("Workspace initialized: null", workspace);
        }
        window.workspace = workspace;
    }

    // 워크스페이스가 성공적으로 초기화되었는지 확인 후 리스너 등록
    if (workspace) {
        console.log('Workspace fully initialized');
        workspace.addChangeListener(workspaceChangeListener);
    } else {
        console.error("demoWorkspace is not initialized yet.");
    }

    onBloclkyBoxResize()

    window.addEventListener('resize', onBloclkyBoxResize, true);
    camViewButton = document.getElementById('camViewButton');
    console.log("camViewButton    ", camViewButton);
    camViewButton.addEventListener('click', disCamViewWindow, false);


    document.getElementById('generateCodeButton').addEventListener('click', generateJavaCode);
    document.getElementById('runCodeButton').addEventListener('click', runJavaCode);
    document.getElementById('extCodeButton').addEventListener('click', extJavaCode);
    document.getElementById('codeOut').addEventListener('click', fxCodeOut);

    document.getElementById('createFileButton').addEventListener('click', fxCreateFile);
    document.getElementById('ip_setting').addEventListener('click',changeIp);


});

// 페이지 로드 시 저장된 IP 불러오기
document.addEventListener('DOMContentLoaded', () => {
    const savedIp = localStorage.getItem('savedIp') || '192.168.0.25';
    document.getElementById('ip_add_str').textContent = savedIp;
});



function fxCreateFile() {

    const homeDirectory = os.homedir();

    const dirPath = path.join(homeDirectory, 'aiimages');
    const filePath = path.join(homeDirectory, 'aiimages', 'example.txt'); // 파일이 생성될 경로
    console.log(`save dir = ${filePath}`)

    
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // recursive 옵션을 사용하여 중간 경로도 생성
        console.log(`Directory created: ${dirPath}`);
    }

    const content = 'This is an example content for the file.\nHello, Electron!';
    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            console.error('Error creating file:', err);
        } else {
            console.log('File created successfully at:', filePath);
            //alert('File created successfully!');
            showAlert("File created successfully!", 1000)
        }
    });
}


function fxCodeOut() {


    const outputDiv = document.getElementById('code_out');
    const newText = "This is a newhjkhjhkkhhjhjjhjhhjhjhjjh line of text.";

    // 배열에 새로운 줄 추가
    lines.push(newText);

    // 최대 줄 수를 초과하면 가장 오래된 줄 삭제
    if (lines.length > maxLines) {
        lines.shift(); // 가장 오래된 줄 삭제
    }

    // 배열을 문자열로 합쳐 출력창에 표시
    outputDiv.textContent = lines.join('\n');

    // 출력창의 스크롤을 항상 맨 아래로 유지
    outputDiv.scrollTop = outputDiv.scrollHeight;

}


// Blockly JavaScript 생성기 사용
function extJavaCode() {
    console.log("end program eval")
    runStop = 0
}

// Blockly JavaScript 생성기 사용
function runJavaCode() {

    runStop = 0

    let eval_code = `
    async function runLoop() {
        ${genCode}
        console.log('Loop completed');
    }
    runLoop();
    `;

    console.log("run code = ")
    console.log(eval_code);

    try {
        runStop = 1; // 실행을 시작하는 플래그
        eval(eval_code); // 생성된 코드를 실행
    } catch (error) {
        console.error('Error executing generated code:', error);
    }

}

// Blockly JavaScript 생성기 사용
function generateJavaCode() {

    if (!workspace) {
        console.error('Workspace is not initialized.');
        return;
    }

    /// javascriptGenerator를 사용하여 코드 생성
    const code = javascriptGenerator.workspaceToCode(workspace);
    //const code = Blockly.JavaScript.workspaceToCode(workspace);
    console.log('Generated Code:\n', code);
    genCode = code;

    // 생성된 코드를 페이지의 특정 요소에 표시 (필요 시)
    //const codeOutputElement = document.getElementById('codeOutput');
    // if (codeOutputElement) {
    //   codeOutputElement.textContent = code;
    // }
}


// 리사이즈 이벤트 핸들러
// const onBloclkyBoxResize = function (e) {
//     // Compute the absolute coordinates and dimensions of blocklyArea.
//     console.log("onresize event");
//     let element = blocklyArea;
//     let x = 0;
//     let y = 0;
//     while (element) {
//         x += element.offsetLeft;
//         y += element.offsetTop;
//         element = element.offsetParent;
//     }

//     console.log(`offsetWidth offsetHeight = ${x}, ${y}, ${blocklyArea.offsetWidth}, ${blocklyArea.offsetHeight} `);

//     // Position blocklyDiv over blocklyArea.
//     blocklyBox.style.left = x + 'px';
//     blocklyBox.style.top = y + 'px';
//     blocklyBox.style.width = blocklyArea.offsetWidth + 'px';
//     blocklyBox.style.height = blocklyArea.offsetHeight + 'px';

//     Blockly.svgResize(workspace);
// };

// 리사이즈 이벤트 핸들러
const onBloclkyBoxResize = function (e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    console.log("onresize event");
    let element = blocklyArea;
    let x = 0;
    let y = 0;
    while (element) {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    }

    console.log(`offsetWidth offsetHeight = ${x}, ${y}, ${blocklyArea.offsetWidth}, ${blocklyArea.offsetHeight} `);

    // Position blocklyDiv over blocklyArea.
    blocklyBox.style.left = x + 'px';
    blocklyBox.style.top = y + 'px';
    blocklyBox.style.width = blocklyArea.offsetWidth + 'px';
    blocklyBox.style.height = blocklyArea.offsetHeight + 'px';

    Blockly.svgResize(workspace);
};





// 워크스페이스 변경 리스너
function workspaceChangeListener(event) {
    console.log("Event Type: ", event.type);

    if (event.type === Blockly.Events.CLICK) {
        console.log("Block ID: ", event.blockId);
    }
}