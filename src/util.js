
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

