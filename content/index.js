function init() {
  // 注入函数
  function injectScript(path) {
    const script = document.createElement('script');
    const src = chrome.runtime.getURL(path);
    script.src = src;
    document.documentElement.appendChild(script);
    script.remove();
  }
  // 首页-推荐
  function initHomeRecommend() {
    console.log('======== initHomeRecommend start ========');
    const homeRecommendBtn = document.createElement('button');
    homeRecommendBtn.id = 'home-recommend-btn';
    homeRecommendBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="none" stroke="#f2f2f4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.25 13.25h9m-8.5-6.5l4 3.5l4-3.5m-4-5v8.5"/></svg>';
    homeRecommendBtn.addEventListener('click', () => {
      console.log('======== initHomeRecommend click ========');
      const videoDom = document.querySelector('.page-recommend-container div[data-e2e="feed-active-video"] .xg-video-container');
      console.log(videoDom);
      const videoUrl = videoDom.querySelector('video').src;
      window.postMessage({
        type: 'FVFD_DOWNLOAD_VIDEO',
        data: true
      });
    });
    console.log(document.querySelector('#root'));
    document.querySelector('#root').appendChild(homeRecommendBtn);
  }
  injectScript('/content/utils.js');
  injectScript('/content/inject.js');
  initHomeRecommend();
}

init();