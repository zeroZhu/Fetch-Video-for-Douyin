console.log('======== Fetch Video for Douyin start ========');
console.log(document.querySelector('#douyin-right-container'));
console.log('======== Fetch Video for Douyin load ========');

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'response-data') {
    console.log('收到响应数据:', message.data);
    // 在这里处理数据
  }
});
