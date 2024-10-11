
let imageCounter = 0; // 순차적인 파일 이름을 위한 카운터
let isCapturing = false; // 캡처 중복 방지를 위한 플래그
let img;

exports.disCamViewWindow = ()=> {
    console.log("start show cam window display");

    var blocklyBox = document.getElementById('blocklyBox');

    // 기존에 생성된 영상 창이 있으면 제거 (자원 청소)
    var existingCamDiv = document.getElementById('camWindowDiv');
    if (existingCamDiv) {
        console.log("Removing existing camera stream window");

        if(img && img.src)
        {
            img.src ='';
            img.onload = null;
            console.log("Image source cleared and onload event removed.");
        }
        
        existingCamDiv.remove();
        isCapturing = false; // 캡처 중단
        
        console.log("Camera stream stopped and resources cleaned up.");
        return;  // 기존 영상 창을 삭제한 후 함수 종료
    }

    // 새로운 div 요소 생성
    var newDiv = document.createElement('div');
    newDiv.id = 'camWindowDiv';
    newDiv.style.position = 'absolute';
    newDiv.style.top = '50px';
    newDiv.style.left = '50px';
    newDiv.style.width = '320px';
    newDiv.style.height = '240px';
    newDiv.style.border = '2px solid black';
    newDiv.style.zIndex = '100';

    // blocklyBox에 추가 (Blockly 상단에 배치)
    blocklyBox.appendChild(newDiv);

    // Canvas 요소 생성
    var canvas = document.createElement('canvas');
    canvas.id = 'camCanvas';
    canvas.width = 320;  // 캔버스의 너비 설정
    canvas.height = 240;  // 캔버스의 높이 설정
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    // 생성한 canvas 태그를 newDiv에 추가
    newDiv.appendChild(canvas);

    // MJPEG 스트림을 받아올 <img> 태그 생성
    img = document.createElement('img');
    img.src = 'http://192.168.0.25:82/alt_stream'; // ESP32-CAM의 MJPEG 스트림 URL
    img.style.display = 'none'; // <img> 요소를 화면에 표시하지 않음
    document.body.appendChild(img);

    const context = canvas.getContext('2d');
    isCapturing = true;


    // 이미지가 로드될 때마다 캔버스에 그리기
    img.onload = () => {
        if (isCapturing) {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            captureAndSaveImage(canvas); // 이미지 캡처 및 저장

            // 새로운 이미지를 가져오기 위해 src를 재설정
            //img.src = 'http://192.168.0.25:82/alt_stream' + '?t=' + new Date().getTime();
            img.src = 'http://192.168.0.25:82/alt_stream';
        }
    };

    img.onerror = (error) => {
        console.error('Error loading MJPEG stream:', error);
    };

    console.log("Camera stream started and canvas set.");
}

const captureAndSaveImage = (canvas)=> {
    // Canvas의 데이터를 Blob 형태로 변환 (JPG 형식)
    canvas.toBlob((blob) => {
        if (blob) {
            saveImage(blob);
        }
    }, 'image/jpeg');
}

const saveImage =  async (blob)=> {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 이미지 파일 이름 설정 (000.jpg, 001.jpg, ...)
    const fileName = `${String(imageCounter).padStart(3, '0')}.jpg`;
    const os = require('os')
    const fs = require('fs');
    const path = require('path');

    // 사용자 홈 디렉토리 가져오기
    const homeDirectory = os.homedir();
    // 바탕화면 경로 구성
    const saveDir = path.join(homeDirectory, 'Desktop', 'aiimages');

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
    }

    const filePath = path.join(saveDir, fileName);

    // 파일 저장
    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.error('Error saving file:', err);
        } else {
            console.log('Image saved successfully:', filePath);
            imageCounter++; // 다음 이미지를 위해 카운터 증가
        }
    });
}
