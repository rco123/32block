const Blockly = require('blockly');
const { javascriptGenerator } = require('blockly/javascript');
const {sendJsonCommand} = require("./robo")

const colorVal = 200;


// <category name="DATA_BLK" colour="%{BKY_VARIABLES_HUE}">
// <block type="fun_robo_dir_clean"></block>
// <block type="fun_robo_hp_con"></block>
// </category>


//<<
Blockly.Blocks['robo_set_speed'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("robo_set_speed(speed: 0 ~ 255 ");
		this.appendValueInput("NAME")
			.setCheck("Number")
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
javascriptGenerator.forBlock['robo_set_speed'] = function (block) {
	let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
	let code = `robo_set_speed(${value_name})`
	return code + '\n';
};

//>>
exports.robo_set_speed = (ms)=> {

    if(ms < 0 ) ms = 0;
    if(ms > 255) ms = 255;
    const jsoncmd = { "cmd": "set_speed", "speed": ms  }
    sendJsonCommand(jsoncmd);
}
    

  
Blockly.Blocks['robo_dir_clean'] = {
  init: function() {
      this.appendDummyInput()
          .appendField("robo_dir_clean(")
          .appendField(new Blockly.FieldDropdown([
            ["lane0", "lane0"],  // 실제 값도 소문자로 설정
            ["lane1", "lane1"], 
            ["lane2", "lane2"], 
            ["mark0", "mark0"], 
            ["mark1", "mark1"], 
            ["mark2", "mark2"]
          ]), "NAME")  // 드롭다운으로 선택
          .appendField(")");
          
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorVal);
      this.setTooltip("");
      this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['robo_dir_clean'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');  // 드롭다운에서 선택된 값을 가져옴
  var code = 'robo_dir_clean("' + dropdown_name + '")\n';
  return code;
};

  
//<<
// 블록 정의
Blockly.Blocks['robo_hp_con'] = {
  init: function() {
      this.appendDummyInput()
          .appendField("robo.hp_con(");
      
      // sdir 드롭다운 입력 (lane0, lane1, lane2, mark0, mark1, mark2)
      this.appendDummyInput()
          .appendField('sdir =')
          .appendField(new Blockly.FieldDropdown([
            ["lane0", "lane0"],
            ["lane1", "lane1"],
            ["lane2", "lane2"],
            ["mark0", "mark0"],
            ["mark1", "mark1"],
            ["mark2", "mark2"]
          ]), "SDIR");

     
      // idiv 숫자 입력
      this.appendValueInput("IDIV")
          .setCheck("Number")
          .appendField(", idiv =");

      // asens 숫자 입력
      this.appendValueInput("ASENS")
          .setCheck("Number")
          .appendField(", asens =");

      this.appendDummyInput()
          .appendField(")");

      this.setInputsInline(true);  // 모든 입력을 한 줄로 표시
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorVal);  // 블록 색상 설정
      this.setTooltip("Calls robo.hp_con with the specified parameters.");
      this.setHelpUrl("");
    }
};

// javascriptGenerator 코드 생성기
javascriptGenerator.forBlock['robo_hp_con'] = function(block) {
  var dropdown_sdir = block.getFieldValue('SDIR');  // sdir 드롭다운 값
  var value_idiv = javascriptGenerator.valueToCode(block, 'IDIV', javascriptGenerator.ORDER_ATOMIC);  // idiv 값
  var value_asens = javascriptGenerator.valueToCode(block, 'ASENS', javascriptGenerator.ORDER_ATOMIC);  // asens 값

  var code = `robo_hp_con(sdir="${dropdown_sdir}", idiv=${value_idiv}, asens=${value_asens})\n`;
  return code;
};




