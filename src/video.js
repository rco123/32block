
let imageCounter = 0; // 순차적인 파일 이름을 위한 카운터
let isCapturing = false; // 캡처 중복 방지를 위한 플래그
let img;


// <div id="cam_view_box" style="width: 300px; height: 200px; border: 1px solid #ccc;"></div>
// <button onclick="addImage()">Add Image</button>
// <button onclick="removeImage()">Remove Image</button>


exports.AddAiCarImage = () => {
    const camViewBox = document.getElementById('cam_view_box');

    // 이미 canvas 태그가 존재하는지 확인
    if (!camViewBox.querySelector('canvas')) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // 캔버스의 너비와 높이를 설정
        canvas.width = camViewBox.clientWidth;
        canvas.height = camViewBox.clientHeight;

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



exports.removeAiCarImage = () => {
    const camViewBox = document.getElementById('cam_view_box');
    
    // cam_view_box 안에 있는 canvas 태그를 찾아 제거
    const canvas = camViewBox.querySelector('canvas');
    if (canvas) {
        camViewBox.removeChild(canvas);
    }
};


// exports.AddAiCarImage= ()=> {
//     const camViewBox = document.getElementById('cam_view_box');

//     // 이미 img 태그가 존재하는지 확인
//     if (!camViewBox.querySelector('img')) {
//         const img = document.createElement('img');

//         // Electron 환경에서는 __dirname을 사용하여 경로 설정
//         const path = require('path');
//         img.src = path.join(__dirname, './images/aicar.png'); // 절대 경로 사용

//         img.alt = 'Camera View';
//         img.style.width = '90%';
//         img.style.height = '90%';
//         img.style.objectFit = 'cover';

//         camViewBox.appendChild(img);
//     }
// }

// function removeAiCarImage() {
//     const camViewBox = document.getElementById('cam_view_box');
    
//     // cam_view_box 안에 있는 img 태그를 찾아 제거
//     const img = camViewBox.querySelector('img');
//     if (img) {
//         camViewBox.removeChild(img);
//     }
// }




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
