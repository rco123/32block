const fs = require('fs');
const path = require('path');

const { print } = require("./ublock/print");

let imageCounter = 0; // 순차적인 파일 이름을 위한 카운터
let isCapturing = false; // 캡처 중복 방지를 위한 플래그
let img;

// <div id="cam_view_box" style="width: 300px; height: 200px; border: 1px solid #ccc;"></div>
// <button onclick="addImage()">Add Image</button>
// <button onclick="removeImage()">Remove Image</button>

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
        canvas.id = "aicarpng";

        // Electron 환경에서는 __dirname을 사용하여 이미지 경로 설정
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
        console.log("Removing existing camera stream canvas");

        if (img && img.src) {
            img.src = '';
            img.onload = null;
            console.log("Image source cleared and onload event removed.");
        }
        existingCanvas.remove();
        isCapturing = false; // 캡처 중단
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

    const ipAddress = document.getElementById('ip_add_str').textContent;
    console.log("IP Address: ", ipAddress);

    // MJPEG 스트림을 받아올 <img> 태그 생성
    img = document.createElement('img');
    img.src = `http://${ipAddress}:82/alt_stream`; // ESP32-CAM의 MJPEG 스트림 URL
    img.style.display = 'none'; // <img> 요소를 화면에 표시하지 않음
    document.body.appendChild(img);

    const context = canvas.getContext('2d');
    window.isCapturing = false;
    imageCounter = 0;
    let runCount = 0;

    // canvas.toBlob을 Promise로 래핑하는 함수
    const canvasToBlob = (canvas, type = 'image/jpeg', quality = 0.92) => {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to convert canvas to blob'));
                }
            }, type, quality);
        });
    };

    // 이미지가 로드될 때마다 캔버스에 그리기
    img.onload = async () => {

        context.clearRect(0, 0, canvas.width, canvas.height);  // 기존 캔버스를 지우고 새로 그리기
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (window.isCapturing) {
            console.log(`runCount = ${runCount}`);
            if ( runCount++ % idiv === 0) {

                try {
                    const blob = await canvasToBlob(canvas, 'image/jpeg');
                    if (blob) {
                        await saveImage(blob, save_dir_name);
                    }
                } catch (error) {
                    console.error('Error capturing canvas image:', error);
                }

            }
        }
        // 새로운 이미지를 가져오기 위해 src를 재설정
        img.src = `http://${ipAddress}:82/alt_stream`;
    };

    img.onerror = (error) => {
        console.error('Error loading MJPEG stream:', error);
    };
    console.log("Camera stream started and canvas set.");

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

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
    }
    const filePath = path.join(saveDir, fileName);

    // 파일 저장을 프로미스로 래핑하여 동기화
    await new Promise((resolve, reject) => {
        fs.writeFile(filePath, buffer, (err) => {
            console.log(`save: ${fileName}`);

            if (err) {
                console.error('Error saving file:', err);
                reject(err);
            } else {
                console.log('Image saved successfully:', filePath);
                imageCounter++; // 다음 이미지를 위해 카운터 증가
                resolve();
            }
        });
    });
};
