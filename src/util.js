const Blockly = require('blockly');  // Blockly 전체 모듈 가져오기
const fs = require('fs');
const {saveAs} = require('file-saver')


exports.fx_blk_file_read = () => {
    // 파일 선택 input 생성
    const el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', '.xml');  // 확장자를 .xml로 제한
    el.style.display = 'none';
    document.body.appendChild(el);

    // 파일이 선택되었을 때 처리
    el.onchange = () => {
        const file = el.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const data = event.target.result;

                try {
                    // DOMParser를 사용하여 XML 파싱
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data, "application/xml");

                    // 파싱 에러 확인
                    const parseError = xmlDoc.getElementsByTagName("parsererror");
                    if (parseError.length > 0) {
                        throw new Error('XML 파싱 오류: ' + parseError[0].textContent);
                    }

                    // Blockly workspace에 XML 로드
                    const xmlElement = xmlDoc.documentElement;
                    Blockly.Xml.domToWorkspace(xmlElement, window.workspace);
                    console.log('XML이 성공적으로 workspace에 로드되었습니다.');
                } catch (error) {
                    console.error('XML 파싱 오류:', error);
                } finally {
                    // input element 제거
                    document.body.removeChild(el);
                }
            };

            // 파일을 텍스트로 읽기
            reader.readAsText(file);
        } else {
            console.log('파일이 선택되지 않았습니다.');
            document.body.removeChild(el);
        }
    };

    // 파일 선택창 열기
    el.click();
};



// 블록 초기화 함수
exports.fx_blk_clear = () => {
	console.log("clear workspace blocks")
	window.workspace.clear();
};


// 파일로 블록 저장 함수
exports.fx_blk_file_save = () => {
    
	
	const xmlDom = Blockly.Xml.workspaceToDom(window.workspace);
    const xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    console.log('func_fblk_save()');

    const blob = new Blob([xmlText], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "block.xml");
};



exports.showAlert = (message, duration) => {
	const alertBox = document.getElementById('customAlert');
	alertBox.textContent = message;
	alertBox.classList.add('show');

	// 일정 시간 후에 알림 숨기기
	setTimeout(() => {
		alertBox.classList.remove('show');
	}, duration);
}

exports.changeIp = () => {
	console.log("run ip changeIp")

	ipModal.open();
	// const newIp = prompt("Enter new IP address:", "192.168.0.25");
	// if (newIp) {
	//     document.getElementById("ip_add_str").textContent = newIp;
	// }

}



const ipModal = {
	modalElement: null,

	create() {
		this.modalElement = document.createElement('div');
		this.modalElement.style.display = 'none';
		this.modalElement.style.position = 'fixed';
		this.modalElement.style.top = '50%';
		this.modalElement.style.left = '50%';
		this.modalElement.style.transform = 'translate(-50%, -50%)';
		this.modalElement.style.background = 'white';
		this.modalElement.style.padding = '20px';
		this.modalElement.style.border = '1px solid #ccc';
		this.modalElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

		this.modalElement.innerHTML = `
          <h3>Enter new IP address</h3>
          <input type="text" id="newIpInput" placeholder="192.168.0.25" style="margin-bottom: 10px; width: 100%;">
          <button id="setIpButton">Set IP</button>
          <button id="cancelButton">Cancel</button>
      `;

		document.body.appendChild(this.modalElement);

		// 버튼에 이벤트 리스너 추가
		document.getElementById('setIpButton').addEventListener('click', () => this.setIp());
		document.getElementById('cancelButton').addEventListener('click', () => this.close());
	},

	// 모달 열기
	open() {
		if (!this.modalElement) {
			this.create();
		}

		// 저장된 IP 주소 불러오기
		const savedIp = localStorage.getItem('savedIp') || '192.168.0.25';
		document.getElementById('newIpInput').value = savedIp;

		this.modalElement.style.display = 'block';

		// 입력창에 자동 포커스 설정
		document.getElementById('newIpInput').focus();
	},


	close() {
		if (this.modalElement) {
			this.modalElement.style.display = 'none';
		}
	},

	// IP 설정 및 저장
    setIp() {
        const newIp = document.getElementById('newIpInput').value;
        if (newIp) {
            document.getElementById('ip_add_str').textContent = newIp;

            // IP 주소를 로컬 스토리지에 저장
            localStorage.setItem('savedIp', newIp);
        }
        this.close();
    },

	destroy() {
		if (this.modalElement) {
			document.body.removeChild(this.modalElement);
			this.modalElement = null;
		}
	}
};





// 버튼을 클릭하면 모달 열기
function openModal() {
	ipModal.open();
}

