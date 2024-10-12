
require('./css_s/custom-dialog.css');
const Blockly = require('blockly');
const CustomDialog = {};


/** Override Blockly.alert() with custom implementation. */
Blockly.alert = function(message, callback) {
  CustomDialog.show('Alert', message, {
    onCancel: callback
  });
};

/** Override Blockly.confirm() with custom implementation. */
Blockly.confirm = function(message, callback) {
  CustomDialog.show('Confirm', message, {
    showOkay: true,
    onOkay: function() {
      callback(true);
    },
    showCancel: true,
    onCancel: function() {
      callback(false);
    }
  });
};
// 커스텀 다이얼로그로 재정의
Blockly.prompt = function(message, defaultValue, callback) {
    CustomDialog.show('Prompt', message, {
      showInput: true,
      showOkay: true,
      onOkay: function() {
        callback(CustomDialog.inputField.value);
      },
      showCancel: true,
      onCancel: function() {
        callback(null);
      }
    });
    CustomDialog.inputField.value = defaultValue || '';
  };
  
/** Hides any currently visible dialog. */
CustomDialog.hide = function() {
    if (CustomDialog.backdropDiv_) {
      CustomDialog.backdropDiv_.style.display = 'none';
      CustomDialog.dialogDiv_.style.display = 'none';
    }
  };


  CustomDialog.show = function(title, message, options) {
    var backdropDiv = CustomDialog.backdropDiv_;
    var dialogDiv = CustomDialog.dialogDiv_;
    
    if (!dialogDiv) {
      // 배경 오버레이 생성
      backdropDiv = document.createElement('div');
      backdropDiv.id = 'customDialogBackdrop';
      backdropDiv.classList.add('custom-dialog-backdrop');
      document.body.appendChild(backdropDiv);
  
      // 다이얼로그 본체 생성
      dialogDiv = document.createElement('div');
      dialogDiv.id = 'customDialog';
      dialogDiv.classList.add('custom-dialog-container');
      backdropDiv.appendChild(dialogDiv);
  
      // 다이얼로그 내부 클릭 이벤트
      dialogDiv.onclick = function(event) {
        event.stopPropagation();
      };
  
      CustomDialog.backdropDiv_ = backdropDiv;
      CustomDialog.dialogDiv_ = dialogDiv;
    }
  
    // 다이얼로그 표시
    backdropDiv.style.display = 'block';
    dialogDiv.style.display = 'block';
  
    // 다이얼로그 HTML 구조 정의
    dialogDiv.innerHTML =
      `<header class="custom-dialog-title">${title}</header>
       <p class="custom-dialog-message">${message}</p>
       ${options.showInput ? '<div><input id="customDialogInput" class="custom-dialog-input" type="text"></div>' : ''}
       <div class="custom-dialog-buttons">
         ${options.showCancel ? '<button id="customDialogCancel" class="custom-dialog-button custom-dialog-cancel">Cancel</button>' : ''}
         ${options.showOkay ? '<button id="customDialogOkay" class="custom-dialog-button custom-dialog-ok">OK</button>' : ''}
       </div>`;
  
    // 확인 및 취소 버튼 이벤트 핸들러
    var onOkay = function(event) {
      CustomDialog.hide();
      options.onOkay && options.onOkay();
      event && event.stopPropagation();
    };
    
    var onCancel = function(event) {
      CustomDialog.hide();
      options.onCancel && options.onCancel();
      event && event.stopPropagation();
    };
  
    // 입력 필드에 포커스 추가 및 엔터/ESC 키 처리
    var dialogInput = document.getElementById('customDialogInput');
    CustomDialog.inputField = dialogInput;
    
    if (dialogInput) {
      dialogInput.focus();
      dialogInput.onkeyup = function(event) {
        if (event.keyCode === 13) {
          onOkay();
        } else if (event.keyCode === 27) {
          onCancel();
        }
      };
    } else {
      var okayButton = document.getElementById('customDialogOkay');
      if (okayButton) okayButton.focus();
    }
  
    // 확인 및 취소 버튼 클릭 이벤트
    if (options.showOkay) {
      document.getElementById('customDialogOkay').addEventListener('click', onOkay);
    }
    if (options.showCancel) {
      document.getElementById('customDialogCancel').addEventListener('click', onCancel);
    }
  
    // 배경 클릭 시 다이얼로그 닫기
    backdropDiv.onclick = onCancel;
  };

  // Blockly.dialog.setPrompt를 사용하여 사용자 정의 프롬프트 함수 설정
Blockly.dialog.setPrompt(function(message, defaultValue, callback) {
    console.log('Custom setPrompt called with message:', message);
    CustomDialog.show('Prompt', message, {
      showInput: true,
      showOkay: true,
      onOkay: function() {
        callback(CustomDialog.inputField.value);
      },
      showCancel: true,
      onCancel: function() {
        callback(null);
      }
    });
    CustomDialog.inputField.value = defaultValue || '';
});

module.exports = CustomDialog;