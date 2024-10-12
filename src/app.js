const Blockly = require('blockly');  // Blockly 전체 모듈 가져오기
require('blockly/blocks')
require('blockly/javascript');

/**
 * @license
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * An example implementation of how one might replace Blockly's browser
 * dialogs. This is just an example, and applications are not encouraged to use
 * it verbatim.
 *
 * @namespace
 */
CustomDialog = {};

/** Override Blockly.alert() with custom implementation. */
Blockly.alert = function(message, callback) {
  console.log('Alert: ' + message);
  CustomDialog.show('Alert', message, {
    onCancel: callback
  });
};

/** Override Blockly.confirm() with custom implementation. */
Blockly.confirm = function(message, callback) {
  console.log('Confirm: ' + message);
  CustomDialog.show('Confirm', message, {
    showOkay: true,
    onOkay: function() {
      callback(true);
    },
    showCancel: true,
    onCancel: function() {
      callback(false);
    }
  });
};

/** Override Blockly.prompt() with custom implementation. */
Blockly.prompt = function(message, defaultValue, callback) {
  console.log('Prompt: ' + message);
  CustomDialog.show('Prompt', message, {
    showInput: true,
    showOkay: true,
    onOkay: function() {
      callback(CustomDialog.inputField.value);
    },
    showCancel: true,
    onCancel: function() {
      callback(null);
    }
  });
  CustomDialog.inputField.value = defaultValue;
};

/** Hides any currently visible dialog. */
CustomDialog.hide = function() {
  if (CustomDialog.backdropDiv_) {
    CustomDialog.backdropDiv_.style.display = 'none';
    CustomDialog.dialogDiv_.style.display = 'none';
  }
};

/**
 * Shows the dialog.
 * Allowed options:
 *  - showOkay: Whether to show the OK button.
 *  - showCancel: Whether to show the Cancel button.
 *  - showInput: Whether to show the text input field.
 *  - onOkay: Callback to handle the okay button.
 *  - onCancel: Callback to handle the cancel button and backdrop clicks.
 */
CustomDialog.show = function(title, message, options) {
  var backdropDiv = CustomDialog.backdropDiv_;
  var dialogDiv = CustomDialog.dialogDiv_;
  if (!dialogDiv) {
    // Generate HTML
    backdropDiv = document.createElement('div');
    backdropDiv.id = 'customDialogBackdrop';
    backdropDiv.style.cssText =
        'position: absolute;' +
        'top: 0; left: 0; right: 0; bottom: 0;' +
        'background-color: rgba(0, 0, 0, .7);' +
        'z-index: 100;';
    document.body.appendChild(backdropDiv);

    dialogDiv = document.createElement('div');
    dialogDiv.id = 'customDialog';
    dialogDiv.style.cssText =
        'background-color: #fff;' +
        'width: 400px;' +
        'margin: 20px auto 0;' +
        'padding: 10px;';
    backdropDiv.appendChild(dialogDiv);

    dialogDiv.onclick = function(event) {
      event.stopPropagation();
    };

    CustomDialog.backdropDiv_ = backdropDiv;
    CustomDialog.dialogDiv_ = dialogDiv;
  }
  backdropDiv.style.display = 'block';
  dialogDiv.style.display = 'block';

  dialogDiv.innerHTML =
      '<header class="customDialogTitle"></header>' +
      '<p class="customDialogMessage"></p>' +
      (options.showInput ? '<div><input id="customDialogInput"></div>' : '') +
      '<div class="customDialogButtons">' +
      (options.showCancel ? '<button id="customDialogCancel">Cancel</button>': '') +
      (options.showOkay ? '<button id="customDialogOkay">OK</button>': '') +
      '</div>';
  dialogDiv.getElementsByClassName('customDialogTitle')[0]
      .appendChild(document.createTextNode(title));
  dialogDiv.getElementsByClassName('customDialogMessage')[0]
      .appendChild(document.createTextNode(message));

  var onOkay = function(event) {
    CustomDialog.hide();
    options.onOkay && options.onOkay();
    event && event.stopPropagation();
  };
  var onCancel = function(event) {
    CustomDialog.hide();
    options.onCancel && options.onCancel();
    event && event.stopPropagation();
  };

  var dialogInput = document.getElementById('customDialogInput');
  CustomDialog.inputField = dialogInput;
  if (dialogInput) {
    dialogInput.focus();

    dialogInput.onkeyup = function(event) {
      if (event.keyCode == 13) {
        // Process as OK when user hits enter.
        onOkay();
        return false;
      } else if (event.keyCode == 27)  {
        // Process as cancel when user hits esc.
        onCancel();
        return false;
      }
    };
  } else {
    var okay = document.getElementById('customDialogOkay');
    okay && okay.focus();
  }

  if (options.showOkay) {
    document.getElementById('customDialogOkay')
        .addEventListener('click', onOkay);
  }
  if (options.showCancel) {
    document.getElementById('customDialogCancel')
        .addEventListener('click', onCancel);
  }

  backdropDiv.onclick = onCancel;
};

// Blockly.dialog.setPrompt를 사용하여 사용자 정의 프롬프트 함수 설정
Blockly.dialog.setPrompt(function(message, defaultValue, callback) {
    console.log('Custom setPrompt called with message:', message);
    // 사용자 정의 프롬프트 구현
    CustomDialog.show('Prompt', message, {
      showInput: true,
      showOkay: true,
      onOkay: function() {
        callback(CustomDialog.inputField.value);
      },
      showCancel: true,
      onCancel: function() {
        callback(null);
      }
    });
    CustomDialog.inputField.value = defaultValue || '';
  });


require('./ublock/robo.js')


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
const { delay, turnLedOn, turnLedOff } = require("./ublock/blkCode.js")
const {generateJavaCode} = require("./runCode")



// // 메시지 파일을 Blockly에 적용
// Blockly.setLocale = function (locale) {
//     Object.assign(Blockly.Msg, locale);
// };

// 메시지 파일을 직접 적용
// Object.assign(Blockly.Msg, BlocklyMsg);


window.workspace;
window.blocklyBox;
window.blocklyArea

let toolbox; // toolbox 변수를 추가
let camViewButton;
let genCode;
let runStop = true

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

    this.window.addEventListener('resize', onBloclkyBoxResize, true);

    camViewButton = document.getElementById('camViewButton');
    console.log("camViewButton    ", camViewButton);
    camViewButton.addEventListener('click', disCamViewWindow, false);


    // document.getElementById('generateCodeButton').addEventListener('click', generateJavaCode);
    // document.getElementById('runCodeButton').addEventListener('click', runJavaCode);
    // document.getElementById('extCodeButton').addEventListener('click', extJavaCode);
    // document.getElementById('codeOut').addEventListener('click', fxCodeOut);

    // document.getElementById('createFileButton').addEventListener('click', fxCreateFile);

    document.getElementById('gencode').addEventListener('click',generateJavaCode);


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





// 워크스페이스 변경 리스너
function workspaceChangeListener(event) {
    console.log("Event Type: ", event.type);

    if (event.type === Blockly.Events.CLICK) {
        console.log("Block ID: ", event.blockId);
    }
}

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
			toolbox: mtoolbox,
            disableContextMenu: false,  // 컨텍스트 메뉴 활성화
            
            renderer: 'thrasos',  // 또는 'geras', 'zelos', 'minimalist' 중 하나
            theme: Blockly.Themes.Classic,  // 또는 원하는 테마

			zoom: {
				controls: true,
				wheel: true
			}
		});

        //Blockly.Variables.createVariableButtonHandler(window.workspace);

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

        //Blockly.Variables.createVariableButtonHandler(window.workspace);


        // 변수를 생성하는 기본 Blockly 함수 호출
	} else {
		console.error("demoWorkspace is not initialized yet.");
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


