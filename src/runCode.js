const { javascriptGenerator } = require('blockly/javascript');

const { robo_delay, robo_beep, robo_move, robo_stop } = require("./ublock/robo")
const {robo_cam_run} = require("./ublock/cam")
const {robo_set_speed} = require("./ublock/data")



const maxLines = 50; // 최대 줄 수 설정
const lines = []; // 출력창에 표시될 텍스트를 저장할 배열
function fxCodeOut(str) {
    const outputDiv = document.getElementById('code_out');
    const newText = str;

    // 배열에 새로운 줄 추가
    lines.push(newText);

    // 최대 줄 수를 초과하면 가장 오래된 줄 삭제
    if (lines.length > maxLines) {
        lines.shift(); // 가장 오래된 줄 삭제
    }
    // 배열을 문자열로 합쳐 출력창에 표시
    outputDiv.textContent = lines.join('\n');

    // 출력창의 스크롤을 항상 맨 아래로 유지
    outputDiv.scrollTop = outputDiv.scrollHeight;
}



// Blockly JavaScript 생성기 사용
exports.extJavaCode= ()=> {
    console.log("end program eval")
    window.runStop = 0
}

// Blockly JavaScript 생성기 사용
exports.runJavaCode=()=> {

    window.runStop = 0
    
    // Blockly JavaScript 생성기 사용
    let genCode = generateJavaCode()

    let eval_code = `
    async function runLoop() {
        ${genCode}
        console.log('Loop completed');
    }
    runLoop();
    `;

    console.log("run code = ")
    console.log(eval_code);


    try {
        window.runStop = 1; // 실행을 시작하는 플래그
        eval(eval_code); // 생성된 코드를 실행
        fxCodeOut("End Program..")
    } catch (error) {
        console.error('Error executing generated code:', error);
    }

}

exports.generateJavaCode = ()=>{
    generateJavaCode()
}
// Blockly JavaScript 생성기 사용
function generateJavaCode() {

    if (!window.workspace) {
        console.error('Workspace is not initialized.');
        return;
    }

    /// javascriptGenerator를 사용하여 코드 생성
    const code = javascriptGenerator.workspaceToCode(window.workspace);
    //const code = Blockly.JavaScript.workspaceToCode(workspace);
    console.log('Generated Code:\n', code);

    return code;

    // 생성된 코드를 페이지의 특정 요소에 표시 (필요 시)
    //const codeOutputElement = document.getElementById('codeOutput');
    // if (codeOutputElement) {
    //   codeOutputElement.textContent = code;
    // }
}



