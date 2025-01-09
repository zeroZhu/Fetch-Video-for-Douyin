// 首页-推荐
function initHomeRecommend() {
  console.log('======== initHomeRecommend start ========');
  const homeRecommendBtn = document.createElement('button');
  homeRecommendBtn.classList.add('home-recommend-btn');
  homeRecommendBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.25 13.25h9m-8.5-6.5l4 3.5l4-3.5m-4-5v8.5"/></svg>';
  homeRecommendBtn.addEventListener('click', () => {
    console.log('======== initHomeRecommend click ========');
  });
  document.querySelector('#root>div').appendChild(homeRecommendBtn);
}

initHomeRecommend();
