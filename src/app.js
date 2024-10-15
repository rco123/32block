const Blockly = require('blockly');  // Blockly 전체 모듈 가져오기
require('blockly/javascript');

require('./custom-dialog')

// Block Load
require('./ublock/robo.js')
require('./ublock/cam.js')
require('./ublock/det.js')
require('./ublock/data.js')
require('./ublock/loop.js')
require('./ublock/print.js')

window.print=''; // 프린트가 대신 동작하는것을 방지

// JavaScript 코드 생성기 로드 및 할당
const { javascriptGenerator } = require('blockly/javascript');
const { xtoolbox ,mtoolbox} = require("./ublock/toolbox.js")

const {showAlert, changeIp, fx_blk_file_save,  
    fx_blk_clear, fx_blk_file_read, } = require("./util")
const {AddAiCarImage, disCamViewWindow} = require("./video")

const fs = require('fs')
const path = require('path')
const os = require('os')


require('./styles.css');
require('./css_s/bootstrap.min.css');

//require('./custom-dialog.js')

const { ipcRenderer } = require('electron');
const BlocklyMsg = require('blockly/msg/ko'); // 한글 메시지를 가져옴
//const { robo_delay, robo_beep } = require("./ublock/robo.js")
const {runJavaCode, extJavaCode} = require("./runCode")
const {fxCodeOutClean} = require("./ublock/print")


// // 메시지 파일을 Blockly에 적용
// Blockly.setLocale = function (locale) {
//     Object.assign(Blockly.Msg, locale);
// };
// 메시지 파일을 직접 적용
// Object.assign(Blockly.Msg, BlocklyMsg);


window.workspace;
window.blocklyBox;
window.blocklyArea
window.runStop = true // 코드를 실행중지 제어
window.isCapturing = false; // 영상수집결정
window.angle = 0;


let toolbox; // toolbox 변수를 추가
let camViewButton;
let genCode;

const maxLines = 50; // 최대 줄 수 설정
const lines = []; // 출력창에 표시될 텍스트를 저장할 배열


// 로드 이벤트 리스너
window.addEventListener('load', function () {


    console.log("load event ==================");
    console.log("Initializing workspace...");

    window.blocklyArea = document.getElementById('blocklyArea');
    console.log("blocklyArea    ", blocklyArea);

    window.blocklyBox = document.getElementById('blocklyBox');
    console.log("blocklyBox    ", blocklyBox);

   
    initBlockly();
    onBloclkyBoxResize()
    AddAiCarImage(); // 초기에 이미지를 삽입한다.
    
    loadWorkspace(); // 바탕화면 불러오기

    this.window.addEventListener('resize', onBloclkyBoxResize, true);

    
    document.getElementById('camViewButton').addEventListener('click', () => {
        window.isCapturing = false
        disCamViewWindow();
    });

    // document.getElementById('generateCodeButton').addEventListener('click', generateJavaCode);
    // document.getElementById('runCodeButton').addEventListener('click', runJavaCode);
    // document.getElementById('extCodeButton').addEventListener('click', extJavaCode);
    // document.getElementById('codeOut').addEventListener('click', fxCodeOut);

    document.getElementById('save_workspace').addEventListener('click', saveWorkspace);
    
    document.getElementById('code_run').addEventListener('click',runJavaCode);
    document.getElementById('code_kill').addEventListener('click',extJavaCode);
    document.getElementById('code_clear').addEventListener('click',fxCodeOutClean);
    
    document.getElementById('ip_setting').addEventListener('click',changeIp);

    document.getElementById('fblockSave').addEventListener('click',fx_blk_file_save);
    document.getElementById('blockClear').addEventListener('click',fx_blk_clear);
    document.getElementById('fblockRead').addEventListener('click',fx_blk_file_read);


});

// 페이지 로드 시 저장된 IP 불러오기
document.addEventListener('DOMContentLoaded', () => {
    const savedIp = localStorage.getItem('savedIp') || '192.168.0.25';
    document.getElementById('ip_add_str').textContent = savedIp;

});


function saveWorkspace() {
    // 워크스페이스를 XML 형식으로 변환
    const xml = Blockly.Xml.workspaceToDom(window.workspace);

    // XML을 문자열로 변환 (저장하기 위한 문자열 데이터)
    const xmlText = Blockly.Xml.domToText(xml);

    // 로컬 스토리지에 저장
    localStorage.setItem('workspaceBlocks', xmlText);
    console.log("Workspace saved.");
}


function loadWorkspace() {
    // 로컬 스토리지에서 저장된 XML 데이터를 가져옴
    const xmlText = localStorage.getItem('workspaceBlocks');

    if (xmlText) {
        try {
            // DOMParser를 사용하여 XML 문자열을 DOM 객체로 변환
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");

            // 파싱 에러 확인
            const parseError = xmlDoc.getElementsByTagName("parsererror");
            if (parseError.length > 0) {
                throw new Error('XML 파싱 오류: ' + parseError[0].textContent);
            }

            // 파싱된 XML에서 최상위 요소 확인
            const xmlElement = xmlDoc.documentElement;
            if (!xmlElement || xmlElement.nodeName !== 'xml') {
                throw new Error('올바르지 않은 XML 데이터입니다.');
            }

            // 워크스페이스 초기화
            window.workspace.clear();

            // XML 데이터를 워크스페이스에 로드
            Blockly.Xml.domToWorkspace(xmlElement, window.workspace);

            console.log("Workspace loaded.");
        } catch (e) {
            console.error("Error loading workspace: ", e);
        }
    } else {
        console.log("No workspace data found.");
    }
}





// function loadWorkspace() {
//     // 로컬 스토리지 또는 데이터베이스에서 저장된 XML 데이터를 가져옴
//     const xmlText = localStorage.getItem('workspaceBlocks');

//     if (xmlText) {
//         // XML 문자열을 DOM 객체로 변환
//         const xml = Blockly.utils.xml.textToDom(xmlText);
//         // 워크스페이스에 XML 데이터를 적용하여 블록 복원
//         Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, window.workspace);
//         console.log("Workspace loaded.");
//     } else {
//         console.log("No workspace data found.");
//     }
// }


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


// 워크스페이스 변경 리스너
function workspaceChangeListener(event) {
    console.log("Event Type: ", event.type);

    if (event.type === Blockly.Events.CLICK) {
        console.log("Block ID: ", event.blockId);
    }
}


// 리사이즈 이벤트 핸들러
const onBloclkyBoxResize = function (e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    console.log("onresize event");
    let element = window.blocklyArea;
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


initBlockly = () => {

    window.blocklyBox = document.getElementById('blocklyBox');
	if (!window.workspace) {
		console.log("Initializing workspace...");
		window.workspace = Blockly.inject(window.blocklyBox, {
			grid: {
				spacing: 25,
				length: 3,
				colour: '#ccc',
				snap: true
			},
			media: './media/',
			toolbox: xtoolbox,
            disableContextMenu: false,  // 컨텍스트 메뉴 활성화
            
            renderer: 'thrasos',  // thrasos 또는 'geras', 'zelos', 'minimalist' 중 하나
            //theme: Blockly.Themes.Classic,  // 또는 원하는 테마
            theme: Blockly.Themes.Classic,  // 또는 원하는 테마
            

			zoom: {
				controls: true,
				wheel: true
			}
		});
		// 워크스페이스가 성공적으로 초기화되었는지 확인
		if (window.workspace) {
			console.log("Workspace initialized:", window.workspace);
		}
		else {
			console.log("Workspace initialized: null", window.workspace);
		}
		
	}
	// 워크스페이스가 성공적으로 초기화되었는지 확인 후 리스너 등록
	if (window.workspace) {
		console.log('Workspace fully initialized');
		window.workspace.addChangeListener(workspaceChangeListener);
        // 변수를 생성하는 기본 Blockly 함수 호출
	} else {
		console.error("demoWorkspace is not initialized yet.");
	}
}


