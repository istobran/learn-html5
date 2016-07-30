(function() {
  // 检测 sessionStorage 的可用性
  if (!window.sessionStorage) {
    alert("sessionStorage 不可用！");
    return;
  }
  // 监听重置按钮
  document.getElementById("reset_progress").addEventListener("click", function() {
    // sessionStorage.removeItem("progress");
    sessionStorage.progress = 0;
    document.getElementById("hint").innerHTML = "请刷新 10 次本页面来完成测试（可以在不同标签下测试）";
  });
  // 检测 sessionStorage 中的值是否存在
  if (!sessionStorage.progress) {
    sessionStorage.progress = 0;
  } else {
    if (sessionStorage.progress >= 100) {
      document.getElementById("hint").innerHTML = "测试完成！";
      document.getElementById("progress").value = sessionStorage.progress;
    } else {
      sessionStorage.progress = parseInt(sessionStorage.progress) + 10;
      document.getElementById("progress").value = sessionStorage.progress;
      if (sessionStorage.progress >= 100) {
        document.getElementById("hint").innerHTML = "测试完成！";
      }
    }
  }
})();
/*
  sessionStorage 较 localStorage 来说，生命周期更短，仅为一个浏览器会话
  sessionStorage 并不能够跨标签存储，而localStorage可以跨标签
*/
