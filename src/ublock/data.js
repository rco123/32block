const fs = require('fs-extra');
const path = require('path');
const os = require('os')

const Blockly = require('blockly');
const { javascriptGenerator } = require('blockly/javascript');

const { sendJsonCommand, robo_delay } = require("./robo")
const { print } = require("./print")

const { disCamViewWindow } = require("../video.js")

const colorVal = 200;


// <category name="DATA_BLK" colour="%{BKY_VARIABLES_HUE}">
// <block type="fun_robo_dir_clean"></block>
// <block type="fun_robo_hp_con"></block>
// </category>


//<<
Blockly.Blocks['robo_set_speed'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("robo_set_speed(speed: 0 ~ 255 ");
        this.appendValueInput("NAME")
            .setCheck("Number")
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(colorVal);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['robo_set_speed'] = function (block) {
    let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
    let code = `robo_set_speed(${value_name})`
    return code + '\n';
};

//>>
exports.robo_set_speed = (ms) => {

    if (ms < 0) ms = 0;
    if (ms > 255) ms = 255;
    const jsoncmd = { "cmd": "set_speed", "speed": ms }
    sendJsonCommand(jsoncmd);
}


Blockly.Blocks['robo_dir_clean'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("robo_dir_clean(")
            .appendField(new Blockly.FieldDropdown([
                ["lane0", "lane0"],  // 실제 값도 소문자로 설정
                ["lane1", "lane1"],
                ["lane2", "lane2"],
                ["mark0", "mark0"],
                ["mark1", "mark1"],
                ["mark2", "mark2"]
            ]), "NAME")  // 드롭다운으로 선택
            .appendField(")");

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(colorVal);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['robo_dir_clean'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');  // 드롭다운에서 선택된 값을 가져옴
    var code = 'robo_dir_clean("' + dropdown_name + '")\n';
    return code;
};

exports.robo_dir_clean = async (dir_name) => {

    // 사용자 홈 디렉토리 가져오기
    const homeDirectory = os.homedir();
    const lane_list = ["lane0", "lane1", "lane2"]
    const mark_list = ["mark0", "mark1", "mark2"]

    console.log(`robo_dir_clean ${dir_name}`)

    let imgDir
    if (mark_list.includes(dir_name)) {
        // 바탕화면 경로 구성
        imgDir = path.join(homeDirectory, 'Desktop', 'aiimage', "mark", dir_name)
    }
    if (lane_list.includes(dir_name)) {
        // 바탕화면 경로 구성
        imgDir = path.join(homeDirectory, 'Desktop', 'aiimage', "lane", dir_name)
    }

    const dirPath = path.resolve(imgDir);
    try {
        // 디렉토리 내의 모든 파일 및 하위 디렉토리 삭제
        await fs.emptyDir(dirPath);
        console.log(`Directory contents cleared: ${dirPath}`);
    } catch (err) {
        console.error(`Error clearing directory contents: ${dirPath}`, err);
    }
}


//<<
// 블록 정의
Blockly.Blocks['robo_hp_con'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("robo.hp_con(");

        // sdir 드롭다운 입력 (lane0, lane1, lane2, mark0, mark1, mark2)
        this.appendDummyInput()
            .appendField('sdir =')
            .appendField(new Blockly.FieldDropdown([
                ["lane0", "lane0"],
                ["lane1", "lane1"],
                ["lane2", "lane2"],
                ["mark0", "mark0"],
                ["mark1", "mark1"],
                ["mark2", "mark2"]
            ]), "SDIR");

        // idiv 숫자 입력
        this.appendValueInput("IDIV")
            .setCheck("Number")
            .appendField(", idiv =");

        this.appendDummyInput()
            .appendField(")");

        this.setInputsInline(true);  // 모든 입력을 한 줄로 표시
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(colorVal);  // 블록 색상 설정
        this.setTooltip("Calls robo.hp_con with the specified parameters.");
        this.setHelpUrl("");
    }
};

// javascriptGenerator 코드 생성기
javascriptGenerator.forBlock['robo_hp_con'] = function (block) {
    var dropdown_sdir = block.getFieldValue('SDIR');  // sdir 드롭다운 값
    var value_idiv = javascriptGenerator.valueToCode(block, 'IDIV', javascriptGenerator.ORDER_ATOMIC);  // idiv 값

    var code = `robo_hp_con(sdir="${dropdown_sdir}", idiv=${value_idiv})\n`;
    return code;
};

class ReceiveAngle {
    constructor() {
        this.socket = null;
        this.speed = 0;
    }

    req() {

        const ipAddress = document.getElementById('ip_add_str').textContent;
        // IP 주소가 올바르게 입력되었는지 확인
        console.log("IP Address: ", ipAddress);

        // WebSocket 연결 설정 (예시)
        this.socket = new WebSocket(`ws://${ipAddress}:92/alt_ws`);

        // 2. WebSocket 연결이 성공했을 때 실행될 코드
        this.socket.addEventListener('open', function () {
            console.log('Connected to WebSocket server');

            let jsoncmd = { "cmd": "get_speed" }
            // 3. JSON 명령어 전송
            this.socket.send(JSON.stringify(jsoncmd));
            console.log('JSON command sent:', jsoncmd);
        });

        // 5. 서버로부터 메시지를 받았을 때
        this.socket.addEventListener('message', function (event) {
            console.log('Message from server:', event.data);
            try {
                // JSON 형식으로 메시지 파싱
                const jsonData = JSON.parse(event.data);
                // 파싱된 JSON 데이터에서 필요한 값을 가져오기
                if (jsonData && typeof jsonData === 'object') {
                    // 예시: "speed"와 "status" 필드 값 가져오기
                    this.speed = jsonData.speed;
                    //console.log('Speed:', speed);
                    // 다른 필요한 데이터를 가져오고 처리할 수 있음
                } else {
                    console.error('Received data is not a valid JSON object:', event.data);
                }
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
            this.socket.close()
        });

        // 6. WebSocket 연결이 닫혔을 때
        this.socket.addEventListener('close', function () {
            console.log('WebSocket connection closed');
        });

    }

    get_speed(){
        return this.speed;
    }

}


exports.robo_hp_con = async (dir_name, idiv) => {

    // 사용자 홈 디렉토리 가져오기
    const homeDirectory = os.homedir();
    const lane_list = ["lane0", "lane1", "lane2"]
    const mark_list = ["mark0", "mark1", "mark2"]

    console.log(`robo_hp_con ${dir_name}, ${idiv}`)

    let imgDir
    if (mark_list.includes(dir_name)) {
        // 바탕화면 경로 구성
        imgDir = path.join(homeDirectory, 'Desktop', 'aiimage', "mark", dir_name)
    }
    if (lane_list.includes(dir_name)) {
        // 바탕화면 경로 구성
        imgDir = path.join(homeDirectory, 'Desktop', 'aiimage', "lane", dir_name)
    }
    const dirPath = path.resolve(imgDir);
    console.log(`Directory contents cleared: ${dirPath}`);

    receiveAngle = new ReceiveAngle()
    
    disCamViewWindow(dirPath)
    while (true && window.runStop) {
        receiveAngle.req()
        let speed = receiveAngle.get_speed()
        //print(`save image ${dirPath}`)
        //연결을 하여 속도를 연속적으로 받는다.
        window.isCapturing = (speed !== 0);
        await robo_delay(50)
    }
    disCamViewWindow()
    window.isCapturing = false


}
