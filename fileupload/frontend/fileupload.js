(function() {
  var box = document.getElementsByClassName("box")[0];
  // box.ondragenter = function(e) {
  //   e.preventDefault();
  // };
  box.ondragover = function(e) {
    e.preventDefault();
  };
  // box.ondragleave = function(e) {
  //   e.preventDefault();
  // };
  box.ondrop = function(e) {
    e.preventDefault();
    // 获取到拖入的文件数组
    var files = e.dataTransfer.files;
    // 建立表单
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append("files[]", file, file.name);
    }
    // 建立异步请求
    var request = new XMLHttpRequest();
    request.open("post", "/backend/upload.php");
    request.send(formData);
  };
})();
