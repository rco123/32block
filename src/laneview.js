const fs = require('fs');
const path = require('path');

exports.fxLaneView = () => {

    // 컨테이너의 ID 설정
    const containerId = "image-lane-view-container";

    // 이미 생성된 컨테이너가 있는지 확인
    const existingContainer = document.getElementById(containerId);
    if (existingContainer) {
        // 이미 존재하면 삭제하고 함수 종료
        existingContainer.remove();
        console.log("기존 컨테이너가 삭제되었습니다.");
        return;
    }

    // 컨테이너의 ID 설정
    const checkId = "image-mark-view-container";
    // 이미 생성된 컨테이너가 있는지 확인
    const checkContainer = document.getElementById(checkId);
    if (checkContainer) {
        // 이미 존재하면 삭제하고 함수 종료
        checkContainer.remove();
        console.log("기존 컨테이너가 삭제되었습니다.");
    }



    // 이미지와 캔버스를 담을 컨테이너 생성
    const imageLaneViewContainer = document.createElement('div');
    imageLaneViewContainer.id = containerId; // 고유 ID 설정
    imageLaneViewContainer.className = "image-Lane-View-Container"

    // 이미지와 캔버스를 담을 컨테이너 생성
    const buttonContainer = document.createElement('div');
    buttonContainer.className = "button-Container"

    const buttonLane0 = document.createElement('button');
    buttonLane0.className = "btn btn-success btn-sm lane-button"
    buttonLane0.innerText = "lane0"
    const buttonLane1 = document.createElement('button');
    buttonLane1.className = "btn btn-success btn-sm lane-button"
    buttonLane1.innerText = "lane1"
    const buttonLane2 = document.createElement('button');
    buttonLane2.className = "btn btn-success btn-sm lane-button"
    buttonLane2.innerText = "lane2"

    // 클릭 이벤트 핸들러 등록
    buttonLane0.addEventListener('click', () => {
        console.log("Lane0 버튼이 클릭되었습니다.");
        const localDir = 'C:\\Users\\sgkim\\Desktop\\aiimage\\lane\\lane0';
        const images = loadAllImages(localDir); // 이미지 목록 가져오기
        createCards(images); // 카드 생성
    });
    // 클릭 이벤트 핸들러 등록
    buttonLane1.addEventListener('click', () => {
        console.log("Lane0 버튼이 클릭되었습니다.");
        const localDir = 'C:\\Users\\sgkim\\Desktop\\aiimage\\lane\\lane1';
        const images = loadAllImages(localDir); // 이미지 목록 가져오기
        createCards(images); // 카드 생성
    });
    // 클릭 이벤트 핸들러 등록
    buttonLane2.addEventListener('click', () => {
        console.log("Lane0 버튼이 클릭되었습니다.");
        const localDir = 'C:\\Users\\sgkim\\Desktop\\aiimage\\lane\\lane2';
        const images = loadAllImages(localDir); // 이미지 목록 가져오기
        createCards(images); // 카드 생성
    });

    buttonContainer.appendChild(buttonLane0)
    buttonContainer.appendChild(buttonLane1)
    buttonContainer.appendChild(buttonLane2)

    const cardContainer = document.createElement('div')
    cardContainer.className = 'card-Container'

    imageLaneViewContainer.appendChild(buttonContainer)
    imageLaneViewContainer.appendChild(cardContainer)

    const blocklyArea = document.getElementById('blocklyArea');
    blocklyArea.appendChild(imageLaneViewContainer)


    // 모든 이미지 로드 함수
    function loadAllImages(localDir) {
        const files = fs.readdirSync(localDir)
            .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
            .map(file => path.join(localDir, file));
        return files;
    }

    // 카드 생성 함수
    function createCards(imagePaths) {
        cardContainer.innerHTML = ''; // 기존 카드 초기화

        imagePaths.forEach((filePath) => {

            const fileName = path.basename(filePath);
            const angle = parseInt(fileName.split('_')[1].split('.')[0], 10); // 파일명에서 각도 추출

            // 카드 요소 생성
            const card = document.createElement('div');
            card.className = 'card';

            // 이미지와 캔버스를 담을 컨테이너 생성
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            // 이미지 요소 생성 및 로드 이벤트 설정
            const img = document.createElement('img');
            img.src = `file://${filePath}`;
            img.alt = `${angle}° Image`;

            let canvas = null;

            img.onload = () => {
                const { width, height } = img.getBoundingClientRect(); // 이미지 크기 가져오기

                // Canvas 요소 생성 (이미지 위에 겹쳐 놓기)
                canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                canvas.file = filePath; // 파일 이름저장

                // 각도를 적용한 선 그리기
                drawLine(ctx, angle, height / 2);
                drawText(ctx, angle);

                // 캔버스를 이미지 컨테이너에 추가
                imageContainer.appendChild(canvas);

                // 캔버스에 클릭 이벤트 추가
                canvas.addEventListener('click', (e) => {
                    console.log("canvas click event")
                    // 클릭 위치 계산
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    // 캔버스 초기화
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // 동그라미 테두리만 그리기 (내부는 비어 있음)
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI); // 원형 그리기
                    ctx.strokeStyle = 'blue'; // 테두리 색상
                    ctx.lineWidth = 2; // 테두리 두께
                    ctx.stroke(); // 테두리만 그리기

                    // 중앙 좌표
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height;

                    // 중앙에서 클릭 위치로 선 그리기
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(x, y);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // 클릭 위치와 중앙 사이의 각도 계산
                    const angleInRadians = Math.atan2(centerY - y, x - centerX); // 라디안 단위로 각도 계산
                    let angleInDegrees = Math.round((angleInRadians * 180) / Math.PI); // 라디안을 도(degree)로 변환
                    angleInDegrees = angleInDegrees - 90
                    // 각도를 -45 ~ 45 범위로 제한
                    angleInDegrees = Math.max(-45, Math.min(45, angleInDegrees));

                    drawText(ctx, angleInDegrees)
                    console.log(`canvas.file= ${canvas.file}`)
                    reName(canvas, canvas.file, angleInDegrees)


                });


            };

            // 버튼1: 삭제 버튼
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-button';
            deleteBtn.addEventListener('click', () => {
                card.remove(); // 카드 삭제
                console.log(`file delete = ${canvas.file}`)
                deleteFile(canvas.file) //파일삭제

            });

            // 이미지 컨테이너와 버튼을 카드에 추가
            imageContainer.appendChild(img);
            card.appendChild(imageContainer);
            card.appendChild(deleteBtn);

            // 카드 컨테이너에 카드 추가
            cardContainer.appendChild(card);


        });

        
    }


    // 각도를 적용해 선을 그리는 함수
    function drawLine(ctx, angle, length) {
        const adjustedAngle = -angle; // 각도 방향 조정 (왼쪽이 +, 오른쪽이 -)
        const radian = (adjustedAngle * Math.PI) / 180; // 각도를 라디안으로 변환

        const x = ctx.canvas.width / 2; // 중앙 X 좌표
        const y = ctx.canvas.height; // 이미지 아래쪽 Y 좌표

        const endX = x + length * Math.sin(radian); // 끝점 X 좌표 (sin 사용)
        const endY = y - length * Math.cos(radian); // 끝점 Y 좌표 (cos 사용)

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'red'; // 선 색상
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // 각도 정보를 캔버스 우측 상단에 표시하는 함수
    function drawText(ctx, angle) {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.strokeText(`${angle}°`, ctx.canvas.width - 5, 5); // 검은색 테두리 텍스트
        ctx.fillText(`${angle}°`, ctx.canvas.width - 5, 5); // 노란색 텍스트
    }

    buttonLane0.click()

};


// filePath: 읽을 파일이 위치한 경로
// newAngle: 변경할 각도 (예: 45, -45, 90 등)
function reName(canvas, filePath, newAngle) {

    // 경로에서 파일명과 확장자 추출
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath); // 확장자 (예: .jpg, .png)

    // 기존 파일명에서 접두어와 각도 부분 분리 (예: '000_-45.jpg' -> '000', '-45')
    const baseName = path.basename(filePath, ext); // '000_-45'
    const [prefix, oldAngle] = baseName.split('_'); // '000', '-45'

    // 새로운 파일명 생성
    const newFileName = `${prefix}_${formatAngle(newAngle)}${ext}`; // 예: '000_-05.jpg'
    const newFilePath = path.join(dir, newFileName); // 새 경로

    console.log(`old name = ${filePath}, new name = ${newFilePath}`);

    canvas.file = newFilePath

    //파일 이름 변경
    fs.rename(filePath, newFilePath, (err) => {
        if (err) {
            console.error(`파일 이름 변경 중 오류 발생: ${err}`);
            return;
        }
        console.log(`파일 이름이 ${newFilePath}으로 변경되었습니다.`);


        canvas.file = newFilePath

    });


}

// 각도 값을 3자리 문자열로 포맷팅 (예: 45 -> 045, -5 -> -05)
function formatAngle(angle) {
    // 절대값을 사용해 2자리로 맞추고, 양수는 앞에 0을 채움
    const formattedAngle = Math.abs(angle).toString().padStart(2, '0');
    return angle < 0 ? `-${formattedAngle}` : `0${formattedAngle}`;
}


// 파일을 삭제하는 함수
function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`파일 삭제 중 오류 발생: ${err}`);
        } else {
            console.log(`파일 ${filePath}이(가) 성공적으로 삭제되었습니다.`);
        }
    });
}

