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
