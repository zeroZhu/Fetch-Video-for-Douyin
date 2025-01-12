async function downloadBlob(blobUrl, fileName = 'fetchVideoForDouyin.mp4') {
  try {
    // 获取 blob 资源
    const response = await fetch(blobUrl,{
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Origin": "https://www.douyin.com",
        "Referer": "https://www.douyin.com"
      }
    });
    const blob = await response.blob();
    
    // 创建下载链接
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('下载失败:', error);
  }
}

window.FVFD_UTILS = {
  downloadBlob
}
