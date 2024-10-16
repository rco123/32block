
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const { Chart } = require('chart.js/auto')
const { print } = require("./ublock/print")


// 학습 중단을 위한 컨트롤러 생성
function createStopControl() {
    let shouldStop = false;
    return {
        getShouldStop: () => shouldStop,
        setShouldStop: (value) => { shouldStop = value; }
    };
}
const stopControl = createStopControl();

// 디렉토리에서 이미지 경로와 라벨 수집
function getImagePathsAndLabels(dir) {
    const classes = fs.readdirSync(dir).filter(file =>
        fs.statSync(path.join(dir, file)).isDirectory()
    );

    const imageData = [];
    const labelMap = {};

    classes.forEach((className, index) => {
        labelMap[index] = className; // 정수 라벨과 문자열 매핑
        const classDir = path.join(dir, className);
        const files = fs.readdirSync(classDir).filter(file =>
            ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
        );

        files.forEach(file => {
            const filePath = path.join(classDir, file);
            imageData.push({ path: filePath, label: index }); // 정수형 라벨 사용
        });
    });

    return { imageData, labelMap };
}

// 이미지 로드 및 전처리
function loadImage(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        let decodedImage = tf.node.decodeImage(imageBuffer, 3)
            .resizeBilinear([60, 80])
            .toFloat()
            .div(tf.scalar(255.0)); // 0-1 사이 값으로 정규화

        decodedImage = tf.tidy(() => {
            const [height, width, channels] = decodedImage.shape;
            const halfHeight = Math.floor(height / 2);
            const upperHalf = tf.zeros([halfHeight, width, channels]);
            const lowerHalf = decodedImage.slice([halfHeight, 0, 0], [height - halfHeight, width, channels]);
            return tf.concat([upperHalf, lowerHalf], 0);
        });

        return decodedImage;
    } catch (error) {
        console.error(`이미지 로딩 오류: ${imagePath}`, error);
        return null;
    }
}

// 데이터셋 생성
function createDataset(data, numClasses) {
    const images = [];
    const labels = [];

    data.forEach(item => {
        const image = loadImage(item.path);
        if (image) {
            images.push(image);
            labels.push(item.label);
        }
    });

    const xs = tf.stack(images).toFloat(); // 입력 데이터는 float32로 변환
    const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), numClasses); // 원-핫 인코딩된 라벨 생성

    return { xs, ys };
}

// CNN 모델 빌드
function buildCNNModel(inputShape, numClasses) {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({ inputShape, filters: 16, kernelSize: 3, activation: 'relu', padding: 'same' }));
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
    model.add(tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: 'relu', padding: 'same' }));
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));
    return model;
}

// 모델 평가 및 예측
async function evaluateModel(model, xs, ys, labelMap) {
    const preds = model.predict(xs).argMax(-1).dataSync();
    const labels = ys.argMax(-1).dataSync();
    const sampleIndices = Array.from({ length: preds.length }, (_, i) => i);
    tf.util.shuffle(sampleIndices);
    const selectedIndices = sampleIndices.slice(0, 10);

    console.log("\n랜덤으로 선택된 10개 샘플의 모델 예측 결과:");
    print("랜덤으로 선택된 10개 샘플의 모델 예측 결과:");
    selectedIndices.forEach(index => {
        const predictedLabel = labelMap[preds[index]];
        const actualLabel = labelMap[labels[index]];
        console.log(`샘플 ${index + 1}: 실제 값 = ${actualLabel}, 예측 값 = ${predictedLabel}`);
        print(`샘플 ${index + 1}: 실제 값 = ${actualLabel}, 예측 값 = ${predictedLabel}`);
        
    });
}

// 디렉토리가 없을 경우 생성
function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`디렉토리 생성: ${dir}`);
    }
}

// 커스텀 콜백 함수
function createCustomCallback(model, lossChart, patience = 10) {
    let wait = 0;
    return {
        onEpochEnd: async (epoch, logs) => {
            console.log(`에폭 ${epoch + 1}: 손실 = ${logs.loss.toFixed(4)}, 검증 손실 = ${logs.val_loss.toFixed(4)}`);
            print(`에폭 ${epoch + 1}: 손실 = ${logs.loss.toFixed(4)}, 검증 손실 = ${logs.val_loss.toFixed(4)}`);

            //chart 
            const lossCtx = document.getElementById('lossChart').getContext('2d');
            
            updateChart(lossChart, epoch + 1, logs.loss, logs.val_loss);

            if (window.runStop == false) {
                
                console.log('사용자에 의해 학습이 중단되었습니다.');
                print('사용자에 의해 학습이 중단되었습니다.');
                
                model.stopTraining = true;
                
                // 생성된 canvas를 삭제한다.
                lossChart.destroy();
                // 2. 캔버스 DOM에서 제거
                const canvas = document.getElementById('lossChart');
                if (canvas) {
                    canvas.remove(); // DOM에서 캔버스 제거
                    console.log('캔버스가 삭제되었습니다.');
                }

                return;

            }
        },
        onTrainEnd: () => console.log('훈련 완료')
    };
}


// 메인 훈련 함수
async function mark_train(epoch_cnt = 50) {
    const dataDir = "C:\\Users\\sgkim\\Desktop\\aiimage\\mark";
    const modelDir = "C:\\Users\\sgkim\\Desktop\\aiimage\\model\\mark_model";

    ensureDirectoryExists(modelDir);

    const { imageData, labelMap } = getImagePathsAndLabels(dataDir);

    if (imageData.length === 0) {
        console.error("데이터가 없습니다. 데이터 디렉토리를 확인하세요.");
        return;
    }

    const numClasses = Object.keys(labelMap).length;
    const { xs, ys } = createDataset(imageData, numClasses);
    const model = buildCNNModel([60, 80, 3], numClasses);

    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy', // 원-핫 인코딩된 라벨에 적합한 손실 함수
        metrics: ['accuracy']
    });

    model.summary();

    // 차트 초기화 (한 번만 수행)
    const lossChart = initializeChart();

    try {
        await model.fit(xs, ys, {
            epochs: epoch_cnt,
            validationSplit: 0.2,
            callbacks: [createCustomCallback(model, lossChart)]
        });
        await model.save(`file://${modelDir}`);
        console.log(`모델이 ${modelDir} 디렉토리에 저장되었습니다.`);
    } catch (error) {
        console.error('모델 훈련 중 오류 발생:', error);
    }

    await evaluateModel(model, xs, ys, labelMap);
}

// 훈련 함수 실행
//mark_train(50);

// <canvas> 생성 함수 (한 번만 호출)
function createCanvas() {
    let canvas = document.getElementById('lossChart');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'lossChart';

        // 캔버스 스타일 설정: cam_view_box와 동일한 위치와 크기
        canvas.style.position = 'absolute';
        canvas.style.top = '0'; // 부모의 top에서 시작
        canvas.style.left = '0'; // 부모의 left에서 시작
        canvas.style.width = '100%'; // 부모의 너비에 맞춤
        canvas.style.height = '100%'; // 부모의 높이에 맞춤
        canvas.style.pointerEvents = 'none'; // 클릭 이벤트가 아래 요소로 전달되도록 설정
        canvas.style.zIndex = '10'; // cam_view_box 위에 표시되도록 z-index 설정

        // cam_view_box 내부에 추가
        const camViewBox = document.getElementById('cam_view_box');
        camViewBox.style.position = 'relative'; // 부모 요소를 relative로 설정
        camViewBox.appendChild(canvas); // cam_view_box에 캔버스를 추가

        // 캔버스에 흰색 배경을 채우기
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white'; // 배경색 설정
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 캔버스 전체를 흰색으로 채우기

    }
    return canvas;
}


// 차트 초기화 함수 (한 번만 호출)
function initializeChart() {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Epochs
            datasets: [
                {
                    label: 'Training Loss',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: 'Validation Loss',
                    data: [],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Epoch' } },
                y: { title: { display: true, text: 'Loss' } },
            },
            layout: {
                padding: 10, // 차트 내부 여백
            },
            backgroundColor: 'white',
        },
    });
}


// 차트 업데이트 함수 (콜백 내부에서 사용)
function updateChart(chart, epoch, trainValue, valValue) {
    chart.data.labels.push(epoch);
    chart.data.datasets[0].data.push(trainValue);
    chart.data.datasets[1].data.push(valValue);
    chart.update();
}


// 모듈 내보내기
module.exports = { stopControl, mark_train };
