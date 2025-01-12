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