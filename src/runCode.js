const { javascriptGenerator } = require('blockly/javascript');

const { robo_delay, robo_beep, robo_move, robo_stop } = require("./ublock/robo")
const {robo_cam_run} = require("./ublock/cam")
const {robo_set_speed, robo_dir_clean,robo_hp_con} = require("./ublock/data")
const {print_a} = require("./ublock/print")



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
        print_a("End Program..")
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



