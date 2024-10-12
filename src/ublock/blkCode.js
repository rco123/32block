
//const WebSocket = require('ws');

// 비동기 함수 sleep을 정의
exports.delay= (ms)=> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// turnLedOn 함수 내에서 웹소켓 연결을 생성하고 LED 켜기 명령 전송
exports.turnLedOn = () => {
    console.log('Turning on the LED');
    const ws = new WebSocket('ws://192.168.0.25:92/alt_ws');
  
    ws.addEventListener('open', () => {
      console.log('Connected to WebSocket server for LED ON');
      ws.send(JSON.stringify({ action: 'led', state: 'on' }));
    });
  
    ws.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
    });
  
    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed after turning LED ON');
    });
  
    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
  
    // 3초 후에 연결 종료 (메시지 전송 후 안전하게 닫기 위해 지연)
    setTimeout(() => {
      ws.close();
    }, 500);
  };
  
  // turnLedOff 함수 내에서 웹소켓 연결을 생성하고 LED 끄기 명령 전송
  exports.turnLedOff = () => {
    console.log('Turning off the LED');
    const ws = new WebSocket('ws://192.168.0.25:92/alt_ws');
  
    ws.addEventListener('open', () => {
      console.log('Connected to WebSocket server for LED OFF');
      ws.send(JSON.stringify({ action: 'led', state: 'off' }));
    });
  
    ws.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
    });
  
    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed after turning LED OFF');
    });
  
    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
  
    // 3초 후에 연결 종료 (메시지 전송 후 안전하게 닫기 위해 지연)
    setTimeout(() => {
      ws.close();
    }, 500);
  };
  