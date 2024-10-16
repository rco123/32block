const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const { Chart } = require('chart.js/auto');

// 전역 변수 선언
let lossChart = null;
let runStop = true; // 학습 중단 제어용 변수

// <canvas> 생성 함수 (한 번만 호출)
function createCanvas() {
    let canvas = document.getElementById('lossChart');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'lossChart';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '10';

        const camViewBox = document.getElementById('cam_view_box');
        camViewBox.style.position = 'relative';
        camViewBox.appendChild(canvas);
    }
    return canvas;
}

// 차트 초기화 함수
function initializeChart() {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');

    if (lossChart) {
        lossChart.destroy(); // 기존 차트가 있다면 파기
        console.log('기존 차트가 파기되었습니다.');
    }

    lossChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
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
            layout: { padding: 10 },
        },
    });

    return lossChart;
}

// 차트 업데이트 함수
function updateChart(chart, epoch, trainValue, valValue) {
    if (!chart || !chart.data || !chart.data.labels || chart.data.datasets.length < 2) {
        console.error('차트가 초기화되지 않았거나 데이터 구조가 올바르지 않습니다.');
        return;
    }

    chart.data.labels.push(epoch);
    chart.data.datasets[0].data.push(trainValue);

    if (valValue !== undefined) {
        chart.data.datasets[1].data.push(valValue);
    }

    chart.update();
}

// 이미지 경로와 라벨 추출 함수
function getImagePathsAndLabels(dir) {
    const classes = fs.readdirSync(dir).filter(file =>
        fs.statSync(path.join(dir, file)).isDirectory()
    );

    const imageData = [];
    classes.forEach(className => {
        const classDir = path.join(dir, className);
        const files = fs.readdirSync(classDir).filter(file =>
            ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
        );

        files.forEach(file => {
            const label = parseFloat(file.split('_')[1]); // 파일명에서 라벨 추출
            if (!isNaN(label)) {
                imageData.push({ path: path.join(classDir, file), label });
            }
        });
    });

    return imageData;
}

// 이미지 로딩 및 전처리 함수
function loadImage(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        return tf.tidy(() => {
            let decodedImage = tf.node.decodeImage(imageBuffer, 3)
                .resizeBilinear([60, 80])
                .toFloat()
                .div(tf.scalar(255.0));

            const [height, width, channels] = decodedImage.shape;
            const halfHeight = Math.floor(height / 2);
            const upperHalf = tf.zeros([halfHeight, width, channels]);
            const lowerHalf = decodedImage.slice([halfHeight, 0, 0], [height - halfHeight, width, channels]);

            return tf.concat([upperHalf, lowerHalf], 0);
        });
    } catch (error) {
        console.error(`이미지 로딩 오류: ${imagePath}`, error);
        return null;
    }
}

// 데이터셋 생성 함수
function createDataset(data) {
    const images = [];
    const labels = [];

    data.forEach(item => {
        const image = loadImage(item.path);
        if (image) {
            images.push(image);
            labels.push(item.label / 900); // 라벨 정규화
        }
    });

    return {
        xs: tf.stack(images),
        ys: tf.tensor(labels),
    };
}

// CNN 모델 빌드 함수
function buildCNNModel() {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({ inputShape: [60, 80, 3], filters: 16, kernelSize: 3, activation: 'relu' }));
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
    model.add(tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: 'relu' }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
    return model;
}

// 커스텀 콜백 함수 생성
function createCustomCallback(model) {
    return {
        onEpochEnd: async (epoch, logs) => {
            console.log(`에폭 ${epoch + 1}: 손실 = ${logs.loss.toFixed(4)}, 검증 손실 = ${logs.val_loss.toFixed(4)}`);

            if (lossChart) {
                updateChart(lossChart, epoch + 1, logs.loss, logs.val_loss);
            }

            if (!runStop) {
                model.stopTraining = true;
                console.log('학습이 중단되었습니다.');
            }
        },
        onTrainEnd: () => console.log('훈련 완료'),
    };
}

// 메인 훈련 함수
async function lane_train(epochCount = 50) {
    const dataDir = "C:\\Users\\sgkim\\Desktop\\aiimage\\lane";
    const allData = getImagePathsAndLabels(dataDir);

    if (allData.length === 0) {
        console.error("데이터가 없습니다.");
        return;
    }

    const { xs, ys } = createDataset(allData);
    const model = buildCNNModel();
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    lossChart = initializeChart();

    await model.fit(xs, ys, {
        epochs: epochCount,
        validationSplit: 0.2,
        callbacks: [createCustomCallback(model)],
    });

    await model.save(`file://C:/Users/sgkim/Desktop/aiimage/model/lane_model`);
    console.log('모델이 저장되었습니다.');
}

// 프로그램 시작 시 DOMContentLoaded 이벤트 사용
document.addEventListener('DOMContentLoaded', () => {
    lane_train(50);
});
