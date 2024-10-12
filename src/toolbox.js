const Blockly = require('blockly');  // Blockly 전체 모듈 가져오기


// 워크스페이스 변경 리스너
function workspaceChangeListener(event) {
    console.log("Event Type: ", event.type);

    if (event.type === Blockly.Events.CLICK) {
        console.log("Block ID: ", event.blockId);
    }
}

exports.initBlockly = () => {
	
    window.blocklyBox = document.getElementById('blocklyBox');

	if (!window.workspace) {
		console.log("Initializing workspace...");
		window.workspace = Blockly.inject(window.blocklyBox, {
			grid: {
				spacing: 25,
				length: 3,
				colour: '#ccc',
				snap: true
			},
			media: './media/',
			toolbox: cstoolbox,

			zoom: {
				controls: true,
				wheel: true
			}
		});

		// 워크스페이스가 성공적으로 초기화되었는지 확인
		if (window.workspace) {
			console.log("Workspace initialized:", window.workspace);
		}
		else {
			console.log("Workspace initialized: null", window.workspace);
		}
		
	}

	// 워크스페이스가 성공적으로 초기화되었는지 확인 후 리스너 등록
	if (window.workspace) {
		console.log('Workspace fully initialized');
		window.workspace.addChangeListener(workspaceChangeListener);
	} else {
		console.error("demoWorkspace is not initialized yet.");
	}
}


cstoolbox = {
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
