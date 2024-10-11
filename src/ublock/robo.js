const Blockly = require('blockly');
//Blockly.JavaScript = require('blockly/javascript');
const { javascriptGenerator } = require('blockly/javascript');

//export const forBlock = Object.create(null);

// // `Blockly.Blocks`가 정의된 이후에 커스텀 블록을 설정합니다.
// if (Blockly && Blockly.Blocks) {

  Blockly.Blocks['led_on'] = {
    init: function() {
      this.appendDummyInput().appendField("Turn LED On");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Turns the LED on.");
      this.setHelpUrl("");
    },
  };

  Blockly.Blocks['led_off'] = {
    init: function() {
      this.appendDummyInput().appendField("Turn LED Off");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Turns the LED off.");
      this.setHelpUrl("");
    },
  };

  Blockly.Blocks['delay'] = {
    init: function() {
      this.appendValueInput("NAME")
          .appendField("delay(");
      this.appendDummyInput(")") 
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Turns the LED off.");
      this.setHelpUrl("");
    },
  };


Blockly.Blocks['while_loop'] = {
  init: function () {
    this.appendValueInput('CONDITION')
      .setCheck('Boolean')
      .appendField('while');
    this.appendStatementInput('DO')
      .appendField('do');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);
    this.setTooltip('Repeats the enclosed statements while the condition is true.');
    this.setHelpUrl('');
  },
};


// 'repeat_n_times' 블록 정의
Blockly.Blocks['repeat_n_times'] = {
  init: function () {
    this.appendValueInput('TIMES')
      .setCheck('Number')
      .appendField('repeat');
    this.appendStatementInput('DO')
      .appendField('do');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Repeat the enclosed statements a specified number of times.');
    this.setHelpUrl('https://en.wikipedia.org/wiki/For_loop');
  },
};



javascriptGenerator.forBlock['while_loop'] = function (block) {
  const condition = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE);
  const branch = javascriptGenerator.statementToCode(block, 'DO');
  
  const code = `while (${condition} && runStop) {\n${branch}}\n`;
  return code;
};



// JavaScript 코드 생성기 등록 (forBlock 스타일)
javascriptGenerator.forBlock['repeat_n_times'] = function (block) {
  const repeats = javascriptGenerator.valueToCode(
    block,
    'TIMES',
    javascriptGenerator.ORDER_ATOMIC
  ) || '0';

  const branch = javascriptGenerator.statementToCode(block, 'DO');
  const code = `for (let count = 0; count < ${repeats} && runStop ; count++) {\n
      await delay(1);\n
      ${branch}}\n`;
  
  return code;
};



// JavaScript 코드 생성기 등록
javascriptGenerator.forBlock['led_on'] = function (block) {
    return 'turnLedOn();\n';
  };
  
  javascriptGenerator.forBlock['led_off'] = function (block) {
    return 'turnLedOff();\n';
  };

  javascriptGenerator.forBlock['delay'] = function (block) {
    let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
    let code = `await delay(${value_name})`
    return code + '\n';
  };



// // Register code generator functions
// Blockly.JavaScript['led_on'] = function (block) {
//     return 'turnLedOn();\n';
// };
  
// Blockly.JavaScript['led_off'] = function (block) {
//     return 'turnLedOff();\n';
// };
  
