console.log('======== Fetch Video for Douyin background start ========');

// 存储 debugger 连接的标记
letdebuggerAttached = false;

// 初始化 debugger
chrome.debugger.onDetach.addListener((source) => {
  debuggerAttached = false;
});

// 监听网络请求
chrome.webRequest.onBeforeRequest.addListener(
  async function(details) {
    // 如果还没有附加 debugger
    if (!debuggerAttached) {
      try {
        // 附加 debugger 到当前标签页
        await chrome.debugger.attach({ tabId: details.tabId }, "1.0");
        debuggerAttached = true;
        
        // 启用网络跟踪
        await chrome.debugger.sendCommand(
          { tabId: details.tabId },
          "Network.enable"
        );
      } catch (err) {
        console.error("Debugger attach failed:", err);
      }
    }
  },
  { urls: ["<all_urls>"] }
);

// 监听响应数据
chrome.debugger.onEvent.addListener((source, method, params) => {
  if (method === "Network.responseReceived") {
    const requestId = params.requestId;
    
    // 获取响应体
    chrome.debugger.sendCommand(
      { tabId: source.tabId },
      "Network.getResponseBody",
      { requestId: requestId },
      (response) => {
        if (response && response.body) {
          console.log("Response body:", response.body);
          // 在这里处理响应内容
          // 可以发送消息给 content script
          chrome.tabs.sendMessage(source.tabId, {
            type: 'response-data',
            data: response.body
          });
        }
      }
    );
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'sidePanel',
    title: 'Open side panel',
  });
  chrome.contextMenus.create({
    parentId: 'sidePanel',
    id: 'sidePanelChild1',
    title: 'sidePanelChild1',
  });
  chrome.contextMenus.create({
    parentId: 'sidePanel',
    id: 'sidePanelChild2',
    title: 'sidePanelChild2',
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'openSidePanel':
      chrome.sidePanel.open({ windowId: tab.windowId });
      break;
    default:
  }
});

chrome.webRequest.onCompleted.addListener(
  function (...args) {
    console.log('======== webRequest.onCompleted ========');
    console.log(args);
  },
  {
    urls: ["*://*.douyin.com/aweme/v1/web/aweme/listcollection/*"]
  }
);
console.log('======== Fetch Video for Douyin background end ========');