(function() {
  let showTipErrorSwal = function(err) {
      showSwal(err, { icon: 'error' });
  }

  const divTips = document.createElement('div');
  divTips.id = "divTips";

  let showSwal = function(content, option) {
      divTips.innerHTML = content;
      option.content = divTips;
      if (!option.hasOwnProperty('button')) {
          option.button = '我知道了'
      }
      swal(option);
  }

  let headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "Origin": "https://www.douyin.com",
      "Referer": "https://www.douyin.com"
  }

  let isDouyinPage = function() {
      let url = location.href;
      if (url.indexOf(".douyin.com/") != -1) {
          return true;
      } else {
          return false;
      }
  };

  let getVideoUrl = function() {
      let RENDER_DATA = document.getElementById("RENDER_DATA");
      if (RENDER_DATA == null) {
          return "";
      }
      let RENDER_DATA_STR = RENDER_DATA.textContent;
      renderData = decodeURIComponent(RENDER_DATA_STR);
      let jsonObject = JSON.parse(renderData);
      let data = null;
      for (let key in jsonObject) {
          if ("_location" == key || "app" == key || "11" == key) {
              continue;
          }
          data = key;
      }
      let dataJo = jsonObject[data];
      let detail = dataJo["videoDetail"];
      let video = detail["video"];
      let playAddr = video["playAddr"];
      let video1 = playAddr[0];
      let src = video1["src"];
      let videoUrl = "https:" + src;
      videoUrl = videoUrl.substring(0, videoUrl.length - 1);
      return videoUrl;
  }

  var isDownVideo = false;

  let successCall = function(videoUrl, videoName) {
      if (videoUrl == null) {
          videoUrl = getVideoUrl();
      }
      if (!isDownVideo) {
          GM_download({ url: videoUrl, name: videoName + '.mp4', headers: headers});
          isDownVideo = true;
      }
  }

  let initButtonEvent = function(btn) {
      if (isDouyinPage()) {
          var isClickDownVideo = true;
          let videoType = Number.parseInt(btn.getAttribute("type"));
          if(videoType == 1) {
              videoDownloadNum = 0;
              let videoIndex = btn.getAttribute("videoIndex");
              let videoSlide = document.getElementById("slidelist");
              let videoClassArr = videoSlide.firstChild.firstChild;
              //推荐~朋友
              let videoArr = videoClassArr.getElementsByClassName("page-recommend-container");
              if(videoArr.length == 0) {
                  //首页
                  videoArr = videoClassArr.getElementsByClassName("dySwiperSlide");
              }
              let videoItemDiv = videoArr[videoIndex];
  
              let account = videoItemDiv.getElementsByClassName("account-name")[0].textContent;
              let accountNameSpanNode = videoItemDiv.getElementsByClassName("title")[0].childNodes[0];
              let title = accountNameSpanNode.firstElementChild.lastElementChild.textContent;
              let videoName = account + "-" + title;
              if(videoName == "") {
                videoName = "无标题视频";
              }
  
              let sliderVideoDiv = videoItemDiv.getElementsByClassName("slider-video");
              let xgVideoContainerDiv = sliderVideoDiv[0].getElementsByClassName("xg-video-container");
              let videoNode = xgVideoContainerDiv[0].getElementsByTagName("video");
              let videoSrc = videoNode[0].getAttribute("src");
              if(videoSrc != null) {
                  // showTipErrorSwal("暂不支持该视频下载，正在加紧适配中...");
                  const originFetch = fetch;
                  unsafeWindow.fetch = (...arg) => {
                      // console.log('fetch arg', ...arg);
                      if (arg[0].indexOf('douyin') > -1 && isClickDownVideo) {
                          let videoUrl =  decodeURI('https:' + arg[0]);
                          GM_xmlhttpRequest(headRequest(videoUrl, videoName, successCall));
                          if(successCall) {
                              isClickDownVideo = false;
                          }
                      }
                  }

              }else{
                let sourceNodes = videoNode[0].getElementsByTagName("source");
                for (let i = 0; i < sourceNodes.length; i++) {
                    try {
                        let videoUrl = decodeURI('https:' + sourceNodes[i].getAttribute("src"));
                        GM_xmlhttpRequest(headRequest(videoUrl, videoName, successCall));
                        if(successCall) {
                          isDownVideo = false;
                          break;
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
              }
          }else if(videoType == 2) {
              let videoClassArr = document.getElementsByClassName("playerControlHeight");
              let videoInfoArr = videoClassArr[0].getElementsByClassName("leftContainer");
              let videoNameArr = videoInfoArr[0].childNodes[2].firstElementChild.getElementsByTagName("h1");
              let title = videoNameArr[0].textContent;
              let userDiv = videoClassArr[0].childNodes[1].firstElementChild;
              let accountNameArr = userDiv.childNodes[0].childNodes[1].getElementsByTagName("a")[0].getElementsByTagName("span")[0];
              let account = accountNameArr.textContent;
              // let titleArr = userDiv.childNodes[1].getElementsByTagName("span")[0];
              // let title = titleArr.textContent;
              let videoName = account + "-" + title;
              if(videoName == "") {
                videoName = "无标题视频";
              }
              let videoArr = videoClassArr[0].getElementsByClassName("xg-video-container");
              let videoNode = videoArr[0].getElementsByTagName("video");
              let sourceNodes = videoNode[0].getElementsByTagName("source");
                for (let i = 0; i < sourceNodes.length; i++) {
                    try {
                        let videoUrl = decodeURI('https:' + sourceNodes[i].getAttribute("src"));
                        GM_xmlhttpRequest(headRequest(videoUrl, videoName, successCall));
                        if(successCall) {
                          isDownVideo = false;
                          break;
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
          }else if(videoType == 3) {
              let videoDiv= document.getElementById("slideMode");
              let account = videoDiv.getElementsByClassName("account-name")[0].textContent;
              let accountNameSpanNode = videoDiv.getElementsByClassName("title")[0].childNodes[0];
              let title = accountNameSpanNode.firstElementChild.lastElementChild.textContent;
              let videoName = account + "-"  + title;
              if(videoName == "") {
                videoName = "无标题视频";
              }
              let xgVideoContainerDiv = videoDiv.getElementsByClassName('xg-video-container');
              let videoNode = xgVideoContainerDiv[0].getElementsByTagName("video");
              let videoSrc = videoNode[0].getAttribute("src");
              if(videoSrc != null) {
                  // showTipErrorSwal("暂不支持该视频下载，正在加紧适配中...");
                  const originFetch = fetch;
                  unsafeWindow.fetch = (...arg) => {
                      // console.log('fetch arg', ...arg);
                      if (arg[0].indexOf('douyin') > -1 && isClickDownVideo) {
                          let videoUrl =  decodeURI('https:' + arg[0]);
                          GM_xmlhttpRequest(headRequest(videoUrl, videoName, successCall));
                          if(successCall) {
                              isClickDownVideo = false;
                          }
                      }
                  }
              }else{
                let sourceNodes = videoNode[0].getElementsByTagName("source");
                for (let i = 0; i < sourceNodes.length; i++) {
                    try {
                        let videoUrl = decodeURI('https:' + sourceNodes[i].getAttribute("src"));
                        GM_xmlhttpRequest(headRequest(videoUrl, videoName, successCall));
                        if(successCall) {
                          isDownVideo = false;
                          break;
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
              }
          }
      }
  };

  let headRequest = function(url, videoName, call) {
      let userAgent = navigator.userAgent;
      let method = "HEAD";
      if(userAgent.indexOf("Firefox") != -1) {
          method = "GET";
      }
      return {
          method: method,
          timeout: 300000, // 30秒超时
          headers: headers,
          url: url,
          onload: function(res) {
              if (res.status === 200 || res.status === 401) {
                  call(url, videoName);
              }else if(res.status === 302) {
                  let Location = res.headers.getAttribute("Location");
                  call(Location, videoName);
              }else if(res.status === 403) {
                  showTipErrorSwal("浏览器不支持该视频");
              } else {
                  console.error(res);
              }
          },
          ontimeout: (res) => {
              console.error(res);
          },
          onerror: (res) => {
              console.error(res);
          }
      }
  };

  let start = function() {
      if (!isDouyinPage()) {
          // console.log('非抖音页面，1秒后将重新查找！');
          return;
      }

      if(document.body.innerHTML == "") {
          return;
      }
      let isIndexVideo = getIndexVideo();
      if(!isIndexVideo) {
          if(!getIndexDetailVideo()) {
              getDetailVideo();
          }
      }
  }

  /**
   * 首页/推荐/我的
   * @returns 
   */
  function getIndexVideo() {
      let videoSlide = document.getElementById("slidelist");
      if(videoSlide == null) {
          // console.log('未查找到视频列表div！');
          return false;
      }
      let videoClassArr = videoSlide.firstChild.firstChild;
      if(videoClassArr.length == 0) {
          // console.log('未查找到视频div！');
          return false;
      }

      //推荐~朋友
      let videoArr = videoClassArr.getElementsByClassName("page-recommend-container");
      if(videoArr.length == 0) {
          //首页
          videoArr = videoClassArr.getElementsByClassName("dySwiperSlide");
      }
      if(videoArr.length == 0) {
          // console.log('未查找到视频div列表');
          return false;
      }

      //偏移量
      let shiftingDiv = videoSlide.getElementsByClassName("fullscreen_capture_feedback");
      let height = shiftingDiv[0].style.height;
      let shifting = 0;
      if(height != "100%") {
        shifting = height.match(/calc\(\d+%\s*-\s*(\d+)px\)/i)[1];
      }
      //每个视频的高度
      let firstVideoDiv = videoArr[0];
      let firstVideoHeight = firstVideoDiv.style.height;
      firstVideoHeight = firstVideoHeight.replace("px", "");
      let videoTransForm= videoClassArr.style.transform || '';
      //视频下标
      var videoIndex = 0;
      let videoTransFormarr = videoTransForm.match(/translate3d\(\d+px,\s*(-+\d+)px,\s*(\d+)px\)/i);
      if(videoTransFormarr != null) {
        let videoTransFormY = videoTransFormarr[1];
        videoTransFormY = -videoTransFormY;
        videoIndex = videoTransFormY/(parseInt(firstVideoHeight) + parseInt(shifting));
      }

      let btnBox = videoArr[videoIndex].getElementsByClassName('positionBox');
      if(btnBox.length == 0) {
          // console.log('可能为直播页面或登录弹出页面');
          return false;
      }
      if(btnBox[0].childNodes.length > 1) {
          var btnShare = btnBox[0].childNodes[1];
      }else{
          var btnShare = btnBox[0].childNodes[0];
      }
      if(btnShare == undefined) {
          // console.log('可能还未初始化分享按钮');
          return false;
      }
  
      let btnDownload = {
          class: 'btnClickDownload',
          title: '点击下载视频',
          html: function() {
              return `<img height="26" width="26" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAB10lEQVRYhe2Yv0sCYRjHnyuVoyIC/4CwH1OrKbdJDQ4hDi0NbTU0RuIPKKvBKE2loUHQ/0FRF3WsqDOoCF1UcIqWCvP0NC69hlI0Ss97LxR6P9sdPN/nw3vDPe8DMOAQUoTojy75n97HbBRyvgw1oIFvQ9v2vOGjJckdkiTlD8GCqGBBVLAgKlgQFSyIChZEBQuiggVRETRR6w+vTEDw7l7Df7sKAADwBOzErdRBtwzBd4alY9o6RsrstuW50YkRhdCyNoosB85gqlxk391Rs3ZfSM2w0PBsInAxubhev848UepZpYKUCy5tk2PKNU/UIkyuJ0EAgGzcfy5Gsshy4AylS0y55o1YNHu99OztGL4kVQvrfDL3RKlnlPJukkyFA1coxZZEyIkSBADIJPznU7o1SOaeO0oyFQ6cwRTLsDVv2KzZFdNLlOCnZOBMpVuDZO6Fmp9WyklFexRT4cAVTLNMteYNmzR2sX2QMXro7ZXTm/LdwxufL9T5fKHO3z++8au+25LBQzv6JtZKq6TUcpLsZgAADB7aMU7KNwkCiNcqdxLZ0m5LlS0ZRjd9YHTTXf8OGEwLBEDnqaOfxGwU0Ry3vi8g+01jATrwA+vACzY/sVQ75X/HB6W6vNjikAp7AAAAAElFTkSuQmCC"/>`;
          }
      }
      //如果是已有下载按钮，则不添加
      let buttonArr = btnShare.getElementsByClassName(btnDownload.class);
      if (buttonArr.length != 0) {
          return false;
      }

      let btn = document.createElement('a');
      btn.setAttribute("type", 1);
      btn.setAttribute("class", btnDownload.class);
      btn.setAttribute("videoIndex", videoIndex);
      btn.title = btnDownload.title;
      btn.innerHTML = btnDownload.html();
      btn.addEventListener('click', function(e) {
          initButtonEvent(btn);
          e.preventDefault();
      });

      btnShare.appendChild(btn);
      return true;
  }

  /**
   * 首页/推荐/我的-详情
   * @returns 
   */
  function getIndexDetailVideo() {
      let videoDiv= document.getElementById("slideMode");
      if(videoDiv == null) {
          // console.log('未查找到视频div！');
          return false;
      }
      let positionBoxDiv = videoDiv.getElementsByClassName("positionBox");
      let btnShare = positionBoxDiv[0].childNodes[1];
      if(btnShare == undefined) {
          // console.log('可能还未初始化分享按钮');
          return false;
      }
  
      let btnDownload = {
          class: 'btnClickDownload',
          title: '点击下载视频',
          html: function() {
              return `<img height="26" width="26" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAB10lEQVRYhe2Yv0sCYRjHnyuVoyIC/4CwH1OrKbdJDQ4hDi0NbTU0RuIPKKvBKE2loUHQ/0FRF3WsqDOoCF1UcIqWCvP0NC69hlI0Ss97LxR6P9sdPN/nw3vDPe8DMOAQUoTojy75n97HbBRyvgw1oIFvQ9v2vOGjJckdkiTlD8GCqGBBVLAgKlgQFSyIChZEBQuiggVRETRR6w+vTEDw7l7Df7sKAADwBOzErdRBtwzBd4alY9o6RsrstuW50YkRhdCyNoosB85gqlxk391Rs3ZfSM2w0PBsInAxubhev848UepZpYKUCy5tk2PKNU/UIkyuJ0EAgGzcfy5Gsshy4AylS0y55o1YNHu99OztGL4kVQvrfDL3RKlnlPJukkyFA1coxZZEyIkSBADIJPznU7o1SOaeO0oyFQ6cwRTLsDVv2KzZFdNLlOCnZOBMpVuDZO6Fmp9WyklFexRT4cAVTLNMteYNmzR2sX2QMXro7ZXTm/LdwxufL9T5fKHO3z++8au+25LBQzv6JtZKq6TUcpLsZgAADB7aMU7KNwkCiNcqdxLZ0m5LlS0ZRjd9YHTTXf8OGEwLBEDnqaOfxGwU0Ry3vi8g+01jATrwA+vACzY/sVQ75X/HB6W6vNjikAp7AAAAAElFTkSuQmCC"/>`;
          }
      }
      //如果是已有下载按钮，则不添加
      let buttonArr = btnShare.getElementsByClassName(btnDownload.class);
      if (buttonArr.length != 0) {
          return false;
      }

      let btn = document.createElement('a');
      btn.setAttribute("type", 3);
      btn.setAttribute("class", btnDownload.class);
      btn.title = btnDownload.title;
      btn.innerHTML = btnDownload.html();
      btn.addEventListener('click', function(e) {
          initButtonEvent(btn);
          e.preventDefault();
      });

      btnShare.appendChild(btn);
      return true;
  }

  /**
   * 进入详情页详情
   * @returns 
   */
  function getDetailVideo() {
      let videoClassArr = document.getElementsByClassName("playerControlHeight");
      if(videoClassArr.length == 0) {
          // console.log('未查找到视频总div！');
          return false;
      }
      let videoDiv = videoClassArr[0];

      //详情
      let  videoArr = videoDiv.getElementsByClassName("xg-video-container");
      if(videoArr.length == 0) {
          // console.log('未查找到视频div');
          return false;
      }

      let btnGrid = videoDiv.getElementsByClassName('xg-right-grid');

      let btnDownload = {
          class: 'btnClickDownload',
          title: '点击下载视频',
          html: function() {
              return `<img height="22" width="22" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAB10lEQVRYhe2Yv0sCYRjHnyuVoyIC/4CwH1OrKbdJDQ4hDi0NbTU0RuIPKKvBKE2loUHQ/0FRF3WsqDOoCF1UcIqWCvP0NC69hlI0Ss97LxR6P9sdPN/nw3vDPe8DMOAQUoTojy75n97HbBRyvgw1oIFvQ9v2vOGjJckdkiTlD8GCqGBBVLAgKlgQFSyIChZEBQuiggVRETRR6w+vTEDw7l7Df7sKAADwBOzErdRBtwzBd4alY9o6RsrstuW50YkRhdCyNoosB85gqlxk391Rs3ZfSM2w0PBsInAxubhev848UepZpYKUCy5tk2PKNU/UIkyuJ0EAgGzcfy5Gsshy4AylS0y55o1YNHu99OztGL4kVQvrfDL3RKlnlPJukkyFA1coxZZEyIkSBADIJPznU7o1SOaeO0oyFQ6cwRTLsDVv2KzZFdNLlOCnZOBMpVuDZO6Fmp9WyklFexRT4cAVTLNMteYNmzR2sX2QMXro7ZXTm/LdwxufL9T5fKHO3z++8au+25LBQzv6JtZKq6TUcpLsZgAADB7aMU7KNwkCiNcqdxLZ0m5LlS0ZRjd9YHTTXf8OGEwLBEDnqaOfxGwU0Ry3vi8g+01jATrwA+vACzY/sVQ75X/HB6W6vNjikAp7AAAAAElFTkSuQmCC"/>`;
          }
      }
      //如果是已有下载按钮，则不添加
      let buttonArr = btnGrid[0].getElementsByClassName(btnDownload.class);
      if (buttonArr.length != 0) {
          return false;
      }

      let btn = document.createElement('a');
      btn.setAttribute("type", 2);
      btn.setAttribute("class", btnDownload.class);
      btn.title = btnDownload.title;
      btn.innerHTML = btnDownload.html();
      btn.addEventListener('click', function(e) {
          initButtonEvent(btn);
          e.preventDefault();
      });

      btnGrid[0].appendChild(btn);
      return true;
  }

  setInterval(function() {
      start();
  }, 1000)
})();