window.FVFD_STATE = {
  downloadVideo: true,
  recommendVideoUrl: undefined,
};

// 保存原始的 fetch
const originalFetch = window.fetch;
// 重写 fetch 方法
window.fetch = async (...args) => {
  const [url, options = {}] = args;
  
  // 请求拦截
  try {
    console.log('🚀 请求拦截 >', {
      url,
      method: options?.method || 'GET',
      headers: options?.headers,
      body: options?.body
    });

    // 调用原始 fetch
    const response = await originalFetch.apply(window, args);
    
    // 克隆响应以免影响原始响应
    const clonedResponse = response.clone();
    
    // 获取响应类型
    const contentType = response.headers.get('content-type');
    
    // 异步处理响应数据
    if (contentType?.includes('application/json')) {
      // 处理 JSON 响应
      // clonedResponse.json().then(data => {
      //   console.log('📦 JSON响应 >', {
      //     url,
      //     data
      //   });
      //   // 在这里添加你的 JSON 处理逻辑
      // }).catch(console.error);
    } else if (contentType?.includes('video/')) {
      // 处理视频响应
      // console.log('🎥 视频响应 >', {
      //   url,
      //   size: response.headers.get('content-length'),
      //   type: contentType
      // });
      FVFD_STATE.recommendVideoUrl = url;
      // 在这里添加视频处理逻辑
    } else if (contentType?.includes('blob:')) {
      // console.log('💾 Blob响应 >', {
      //   url,
      //   type: contentType
      // });
      // 在这里添加 Blob 处理逻辑
    }

    // 返回原始响应
    return response;
    
  } catch (error) {
    console.error('❌ 请求错误:', error);
    // 发生错误时仍然使用原始fetch
    return originalFetch.apply(window, args);
  }
};

// 建立通信指令
window.addEventListener('message', (event) => {
  console.log('🚀 通信指令 >', event.data);
  const { type, data } = event.data;
  switch (type) {
    case 'FVFD_DOWNLOAD_VIDEO':
      {
        const { fileName } = data;
        try {
          console.log('🚀 下载视频 >');
          console.log(FVFD_STATE.recommendVideoUrl);
          FVFD_UTILS.downloadBlob(`https:${FVFD_STATE.recommendVideoUrl}`);
        } catch (error) {
          console.error('🚨 下载视频失败:', error);
        }
      }
      break;
    default:
      break;
  }
});
