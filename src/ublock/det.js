const Blockly = require('blockly');
const { javascriptGenerator } = require('blockly/javascript');

const colorVal = 200;

// <!-- <category name="CAM_BLK" colour="%{BKY_VARIABLES_HUE}">
//     <block type="robo_lane_det"></block>
//     <block type="robo_mark_det"></block>

//<
Blockly.Blocks['robo_lane_det'] = {
    init: function() {
      this.appendValueInput("NAME")
          .appendField("robo_lane_det(img=");
      this.appendDummyInput()
          .appendField(")");
      
          this.setInputsInline(true);
      this.setOutput(true, null);
          
      this.setColour(colorVal);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  javascriptGenerator.forBlock['robo_lane_det'] = function(block) {
    var value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = "robo_lane_det(" + value_name + ")";
    return [code, javascriptGenerator.ORDER_NONE];
    
  };
  //>


//<
Blockly.Blocks['robo_mark_det'] = {
    init: function() {
      this.appendValueInput("NAME")
          .appendField("robo_mark_det(img=");
      this.appendDummyInput()
          .appendField(")");
      
          this.setInputsInline(true);
      this.setOutput(true, null);
          
      this.setColour(colorVal);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  javascriptGenerator.forBlock['robo_mark_det'] = function(block) {
    var value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = "robo_mark_det(" + value_name + ")";
    return [code, javascriptGenerator.ORDER_NONE];
    
  };
  //>


