const Blockly = require('blockly');  // Blockly 전체 모듈 불러오기
const { javascriptGenerator } = require('blockly/javascript');  // JavaScript 코드 생성기 불러오기


const maxLines = 50; // 최대 줄 수 설정
const lines = []; // 출력창에 표시될 텍스트를 저장할 

exports.fxCodeOut= function(str){
    fxCodeOut(str)
}
function fxCodeOut(str) {
    
    const outputDiv = document.getElementById('code_out');
    const newText = str;
    console.log("run fxCodeOut ", str)

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

Blockly.Blocks['text_print_a'] = {
    init: function () {
        this.appendValueInput('TEXT')
            .setCheck('String')
            .appendField('print');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);

        this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);
        this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    }
};
javascriptGenerator.forBlock['text_print'] = function (block) {
    var msg = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_NONE);
    return 'print_a(' + msg + ');\n';
};
exports.print_a = (str) => {
    fxCodeOut(str)
}
