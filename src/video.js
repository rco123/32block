//const fs = require('fs').promises; // fs.promises를 사용하여 async/await로 동기화
const path = require('path');
const fs = require('fs'); // fs.promises를 사용하여 async/await로 동기화


const { print } = require("./ublock/print");

let imageCounter = 0; // 순차적인 파일 이름을 위한 카운터
let isRunning = false;
let lastFrameTime = 0; // 마지막 프레임의 타임스탬프를 저장

let ws = null;

exports.AddAiCarImage = () => {
    AddAiCarImage();
};

AddAiCarImage = () => {

    const camViewBox = document.getElementById('cam_view_box');

    // 이미 canvas 태그가 존재하는지 확인
    if (!camViewBox.querySelector('canvas')) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // 캔버스의 너비와 높이를 설정
        canvas.width = camViewBox.clientWidth;
        canvas.height = camViewBox.clientHeight;
        canvas.id = "aicarpng"

        // Electron 환경에서는 __dirname을 사용하여 이미지 경로 설정
        const path = require('path');
        const imgPath = path.join(__dirname, './images/aicar.png');
        const img = new Image();
        img.src = `file://${imgPath}`;  // 절대 경로 사용

        img.onload = () => {
            // 이미지가 로드되면, 5px 여백을 적용하여 그리기
            const offset = 5; // 5px의 여백
            context.drawImage(
                img,
                offset,        // x 좌표: 왼쪽에서 5px
                offset,        // y 좌표: 위쪽에서 5px
                canvas.width - 2 * offset, // 너비: 캔버스 너비에서 양쪽 여백 5px씩 제외
                canvas.height - 2 * offset // 높이: 캔버스 높이에서 위아래 여백 5px씩 제외
            );
        };

        canvas.alt = 'Camera View';
        camViewBox.appendChild(canvas);
    }
};

removeAiCarImage = () => {
    const camViewBox = document.getElementById('cam_view_box');

    // 특정 id를 가진 canvas 태그를 찾아 제거
    const canvas = document.getElementById('aicarpng');
    if (canvas && camViewBox.contains(canvas)) {
        camViewBox.removeChild(canvas);
        console.log('Canvas with id "aicarpng" has been removed.');
    } else {
        console.log('No canvas with id "aicarpng" found.');
    }
};


exports.disCamViewWindow = (save_dir_name, idiv) => {

    console.log("start show cam window display");
    let camViewBox = document.getElementById('cam_view_box');

    removeAiCarImage();

    // 기존에 생성된 영상 창이 있으면 제거 (자원 청소)
    var existingCanvas = document.getElementById('camCanvas');
    if (existingCanvas) {
        isRunning = false;
        console.log("Removing existing camera stream canvas");
        existingCanvas.remove();

        // WebSocket 정리
        if(ws){
            ws.onmessage = null;  // 이벤트 리스너 제거
            ws.onopen = null;
            ws.onerror = null;
            ws.onclose = null;
            ws.close();  // WebSocket 연결 닫기
            ws = null;  // WebSocket 객체를 null로 설정하여 재사용 방지
            console.log("WebSocket connection closed.");
        }
        
        window.isCapturing = false; // 캡처 중단
        console.log("Camera stream stopped and resources cleaned up.");
        AddAiCarImage();
        return;  // 기존 캔버스를 삭제한 후 함수 종료
    }

    // camViewBox 크기를 기준으로 canvas 크기를 동적으로 설정
    const boxWidth = camViewBox.clientWidth;
    const boxHeight = camViewBox.clientHeight;
    console.log("camviewBox ", boxWidth, boxHeight);

    // Canvas 요소 생성
    var canvas = document.createElement('canvas');
    canvas.id = 'camCanvas';
    canvas.width = boxWidth - 10;  // 캔버스의 너비를 camViewBox에 맞추기
    canvas.height = boxHeight - 10;  // 캔버스의 높이를 camViewBox에 맞추기
    canvas.style.width = 'calc(100% - 10px)';
    canvas.style.height = 'calc(100% - 10px)';
    canvas.style.position = 'relative';
    canvas.style.top = '5px';
    canvas.style.left = '5px';

    // 생성한 canvas 태그를 camViewBox에 직접 추가
    camViewBox.appendChild(canvas);

    const context = canvas.getContext('2d');
    window.isCapturing = false;
    imageCounter = 0;
    let runCount = 0;

    const ipAddress = document.getElementById('ip_add_str').textContent;
    console.log("IP Address: ", ipAddress);

    // WebSocket 연결 설정
    ws = new WebSocket(`ws://${ipAddress}:81/ws1`); // WebSocket으로 ESP32에 연결
    ws.binaryType = 'blob';  // WebSocket 바이너리 타입을 Blob으로 설정

    ws.onopen = function() {
        console.log('WebSocket connection opened');
        isRunning = true;
    };

    ws.onmessage = function(event) {
        const blob = event.data;

        // Blob 데이터를 사용하여 이미지를 즉시 처리
        createImageBitmap(blob).then(function(imgBitmap) {
            context.clearRect(0, 0, canvas.width, canvas.height);  // 기존 캔버스 내용 삭제
            context.drawImage(imgBitmap, 0, 0, canvas.width, canvas.height);  // 비트맵 이미지를 캔버스에 그리기

            console.log(`xrcount = ${runCount}`);
            
            // 일정 간격으로 이미지를 저장
            if (window.isCapturing && runCount++ % idiv === 0) {
                canvas.toBlob(function(blob) {
                    if (blob) {
                        saveImage(blob, save_dir_name);
                    }
                }, 'image/jpeg');
            }
        }).catch(function(error) {
            console.error('Error processing WebSocket image:', error);
        });
    };

    ws.onclose = function() {
        console.log('WebSocket connection closed');
        isRunning = false;
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
};

const saveImage = async (blob, saveDir) => {

    if (imageCounter > 999) {
        console.log("over image");
        return;
    }

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // window.angle이 양수인 경우와 음수인 경우 처리
    const angleValue = window.angle >= 0
        ? String(window.angle).padStart(3, '0')  // 양수일 경우 3자리로 맞춤
        : '-' + String(Math.abs(window.angle)).padStart(2, '0');  // 음수일 경우 부호 포함 3자리로 맞춤
    const fileName = `${String(imageCounter).padStart(3, '0')}_${angleValue}.jpg`;
    console.log(`==>fileName:${fileName}`);
    print(`==>fileName:${fileName}`);

    // 디렉토리가 없으면 생성
    try {
        await fs.mkdir(saveDir, { recursive: true });
    } catch (err) {
        console.error('Error creating directory:', err);
        return;
    }
    const filePath = path.join(saveDir, fileName);
    // 파일 저장
    try {
        await fs.writeFile(filePath, buffer);
        console.log(`save: ${fileName}`);
        console.log('Image saved successfully:', filePath);
        imageCounter++; // 다음 이미지를 위해 카운터 증가
    } catch (err) {
        console.error('Error saving file:', err);
    }
};
