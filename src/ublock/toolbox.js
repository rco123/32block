
//export var xml_basic_tail = `</xml>`

exports.mtoolbox = {
	kind: 'categoryToolbox',
	contents: [
	  {
		kind: 'category',
		name: 'Inputs',
		colour: '%{BKY_MATH_HUE}',
		contents: [
		  {
			kind: 'block',
			type: 'math_number',
			gap: 32,
			fields: {
			  NUM: 123,
			},
		  },
		  {
			kind: 'block',
			type: 'text',
		  },
		  {
			kind: 'block',
			type: 'text_prompt_ext',
			VALUE: {
			  name: 'text',
			  shadow: {
				type: 'text',
				fields: {
				  TEXT: 'abc',
				},
			  },
			},
		  },
		],
	  },
	  {
		kind: 'category',
		name: 'Variables',
		colour: '%{BKY_VARIABLES_HUE}',
		custom: 'VARIABLE',
	  },
	  {
		kind: 'category',
		name: 'Functions',
		colour: '%{BKY_PROCEDURES_HUE}',
		custom: 'PROCEDURE',
	  },
	],
  };



exports.mtoolboxx = 
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
    <category name="LOOPS" colour="%{BKY_LOOPS_HUE}">
      <block type="controls_repeat_ext">
        <value name="TIMES">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="controls_whileUntil"></block>
      <block type="controls_for">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <value name="BY">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="controls_forEach"></block>
      <block type="controls_flow_statements"></block>
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
      <block type="text_join"></block>
      <block type="text_append">
        <value name="TEXT">
          <shadow type="text"></shadow>
        </value>
      </block>
      <block type="text_length">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_isEmpty">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT"></field>
          </shadow>
        </value>
      </block>
      <block type="text_indexOf">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">{textVariable}</field>
          </block>
        </value>
        <value name="FIND">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_charAt">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">{textVariable}</field>
          </block>
        </value>
      </block>
      <block type="text_getSubstring">
        <value name="STRING">
          <block type="variables_get">
            <field name="VAR">{textVariable}</field>
          </block>
        </value>
      </block>
      <block type="text_changeCase">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_trim">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_print">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_prompt_ext">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
    </category>
    <category name="LISTS" colour="%{BKY_LISTS_HUE}">
      <block type="lists_create_with">
        <mutation items="0"></mutation>
      </block>
      <block type="lists_create_with"></block>
      <block type="lists_repeat">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
      </block>
      <block type="lists_length"></block>
      <block type="lists_isEmpty"></block>
      <block type="lists_indexOf">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">{listVariable}</field>
          </block>
        </value>
      </block>
      <block type="lists_getIndex">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">{listVariable}</field>
          </block>
        </value>
      </block>
      <block type="lists_setIndex">
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR">{listVariable}</field>
          </block>
        </value>
      </block>
      <block type="lists_getSublist">
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR">{listVariable}</field>
          </block>
        </value>
      </block>
      <block type="lists_split">
        <value name="DELIM">
          <shadow type="text">
            <field name="TEXT">,</field>
          </shadow>
        </value>
      </block>
      <block type="lists_sort"></block>
    </category>


    <sep></sep>
    <category name="VARIABLES" colour="%{BKY_VARIABLES_HUE}" custom="VARIABLE"></category>
    <category name="FUNCTIONS" colour="%{BKY_PROCEDURES_HUE}" custom="PROCEDURE"></category>
    <sep></sep>

	</xml>
    `
  
//sgkim


exports.amtoolbox =

{
	"kind": "categoryToolbox",
	"contents": [
		{
			"kind": "category",
			"name": "Logic",
			"colour": "%{BKY_LOGIC_HUE}",
			"contents": [
				{
					"kind": "block",
					"type": "controls_if"
				},
				{
					"kind": "block",
					"type": "logic_compare"
				},
				{
					"kind": "block",
					"type": "logic_operation"
				},
				{
					"kind": "block",
					"type": "logic_negate"
				},
				{
					"kind": "block",
					"type": "logic_boolean"
				},
				{
					"kind": "block",
					"type": "logic_ternary"
				}
			]
		},
		{
			"kind": "category",
			"name": "Loops",
			"colour": "%{BKY_LOOPS_HUE}",
			"contents": [
				{
					"kind": "block",
					"type": "controls_repeat_ext",
					"inputs": {
						"TIMES": {
							"shadow": {
								"type": "math_number",
								"fields": {
									"NUM": 10
								}
							}
						}
					}
				},
				{
					"kind": "block",
					"type": "controls_whileUntil"
				},
				{
					"kind": "block",
					"type": "controls_for",
					"inputs": {
						"FROM": {
							"shadow": {
								"type": "math_number",
								"fields": {
									"NUM": 1
								}
							}
						},
						"TO": {
							"shadow": {
								"type": "math_number",
								"fields": {
									"NUM": 10
								}
							}
						},
						"BY": {
							"shadow": {
								"type": "math_number",
								"fields": {
									"NUM": 1
								}
							}
						}
					}
				},
				{
					"kind": "block",
					"type": "controls_forEach"
				},
				{
					"kind": "block",
					"type": "controls_flow_statements"
				}
			]
		},
		{
			"kind": "category",
			"name": "Math",
			"colour": "%{BKY_MATH_HUE}",
			"contents": [
				{
					"kind": "block",
					"type": "math_number",
					"fields": {
						"NUM": 123
					}
				},
				{
					"kind": "block",
					"type": "math_arithmetic"
				},
				{
					"kind": "block",
					"type": "math_single"
				},
				{
					"kind": "block",
					"type": "math_trig"
				},
				{
					"kind": "block",
					"type": "math_constant"
				},
				{
					"kind": "block",
					"type": "math_number_property"
				},
				{
					"kind": "block",
					"type": "math_round"
				},
				{
					"kind": "block",
					"type": "math_modulo"
				},
				{
					"kind": "block",
					"type": "math_constrain",
					"inputs": {
						"LOW": {
							"shadow": {
								"type": "math_number",
								"fields": {
									"NUM": 1
								}
							}
						},
						"HIGH": {
							"shadow": {
								"type": "math_number",
								"fields": {
									"NUM": 100
								}
							}
						}
					}
				},
				{
					"kind": "block",
					"type": "math_random_int",
					"inputs": {
						"FROM": {
							"shadow": {
								"type": "math_number",
								"fields": {
									"NUM": 1
								}
							}
						},
						"TO": {
							"shadow": {
								"type": "math_number",
								"fields": {
									"NUM": 100
								}
							}
						}
					}
				},
				{
					"kind": "block",
					"type": "math_random_float"
				}
			]
		},
		{
			"kind": "category",
			"name": "Text",
			"colour": "%{BKY_TEXTS_HUE}",
			"contents": [
				{
					"kind": "block",
					"type": "text"
				},
				{
					"kind": "block",
					"type": "text_join"
				},
				{
					"kind": "block",
					"type": "text_append",
					"inputs": {
						"TEXT": {
							"shadow": {
								"type": "text"
							}
						}
					}
				},
				{
					"kind": "block",
					"type": "text_length"
				},
				{
					"kind": "block",
					"type": "text_isEmpty"
				},
				{
					"kind": "block",
					"type": "text_indexOf",
					"inputs": {
						"VALUE": {
							"block": {
								"type": "variables_get",
								"fields": {
									"VAR": "text"
								}
							}
						}
					}
				},
				{
					"kind": "block",
					"type": "text_charAt",
					"inputs": {
						"VALUE": {
							"block": {
								"type": "variables_get",
								"fields": {
									"VAR": "text"
								}
							}
						}
					}
				},
				{
					"kind": "block",
					"type": "text_getSubstring"
				},
				{
					"kind": "block",
					"type": "text_changeCase"
				},
				{
					"kind": "block",
					"type": "text_trim"
				},
				{
					"kind": "block",
					"type": "text_print"
				}
			]
		},
		{
			"kind": "category",
			"name": "Variables",
			"custom": "VARIABLE",
			"colour": "%{BKY_VARIABLES_HUE}"
		},
		{
			"kind": "category",
			"name": "Functions",
			"custom": "PROCEDURE",
			"colour": "%{BKY_PROCEDURES_HUE}"
		},
		{
			"kind": "category",
			"name": "Variables",
			"colour": "%{BKY_VARIABLES_HUE}",
			"contents": [
				{
					"kind": "block",
					"type": "variables_get"
				},
				{
					"kind": "block",
					"type": "variables_set"
				}
			]
		}
	]
}




exports.xtoolbox = {


	kind: 'categoryToolbox',
	contents: [
		{
			kind: 'category',
			name: 'Math',
			categorystyle: 'math_category',
			contents: [
				{
					kind: 'block',
					type: 'math_number',
					fields: {
						NUM: 123,
					},
				}],
		},



		{
			kind: 'category',
			name: 'Logic',
			categorystyle: 'logic_category',
			contents: [
				{
					kind: 'block',
					type: 'controls_if',
				},
				{
					kind: 'block',
					type: 'logic_compare',
				},
				{
					kind: 'block',
					type: 'logic_operation',
				},
				{
					kind: 'block',
					type: 'logic_negate',
				},
				{
					kind: 'block',
					type: 'logic_boolean',
				},


			],
		},


		{
			kind: 'category',
			name: 'Loops',
			categorystyle: 'loop_category',
			contents: [
				{
					kind: 'block',
					type: 'controls_repeat_ext',
					inputs: {
						TIMES: {
							shadow: {
								kind: 'block',
								type: 'math_number',
								fields: {
									NUM: 10,
								},
							},
						},
					},
				},
			],
		},


		{
			kind: 'category',
			name: 'Custom',
			categorystyle: 'custom_category',
			contents: [
				{
					kind: 'block',
					type: 'led_on',
				},
				{
					kind: 'block',
					type: 'led_off',
				},
				{
					kind: 'block',
					type: 'delay',
				},


				{
					kind: 'block',
					type: 'while_loop',
				},
				{
					kind: 'block',
					type: 'repeat_n_times',
				},

			],
		},



	],
};
