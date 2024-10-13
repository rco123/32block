const Blockly = require('blockly');  // Blockly 전체 모듈 불러오기
const { javascriptGenerator } = require('blockly/javascript');  // JavaScript 코드 생성기 불러오기


Blockly.Blocks['controls_repeat_ext'] = {
    init: function() {
      this.appendValueInput("TIMES")
          .setCheck("Number")
          .appendField("repeat")
          .appendField(new Blockly.FieldVariable("item"), "VAR");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Repeat a block a number of times.");
      this.setHelpUrl("");
    }
  };
  
  javascriptGenerator.forBlock['controls_repeat_ext'] = function(block) {
    var repeats = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC) || '0';
    var branch = javascriptGenerator.statementToCode(block, 'DO');
    var code = 'for (var count = 0; count < ' + repeats + ' && window.runStop ; count++) {\n' + branch +  'await robo_delay(1)\n'  +    '}\n';
    return code;
  };
  
  Blockly.Blocks['controls_whileUntil'] = {
    init: function() {
      this.appendValueInput("BOOL")
          .setCheck("Boolean")
          .appendField(new Blockly.FieldDropdown([["while", "WHILE"], ["until", "UNTIL"]]), "MODE");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Repeat while or until a condition is met.");
      this.setHelpUrl("");
    }
  };

  javascriptGenerator.forBlock['controls_whileUntil'] = function(block) {
    var until = (block.getFieldValue('MODE') === 'UNTIL');
    var argument0 = javascriptGenerator.valueToCode(block, 'BOOL', until ? javascriptGenerator.ORDER_LOGICAL_NOT : javascriptGenerator.ORDER_NONE) || 'false';
    var branch = javascriptGenerator.statementToCode(block, 'DO');
    if (until) {
      argument0 = '!' + argument0;
    }
    var code = 'while (' + argument0 + ' &&  window.runStop ) {\n' + branch +  'await robo_delay(1)\n'  + '}\n';
    return code;
  };

  
  Blockly.Blocks['controls_flow_statements'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([["break out of loop", "BREAK"], ["continue with next iteration", "CONTINUE"]]), "FLOW");
      this.setPreviousStatement(true, null);
      this.setColour(120);
      this.setTooltip("Break out of a loop or continue with the next iteration.");
      this.setHelpUrl("");
    }
  };
  javascriptGenerator.forBlock['controls_flow_statements'] = function(block) {
    var dropdown_flow = block.getFieldValue('FLOW');
    var code = '';
    if (dropdown_flow === 'BREAK') {
      code = 'break;\n';
    } else if (dropdown_flow === 'CONTINUE') {
      code = 'continue;\n';
    }
    return code;
  };
  
  
  