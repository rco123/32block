const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');



let shouldStop  // 학습 도중 사용자가 shouldStop 변수를 true로 설정하면 학습 중단

// 내부 플래그를 관리하기 위한 클로저 함수
function createStopControl() {
    let shouldStop = false; // 기본값: false

    return {
        getShouldStop: () => shouldStop, // 현재 상태 반환 (getter)
        setShouldStop: (value) => {      // 상태 설정 (setter)
            shouldStop = value;
        }
    };
}
// stopControl 객체 생성
const stopControl = createStopControl();


/**
 * 1. 이미지 파일 경로 및 라벨 추출
 */
function getImagePathsAndLabels(dir) {
    const classes = fs.readdirSync(dir).filter(file => {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });

    const imageData = [];

    classes.forEach(className => {
        const classDir = path.join(dir, className);
        const files = fs.readdirSync(classDir).filter(file => {
            return ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase());
        });

        files.forEach(file => {
            const filePath = path.join(classDir, file);
            const fileName = path.basename(file, path.extname(file)); // 확장자 제거
            const parts = fileName.split('_');
            if (parts.length !== 2) return; // 파일 이름 형식이 맞지 않으면 건너뜀

            const label = parseFloat(parts[1]); // 라벨값 추출
            if (isNaN(label)) return; // 라벨값이 숫자가 아니면 건너뜀

            imageData.push({
                path: filePath,
                label: label
            });
        });
    });

    return imageData;
}

/**
 * 라벨 정규화 및 역정규화 함수
 */
function normalizeLabel(label, minLabel = -900, maxLabel = 900) {
    return label / maxLabel; // -900 ~ 900을 -1 ~ 1로 정규화
}

function denormalizeLabel(label, minLabel = -900, maxLabel = 900) {
    return label * maxLabel; // 다시 -900 ~ 900으로 역정규화
}

/**
 * 3. 이미지 로딩 및 전처리
 * 상단 절반을 제거한 후 80x60 이미지로 만들고, 상단 절반을 검은색으로 처리
 */
function loadImage(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);

        let decodedImage = tf.node.decodeImage(imageBuffer, 3) // RGB 이미지
            .resizeBilinear([60, 80]) // 80x60으로 리사이즈
            .toFloat()
            .div(tf.scalar(255.0)); // 0 ~ 255의 픽셀 값을 0 ~ 1로 정규화

        // 상단 절반을 검은색으로 설정
        decodedImage = tf.tidy(() => {
            const [height, width, channels] = decodedImage.shape;
            const halfHeight = Math.floor(height / 2);

            // 상단 절반 슬라이스
            const upperHalf = decodedImage.slice([0, 0, 0], [halfHeight, width, channels]);
            // 하단 절반 슬라이스
            const lowerHalf = decodedImage.slice([halfHeight, 0, 0], [height - halfHeight, width, channels]);

            // 상단 절반을 검은색(0)으로 설정
            const blackUpperHalf = tf.zeros([halfHeight, width, channels]);

            // 검은 상단 절반과 원본 하단 절반을 결합
            const combined = tf.concat([blackUpperHalf, lowerHalf], 0);

            return combined;
        });

        return decodedImage;
    } catch (error) {
        console.error(`이미지 로딩 오류: ${imagePath}`, error);
        return null;
    }
}

/**
 * 4. 데이터셋 생성
 */
function createDataset(data, minLabel = -900, maxLabel = 900) {
    const images = [];
    const labels = [];

    data.forEach(item => {
        const image = loadImage(item.path);
        if (image !== null) {
            images.push(image);
            const normalizedLabel = normalizeLabel(item.label, minLabel, maxLabel); // 라벨 정규화
            labels.push(normalizedLabel);
        }
    });

    const xs = tf.stack(images);
    const ys = tf.tensor(labels);
    
    return { xs, ys };
}


/**
 * 5. 간소화된 CNN 모델 정의
 * @returns {tf.Sequential} - 정의된 모델
 */
function buildSimplifiedCNNModel(inputShape) {
    const model = tf.sequential();

    model.add(tf.layers.conv2d({
        inputShape: inputShape,
        filters: 16,
        kernelSize: 3,
        activation: 'relu',
        padding: 'same'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));

    model.add(tf.layers.conv2d({
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
        padding: 'same'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));

    model.add(tf.layers.flatten());

    model.add(tf.layers.dense({
        units: 64,
        activation: 'relu'
    }));
    model.add(tf.layers.dropout({ rate: 0.5 }));

    model.add(tf.layers.dense({
        units: 1 // 회귀 문제이므로 활성화 함수 없음
    }));

    return model;
}


/**
 * 5. CNN 모델 정의 (출력 전에 2개의 추가 Dense 계층)
 * @returns {tf.Sequential} - 정의된 모델
 */
function buildEnhancedCNNModel(inputShape) {
    const model = tf.sequential();

    // 첫 번째 Conv2D + MaxPooling 계층
    model.add(tf.layers.conv2d({
        inputShape: inputShape,
        filters: 16,
        kernelSize: 3,
        activation: 'relu',
        padding: 'same'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));

    // 두 번째 Conv2D + MaxPooling 계층
    model.add(tf.layers.conv2d({
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
        padding: 'same'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));

    // 첫 번째 Flatten 계층
    model.add(tf.layers.flatten());

    // 추가된 Dense 계층 1
    model.add(tf.layers.dense({
        units: 512,
        activation: 'relu'
    }));

    // 추가된 Dense 계층 1
    model.add(tf.layers.dense({
        units: 16,
        activation: 'relu'
    }));


    // // 드롭아웃 추가
    // model.add(tf.layers.dropout({ rate: 0.5 }));

    // 출력 계층
    model.add(tf.layers.dense({
        units: 1 // 회귀 문제이므로 활성화 함수 없음
    }));

    return model;
}



/**
 * 6. 모델 평가 및 예측 확인 (랜덤으로 50개 샘플 출력, 소수점 없이 정수 출력)
 */
async function evaluateModel(model, xs, ys, minLabel = -900, maxLabel = 900) {
    const preds = model.predict(xs).dataSync();
    const labels = ys.dataSync(); // 실제 정규화된 값

    const sampleIndices = Array.from({length: preds.length}, (_, i) => i); // 전체 인덱스 배열 생성
    tf.util.shuffle(sampleIndices); // 인덱스 랜덤 셔플
    const selectedIndices = sampleIndices.slice(0, 50); // 랜덤으로 50개 선택

    console.log("\n랜덤으로 선택된 50개 샘플의 모델 예측 결과:");
    for (let i = 0; i < selectedIndices.length; i++) {
        const index = selectedIndices[i];
        const originalLabel = Math.round(denormalizeLabel(labels[index], minLabel, maxLabel)); // 실제 값 역정규화 후 정수로 변환
        const predictedLabel = Math.round(denormalizeLabel(preds[index], minLabel, maxLabel)); // 예측 값 역정규화 후 정수로 변환
        console.log(`샘플 ${index + 1}: 실제 값 = ${originalLabel}, 예측 값 = ${predictedLabel}`);
    }
}


/**
 * 7. 커스텀 콜백 정의 (함수 기반)
 * - 최적의 검증 손실을 추적하고 모델을 저장
 * - 조기 중단(Early Stopping) 구현
 */
function createCustomCallback(model, patience = 10) {
    let bestValLoss = null;
    let wait = 0;
    const history = {
        loss: [],
        val_loss: []
    };

    return {
        onEpochBegin: (epoch, logs) => {
            console.log(`\n에폭 ${epoch + 1} 시작`);
        },
        onEpochEnd: async (epoch, logs) => {
            console.log(`에폭 ${epoch + 1}: 손실 = ${logs.loss.toFixed(4)}, 검증 손실 = ${logs.val_loss.toFixed(4)}`);
            history.loss.push(logs.loss);
            history.val_loss.push(logs.val_loss);


            // 학습 도중 사용자가 shouldStop 변수를 true로 설정하면 학습 중단
            //if (stopControl.getShouldStop()) {
            if (window.runStop == 0) {
                    console.log('사용자에 의해 학습이 중단되었습니다.');
                model.stopTraining = true; // TensorFlow.js에서 학습 중단 설정
                return; // 함수 종료
            }

            // if (bestValLoss === null || logs.val_loss < bestValLoss) {
            //     bestValLoss = logs.val_loss;
            //     wait = 0;
            //     await model.save('file://./best-model');
            //     console.log('최적의 모델을 ./best-model 디렉토리에 저장했습니다.');
            // } else {
            //     wait++;
            //     console.log(`개선 없음 (${wait}/${patience})`);
            //     if (wait >= patience) {
            //         console.log(`검증 손실이 ${patience} 에포크 동안 개선되지 않았습니다. 훈련을 중단합니다.`);
            //         model.stopTraining = true;
            //     }
            // }
        },
        onTrainEnd: () => {
            console.log('훈련 완료');
            // 손실 기록을 파일로 저장
            fs.writeFileSync('training_history.json', JSON.stringify(history, null, 2));
            console.log('훈련 기록을 training_history.json 파일에 저장했습니다.');
        }
    };
}


/**
 * 8. 메인 훈련 함수
 */
async function lane_train() {
    const dataDir = "C:\\Users\\sgkim\\Desktop\\aiimage\\lane";

    // 1. 이미지 경로 및 라벨 수집
    const allData = getImagePathsAndLabels(dataDir);
    console.log(`전체 이미지 수: ${allData.length}`);

    if (allData.length === 0) {
        console.error("데이터가 없습니다. 데이터 디렉토리를 확인하세요.");
        return;
    }

    // 2. 데이터셋 생성
    const { xs, ys } = createDataset(allData);

    // 3. 간소화된 CNN 모델 정의 및 컴파일
    const model = buildEnhancedCNNModel([60, 80, 3]);  // 입력 모양 [높이, 너비, 채널]
    model.compile({
        optimizer: tf.train.adam(0.001), // 학습률 설정
        loss: 'meanSquaredError', // 회귀 문제를 위한 손실 함수
        metrics: ['mse', 'mae']
    });

    // 모델 요약 출력
    model.summary();

    // 4. 모델 훈련
    const epochs = 100; // 에폭 수 설정
    try {
        await model.fit(xs, ys, {
            epochs: epochs,
            validationSplit: 0.2, // 검증 데이터를 20%로 설정
            callbacks: [createCustomCallback(model, 10)]
        });

        // 5. 최종 모델 저장
        await model.save('file://./model');
        console.log('모델이 ./model 디렉토리에 저장되었습니다.');
    } catch (error) {
        console.error('모델 훈련 중 오류 발생:', error);
    }

    // 6. 모델 평가 및 예측 확인
    await evaluateModel(model, xs, ys);
}

// 훈련 함수 실행
//train();

// 모듈화: stopControl 객체와 train 함수 내보내기
module.exports = {
    stopControl,
    lane_train
};
