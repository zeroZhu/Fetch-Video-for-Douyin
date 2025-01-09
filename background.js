console.log('======== Fetch Video for Douyin background start ========');
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

// chrome.declarativeNetRequest.onRequest.addListener(
//   function (request) {
//     console.log('请求详情:', request);
//   },
//   {
//     urls: ["https://*.douyin.com/*"]
//   }
// );

chrome.webRequest.onCompleted.addListener(
  function (details) {
    console.log('======== webRequest.onCompleted ========');
    console.log(details);
  },
  {
    urls: ["*://*.douyin.com/aweme/v1/web/aweme/listcollection/*"],
    types: ["xmlhttprequest"]
  }
);
console.log('======== Fetch Video for Douyin background end ========');