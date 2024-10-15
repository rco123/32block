
exports.xtoolbox = 
`<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none   ">

    <category name="LOGIC" colour="%{BKY_LOGIC_HUE}" >
      <block type="controls_if"   ></block>
      <block type="logic_compare"></block>
      <block type="logic_operation"></block>
      <block type="logic_negate"></block>
      <block type="logic_boolean"></block>
      <block type="logic_null"></block>
      <block type="logic_ternary"></block>
    </category>


    <category name="MATH" colour="%{BKY_MATH_HUE}">
      <block type="math_number">
        <field name="NUM">123</field>
      </block>
      <block type="math_arithmetic">
        <value name="A">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="B">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="math_single">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">9</field>
          </shadow>
        </value>
      </block>
      <block type="math_trig">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">45</field>
          </shadow>
        </value>
      </block>
      <block type="math_constant"></block>
      <block type="math_number_property">
        <value name="NUMBER_TO_CHECK">
          <shadow type="math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>
      <block type="math_round">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">3.1</field>
          </shadow>
        </value>
      </block>
      <block type="math_on_list"></block>
      <block type="math_modulo">
        <value name="DIVIDEND">
          <shadow type="math_number">
            <field name="NUM">64</field>
          </shadow>
        </value>
        <value name="DIVISOR">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="math_constrain">
        <value name="VALUE">
          <shadow type="math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <value name="LOW">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="HIGH">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_int">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_float"></block>
      <block type="math_atan2">
        <value name="X">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="Y">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
    </category>


    <category name="TEXT" colour="%{BKY_TEXTS_HUE}">
      
      <block type="text"></block>
      <block type="text_print">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      
    </category>

    <sep></sep>
    <category name="VARIABLES" colour="%{BKY_VARIABLES_HUE}" custom="VARIABLE"></category>
    <category name="FUNCTIONS" colour="%{BKY_PROCEDURES_HUE}" custom="PROCEDURE"></category>
    <sep></sep>

    <category name="LOOPS" colour="%{BKY_LOOPS_HUE}">
      
	<block type="controls_repeat_ext">
        <value name="TIMES">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>

      <block type="controls_whileUntil"></block>
      
	  <block type="controls_flow_statements"></block>
    
	  </category>


	
	<category name="ROBO_BLK" colour="%{BKY_VARIABLES_HUE}">
		<block type="robo_move"></block>
		<block type="robo_stop"></block>
		<block type="robo_delay"></block>
		<block type="robo_led_left"></block>
		<block type="robo_led_right"></block>
		<block type="robo_beep"></block>
	</category>

	<category name="CAM_BLK" colour="%{BKY_VARIABLES_HUE}">
		<block type="robo_cam_run"></block>
		<block type="robo_get_img"></block>
		<block type="robo_dis_ang"></block>
	</category>
	
	
	<category name="AI_BLK" colour="%{BKY_VARIABLES_HUE}">
		<block type="robo_mark_det"></block>
		<block type="robo_lane_det"></block>
	</category>

	<category name="DATA_BLK" colour="%{BKY_VARIABLES_HUE}">
		<block type="robo_set_speed">
    <value name="NAME">
          <shadow type="math_number">
            <field name="NUM">20</field>
          </shadow>
        </value>
    </block>

		<block type="robo_dir_clean"></block>
		<block type="robo_hp_con">
        <value name="IDIV">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
    </block>
	</category>
	
	<sep></sep>

	
	</xml>
    `
  
