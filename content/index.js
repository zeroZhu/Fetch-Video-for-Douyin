// import { downloadBlob } from './utils';
window.windowFlag = "zhusiyuan"
async function downloadBlob(blobUrl, fileName) {
  try {
    // 获取 blob 资源
    // const response = await fetch(blobUrl,{
    //   headers: {
    //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    //     "Origin": "https://www.douyin.com",
    //     "Referer": "https://www.douyin.com"
    //   }
    // });
    // const blob = await response.blob();
    // 创建下载链接
    // const downloadUrl = window.URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = blobUrl;
    // link.download = fileName || 'download.mp4'; // 设置文件名
    // 触发下载
    // document.body.appendChild(link);
    // link.click();
    // 清理
    // document.body.removeChild(link);
    // window.URL.revokeObjectURL(downloadUrl);
    console.log(window);
    window.fetch = (...args) => {
      console.log("=========fetch =============");
      console.log('fetch args', ...args);
    };
  } catch (error) {
    console.error('下载失败:', error);
  }
}
// 首页-推荐
function initHomeRecommend() {
  console.log('======== initHomeRecommend start ========');
  const homeRecommendBtn = document.createElement('button');
  homeRecommendBtn.id = 'home-recommend-btn';
  homeRecommendBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.25 13.25h9m-8.5-6.5l4 3.5l4-3.5m-4-5v8.5"/></svg>';
  homeRecommendBtn.addEventListener('click', () => {
    console.log('======== initHomeRecommend click ========');
    const videoDom = document.querySelector('.page-recommend-container div[data-e2e="feed-active-video"] .xg-video-container');
    console.log(videoDom);
    const videoUrl = videoDom.querySelector('video').src;
    console.log(videoUrl);
    downloadBlob(videoUrl);
  });
  document.querySelector('#root>div').appendChild(homeRecommendBtn);
}

initHomeRecommend();
