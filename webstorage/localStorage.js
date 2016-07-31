(function() {
  // 检测localStorage的可用性
  if (!window.localStorage) {
    alert("your browser is not support localStorage");
    return;
  }

  var myform = document.myform;
  // 检测本地数据
  if (localStorage.receiver) {   // 检测本地是否有收件人缓存
    myform.receiver.value = localStorage.receiver;
  }
  if (localStorage.copy_recv) {   // 检测本地是否有抄送缓存
    myform.copy_recv.value = localStorage.copy_recv;
  }
  if (localStorage.title) {   // 检测本地是否有标题缓存
    myform.title.value = localStorage.title;
  }
  if (localStorage.content) {   // 检测本地是否有内容缓存
    myform.content.value = localStorage.content;
  }

  // 使用事件代理监听表单变化
  myform.addEventListener("change", function(e) {
    if (e.target.type && e.target.type === "text") {
      localStorage.setItem(e.target.name, e.target.value);
    } else if (e.target.name === "content") {
      // 直接使用 expando 式赋值
      localStorage[e.target.name] = e.target.value;
    }
  });

  // 监听表单的提交动作
  myform.addEventListener("submit", function(e) {
    localStorage.clear();
  });
  // 监听表单的重置动作
  myform.addEventListener("reset", function(e) {
    localStorage.clear();
  });
})();
/*
  在webStorage出现以前，使用Cookie来在客户端存储数据
  Cookie 的存储大小限制为 4K，而且安全性设计不合理
  cookie 在每次访问页面时，都会作为http请求头，与http请求一并提交
  webStorage 的安全性设计相对来说得到了提升
  localStorage 与 sessionStorage 都是本地存储，访问页面时不会与http请求一起提交
  webStorage 的存储大小限制一般为 5M
  localStorage 的生命周期是永久的，只要不被清除，就会一直保存在本地
  sessionStorage 的生命周期是一次浏览器会话，会话结束后会自动销毁
  对于 globalStorage ，事实上是FireFox下早期的本地存储解决方案
  现在官方已经明确声明弃用 globalStorage，而使用 localStorage 进行取代
*/
