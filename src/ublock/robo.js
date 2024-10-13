const Blockly = require('blockly');
const { javascriptGenerator } = require('blockly/javascript');

const colorVal= 100

//  <category name="ROBO_BLK" colour="%{BKY_VARIABLES_HUE}">
// 		<block type="robo_move"></block>
// 		<block type="robo_stop"></block>
// 		<block type="robo_delay"></block>
// 		<block type="robo_led_left"></block>
// 		<block type="robo_led_right"></block>
// 		<block type="robo_beep"></block>
// 	</category>  

  
exports.sendJsonCommand=(jsoncmd)=> {
    sendJsonCommand(jsoncmd);
}
function sendJsonCommand(jsoncmd) {

    const ipAddress = document.getElementById('ip_add_str').textContent;
     // IP 주소가 올바르게 입력되었는지 확인
    console.log("IP Address: ", ipAddress);
    
    // WebSocket 연결 설정 (예시)
    const socket = new WebSocket(`ws://${ipAddress}:92/alt_ws`);

    // 2. WebSocket 연결이 성공했을 때 실행될 코드
    socket.addEventListener('open', function () {
      console.log('Connected to WebSocket server');

      // 3. JSON 명령어 전송
      socket.send(JSON.stringify(jsoncmd));
      console.log('JSON command sent:', jsoncmd);
      // 4. JSON 명령어 전송 후 WebSocket 연결을 종료
      socket.close();
      console.log('WebSocket connection closed after sending command');
    });

    // 5. 서버로부터 메시지를 받았을 때
    socket.addEventListener('message', function (event) {
      console.log('Message from server:', event.data);
    });

    // 6. WebSocket 연결이 닫혔을 때
    socket.addEventListener('close', function () {
      console.log('WebSocket connection closed');
    });
  } 


//<<
Blockly.Blocks['robo_move'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("robo_move( angle=");
		this.appendValueInput("angle")
			.setCheck("Number");
		this.appendDummyInput()
			.appendField(",")
			.appendField("speed=");
		this.appendValueInput("speed")
			.setCheck("Number");
		this.appendDummyInput()
			.appendField(")");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(colorVal);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};

javascriptGenerator.forBlock['robo_move'] = function (block) {
	var value_angle = javascriptGenerator.valueToCode(block, 'angle', javascriptGenerator.ORDER_ATOMIC);
	var value_speed = javascriptGenerator.valueToCode(block, 'speed', javascriptGenerator.ORDER_ATOMIC);
	// TODO: Assemble Python into code variable.
	let strout = 'robo_move(' + value_angle + ', ' + value_speed + ')';
	var code = strout + '\n';
	return code;
};
exports.robo_move = function(angle, speed)
{
    const jsoncmd = { cmd: "move", angle: angle, speed: speed  }
    sendJsonCommand(jsoncmd);
}
//>>

//<<
Blockly.Blocks['robo_stop'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("robo.stop( )");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(colorVal);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
javascriptGenerator.forBlock['robo_stop'] = function (block) {
	// TODO: Assemble Python into code variable.
	let strout = 'robo_stop()'
	var code = strout + '\n';
	return code;
};
exports.robo_stop = function(angle, speed)
{
    const jsoncmd = { "cmd": "move", "angle": 0, "speed": 0  }
    sendJsonCommand(jsoncmd);
}
//>>



//<<
Blockly.Blocks['robo_delay'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("robo_delay(");
		this.appendValueInput("NAME")
			.setCheck("Number");
		this.appendDummyInput()
			.appendField(")");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(colorVal);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
javascriptGenerator.forBlock['robo_delay'] = function (block) {
	let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
	let code = `await robo_delay(${value_name})`
	return code + '\n';
};
//>>
// timewait 함수를 작성하여 지연을 Promise로 처리
exports.robo_delay = async (ms)=> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//<<
Blockly.Blocks['robo_get_img'] = {
	init: function () {
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
javascriptGenerator.forBlock['robo_get_img'] = function (block) {
	let strout = 'robo_get_img( )';
	var code = strout;
	return [code, javascriptGenerator.ORDER_NONE];
};
//>>



//<< 
Blockly.Blocks['robo_led_left'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("robo_led_left(");
		this.appendValueInput("NAME")
			.setCheck("Number");
		this.appendDummyInput()
			.appendField(")");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(colorVal);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
javascriptGenerator.forBlock['robo_led_left'] = function (block) {
	var value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
	// TODO: Assemble Python into code variable.
	let strout = 'robo_led_left(' + value_name + ')';
	var code = strout + '\n';
	return code;
};
//>>

exports.robo_led_left = ()=>
{
    const jsoncmd = { "cmd": "led", "state": on, "dir": "left"  }
    sendJsonCommand(jsoncmd);
}

//<<
Blockly.Blocks['robo_led_right'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("robo_led_right(");
		this.appendValueInput("NAME")
			.setCheck("Number");
		this.appendDummyInput()
			.appendField(")");

		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(colorVal);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
javascriptGenerator.forBlock['robo_led_right'] = function (block) {
	var value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
	// TODO: Assemble Python into code variable.
	let strout = 'robo_led_right(' + value_name + ')';
	var code = strout + '\n';
	return code;
};
//>>

exports.robo_led_right = ()=>
{
    const jsoncmd = { "cmd": "led", "state": on, "dir": "right"  }
    sendJsonCommand(jsoncmd);
}



//<<
Blockly.Blocks['robo_beep'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("robo_beep()");
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(colorVal);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
javascriptGenerator.forBlock['robo_beep'] = function (block) {
	// TODO: Assemble Python into code variable.
	let strout = 'robo_beep()'
	var code = strout + '\n';
	return code;
};
//>>

exports.robo_beep = function()
{
    // const jsoncmd = { "cmd": "beep" }
    // sendJsonCommand(jsoncmd);

    console.log("run Beep")

}


