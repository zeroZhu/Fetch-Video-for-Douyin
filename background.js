chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'sidePanel',
    title: 'Open side panel',
    contexts: ['all']
  });
  chrome.contextMenus.create({
    parentId: 'sidePanel',
    id: 'sidePanelChild1',
    title: 'sidePanelChild1',
    contexts: ['all']
  });
  chrome.contextMenus.create({
    parentId: 'sidePanel',
    id: 'sidePanelChild2',
    title: 'sidePanelChild2',
    contexts: ['all']
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
