
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');


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
    const selectedIndices = sampleIndices.slice(0, 50);

    console.log("\n랜덤으로 선택된 50개 샘플의 모델 예측 결과:");
    selectedIndices.forEach(index => {
        const predictedLabel = labelMap[preds[index]];
        const actualLabel = labelMap[labels[index]];
        console.log(`샘플 ${index + 1}: 실제 값 = ${actualLabel}, 예측 값 = ${predictedLabel}`);
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
function createCustomCallback(model, patience = 10) {
    let wait = 0;
    return {
        onEpochEnd: async (epoch, logs) => {
            console.log(`에폭 ${epoch + 1}: 손실 = ${logs.loss.toFixed(4)}, 검증 손실 = ${logs.val_loss.toFixed(4)}`);
            
            if (window.runStop == false) {
                
                console.log('사용자에 의해 학습이 중단되었습니다.');
                model.stopTraining = true;
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

    try {
        await model.fit(xs, ys, {
            epochs: epoch_cnt,
            validationSplit: 0.2,
            callbacks: [createCustomCallback(model)]
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

// 모듈 내보내기
module.exports = { stopControl, mark_train };
