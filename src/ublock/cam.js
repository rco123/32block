const Blockly = require('blockly');
const { javascriptGenerator } = require('blockly/javascript');


const { disCamViewWindow } = require("../video.js")

const colorVal = 200;

// <!-- <category name="CAM_BLK" colour="%{BKY_VARIABLES_HUE}">
//     <block type="robo_cam_run"></block>
//     <block type="robo_get_img"></block>
//     <block type="robo_dis_img_ang"> --></block>


//<<
Blockly.Blocks['robo_cam_run'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("robo_cam_run( )");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(colorVal);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
javascriptGenerator.forBlock['robo_cam_run'] = function (block) {
	// TODO: Assemble Python into code variable.
	let strout = 'robo_cam_run( )'
	var code = strout + '\n';
	return code;
};
//>>
exports.robo_cam_run = async ()=>{
// start camera 데이터를 받아오게 하는 함수

    disCamViewWindow()
}


//<<
Blockly.Blocks['robo_get_img'] = {
init: function() {
    this.appendDummyInput()
        .appendField("robo_get_img(");
    this.appendDummyInput()
        .appendField(")");
    
    this.setInputsInline(true);

    this.setInputsInline(true);
    this.setOutput(true, null);

    this.setColour(colorVal);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
javascriptGenerator.forBlock['robo_get_img'] = function(block) {
  
  let strout = 'robo_get_img( )';
  var code = strout;
  return [code, javascriptGenerator.ORDER_NONE];
};
//>>

exports.robo_get_img = async () => {
    return new Promise((resolve, reject) => {
      // 이벤트를 대기하고 이미지를 처리
      const handleImageEvent = (event) => {
        const img = event.detail.img; // 이벤트로부터 이미지 데이터를 가져옴
        console.log('Image received via event:', img);
        
        // 이미지가 준비되었으므로 Promise를 해결
        resolve(img);
        
        // 더 이상 이벤트를 듣지 않도록 리스너 제거
        window.removeEventListener('imageReady', handleImageEvent);
      };
  
      // 'imageReady' 이벤트를 대기
      window.addEventListener('imageReady', handleImageEvent);
  
      // 여기서 이미지 요청을 보낼 수 있습니다.
      // 예를 들어, 이미지를 서버에서 받아오는 코드 등...
    });
  };




//<<
Blockly.Blocks['robo_dis_ang'] = {
init: function() {
    this.appendDummyInput()
        .appendField("robo_dis_ang(");
    // angle 숫자 입력
    this.appendValueInput("ANGLE")
        .setCheck("Number")
        .appendField("angle =");

    this.appendDummyInput()
        .appendField(")");

    this.setInputsInline(true);  // 모든 입력을 한 줄로 표시
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(colorVal);  // 블록 색상 설정
    this.setTooltip("Display image with angle using robo.dis_ang()");
    this.setHelpUrl("");
}
};
javascriptGenerator.forBlock['robo_dis_ang'] = function(block) {
var value_angle = javascriptGenerator.valueToCode(block, 'ANGLE', javascriptGenerator.ORDER_ATOMIC);  // angle 값 가져오기

// Python 코드 생성
var code = 'robo.dis_img_ang(' + value_angle + ')\n';
return code;
};
//>>

