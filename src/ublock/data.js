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
exports.robo_set_speed = (speed) => {

    if (speed < 0) speed = 0;
    if (speed > 255) speed = 255;
    const jsoncmd = { "cmd": "set_speed", "speed": speed }
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


class ReceiveInfo {
    constructor() {
        this.socket = null;
        this.angle = 0;
        this.speed = 0;
        this.isConnected = false;
        this.connectTimeout = 500;  // 연결 시도 시간 제한 (500ms)
        this.messageTimeout = 500;  // 메시지 수신 대기 시간 제한 (500ms)
    }

    // async로 비동기 함수 설정
    async connect() {
        const ipAddress = document.getElementById('ip_add_str').textContent;
        console.log("IP Address: ", ipAddress);

        if (this.socket && this.isConnected) {
            console.log("Already connected to WebSocket.");
            return "Already connected";
        }

        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(`ws://${ipAddress}:83/ws3`);

            const timeout = setTimeout(() => {
                if (!this.isConnected) {
                    console.error('WebSocket connection timed out');
                    this.socket.close();  // 연결 시도 중단
                    this.socket = null;
                    reject(new Error('WebSocket connection timed out'));
                }
            }, this.connectTimeout);

            this.socket.addEventListener('open', () => {
                clearTimeout(timeout);
                console.log('Connected to WebSocket server');
                this.isConnected = true;
                resolve("Connected successfully");
            });

            this.socket.addEventListener('message', (event) => {
                console.log('Message from server:', event.data);
                try {
                    const jsonData = JSON.parse(event.data);
                    if (jsonData && typeof jsonData === 'object') {
                        this.speed = jsonData.speed;
                        this.angle = jsonData.angle;
                    }
                } catch (error) {
                    console.error('Error parsing JSON data:', error);
                }
            });

            this.socket.addEventListener('close', () => {
                clearTimeout(timeout);
                console.log('WebSocket connection closed');
                this.isConnected = false;
                this.socket = null;
            });

            this.socket.addEventListener('error', (error) => {
                clearTimeout(timeout);
                console.error('WebSocket error:', error);
                reject(new Error('WebSocket connection error'));
            });
        });
    }

    // async로 비동기 함수 설정
    async req() {
        if (!this.isConnected) {
            //throw new Error("WebSocket is not connected.");
            console.log(`this.isConnected = ${this.isConnected}`)
            return;
        }

        let jsoncmd = { "cmd": "getinfo" };
        this.socket.send(JSON.stringify(jsoncmd));
        console.log('JSON command sent:', jsoncmd);

        return new Promise((resolve, reject) => {
            const messageHandler = (event) => {
                try {
                    const jsonData = JSON.parse(event.data);
                    if (jsonData && typeof jsonData === 'object') {
                        this.speed = jsonData.speed;
                        this.angle = jsonData.angle;
                        this.socket.removeEventListener('message', messageHandler); // 메시지를 수신했으므로 이벤트 리스너 제거
                        resolve(jsonData);  // 응답 데이터를 반환
                    }
                } catch (error) {
                    console.error('Error parsing JSON data:', error);
                    reject(error);
                }
            };

            // 메시지를 수신할 때까지 대기
            this.socket.addEventListener('message', messageHandler);

            // 타임아웃 설정 (메시지 대기 시간 초과 시 실패 처리)
            setTimeout(() => {
                this.socket.removeEventListener('message', messageHandler);  // 타임아웃 시 메시지 리스너 제거
                reject(new Error('WebSocket message timed out'));
            }, this.messageTimeout);
        });
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
            console.log("WebSocket connection closed manually.");
        }
    }

    get_speed() {
        return this.speed;
    }

    get_angle() {
        return this.angle;
    }
}

exports.robo_hp_con = async (dir_name, idiv) => {

    // 사용자 홈 디렉토리 가져오기
    const homeDirectory = os.homedir();
    const lane_list = ["lane0", "lane1", "lane2"];
    const mark_list = ["mark0", "mark1", "mark2"];

    print(`start robo_hp_con program`);
    console.log(`robo_hp_con ${dir_name}, ${idiv}`);

    let imgDir;
    if (mark_list.includes(dir_name)) {
        // 바탕화면 경로 구성
        imgDir = path.join(homeDirectory, 'Desktop', 'aiimage', "mark", dir_name);
    }
    if (lane_list.includes(dir_name)) {
        // 바탕화면 경로 구성
        imgDir = path.join(homeDirectory, 'Desktop', 'aiimage', "lane", dir_name);
    }
    const dirPath = path.resolve(imgDir);
    console.log(`Directory contents cleared: ${dirPath}`);

    let rcvInfo = new ReceiveInfo();

    // 소켓을 한 번만 열어두고 재사용하기 위해 소켓을 생성합니다.
    try{
        await rcvInfo.connect();
        console.log("end connect");
    }
    catch{
        window.runStop = false;
        console.log("get the cathc")
        return
    }

    await robo_delay(100);

    disCamViewWindow(dirPath, idiv);
    let cnt = 0;
    let cnta = 0;

    window.runStop = true;
    while (true && window.runStop) {
        console.log("start loop");
        // 소켓이 연결되었는지 확인하고, 연결을 유지한 상태로 데이터 수신
        if (rcvInfo.isConnected) {

            await rcvInfo.req();
            await robo_delay(200);

            let speed = rcvInfo.get_speed();
            let angle = rcvInfo.get_angle();
            window.angle = angle;

            console.log(`get angle:${angle}, speed:${speed}`);
            print(`get angle:${angle}, speed:${speed}`)

            // 속도에 따른 캡처 상태 결정
            if(speed > 0) window.isCapturing= true;
            else window.isCapturing = false;
            
        } 
        
        await robo_delay(1)
    }

    // 루프 종료 후 카메라 뷰어와 캡처 중단
    console.log("end hp con end")
    window.isCapturing = false;
    disCamViewWindow();
    rcvInfo.close()

};





