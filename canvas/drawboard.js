(function(window) {
  // 初始化canvas
  var mycanvas = document.querySelector("#board");      // 使用Selector API
  mycanvas.style.backgroundColor = "#777";
  // 定义canvas自适应窗口大小函数
  var cvresize = function() {
    mycanvas.width = window.innerWidth;
    mycanvas.height = window.innerHeight;
  }

  // 添加浏览器窗口事件监听
  window.addEventListener("resize", cvresize);
  // 获得画笔
  var pen = mycanvas.getContext("2d");
  // 定义取色区
  var protectAreaWidth = 200,
      protectAreaHeight = 140;
  var penblock = [], bgblock = [];
  var penColor = "white", bgColor = "#777";
  (function() {
    var i;
    for (i = 0; i < 6; i++) {   // 初始化画笔取色区
      penblock.push({
        startX: 10+30*i,
        startY: 30,
        endX: 10+30*i+25,
        endY: 30+25,
        size: 25
      });
    }
    for (i = 0; i < 6; i++) {   // 初始化背景取色区
      bgblock.push({
        startX: 10+30*i,
        startY: 95,
        endX: 10+30*i+25,
        endY: 95+25,
        size: 25
      });
    }
  })();
  // 定义初始化函数
  var init = function() {
    // 这些 fillStyle 的值均为 '橙色'
    // ctx.fillStyle = "orange";
    // ctx.fillStyle = "#FFA500";
    // ctx.fillStyle = "rgb(255,165,0)";
    // ctx.fillStyle = "rgba(255,165,0,1)";

    // 调整canvas大小
    cvresize();
    // 绘制取色区背景色
    pen.fillStyle = "#666";
    pen.fillRect(0, 0, protectAreaWidth, protectAreaHeight);
    // 绘制画笔取色块
    pen.fillStyle = "#FFFFFF";
    pen.font = "18px serif";
    pen.fillText("pen color", 10, 20);
    pen.fillStyle = "#FF0000";
    pen.fillRect(penblock[0].startX, penblock[0].startY, penblock[0].size, penblock[0].size);
    pen.fillStyle = "#FFFF00";
    pen.fillRect(penblock[1].startX, penblock[1].startY, penblock[1].size, penblock[1].size);
    pen.fillStyle = "#00FF00";
    pen.fillRect(penblock[2].startX, penblock[2].startY, penblock[2].size, penblock[2].size);
    pen.fillStyle = "#00FFFF";
    pen.fillRect(penblock[3].startX, penblock[3].startY, penblock[3].size, penblock[3].size);
    pen.fillStyle = "#0000FF";
    pen.fillRect(penblock[4].startX, penblock[4].startY, penblock[4].size, penblock[4].size);
    pen.fillStyle = "#FFFFFF";
    pen.fillRect(penblock[5].startX, penblock[5].startY, penblock[5].size, penblock[5].size);
    // 绘制背景取色块
    pen.fillStyle = "#FFFFFF";
    pen.font = "18px serif";
    pen.fillText("background color", 10, 85);
    pen.fillStyle = "#777";
    pen.fillRect(bgblock[0].startX, bgblock[0].startY, bgblock[0].size, bgblock[0].size);
    pen.fillStyle = "#888";
    pen.fillRect(bgblock[1].startX, bgblock[1].startY, bgblock[1].size, bgblock[1].size);
    pen.fillStyle = "#999";
    pen.fillRect(bgblock[2].startX, bgblock[2].startY, bgblock[2].size, bgblock[2].size);
    pen.fillStyle = "#AAA";
    pen.fillRect(bgblock[3].startX, bgblock[3].startY, bgblock[3].size, bgblock[3].size);
    pen.fillStyle = "#BBB";
    pen.fillRect(bgblock[4].startX, bgblock[4].startY, bgblock[4].size, bgblock[4].size);
    pen.fillStyle = "#CCC";
    pen.fillRect(bgblock[5].startX, bgblock[5].startY, bgblock[5].size, bgblock[5].size);
  }
  init();
  // 监听绘制线条
  mycanvas.onmousedown = function(e) {
    pen.strokeStyle = penColor;
    pen.beginPath();
    pen.moveTo(e.clientX, e.clientY);
    mycanvas.onmousemove = function(e) {
      if (e.clientX <= protectAreaWidth && e.clientY <= protectAreaHeight) {
        this.onmousemove = null;
      }
      pen.lineTo(e.clientX, e.clientY);
      pen.stroke();
      mycanvas.onmouseup = function(e) {
        this.onmousemove = null;      // 取消移动事件的监听
        pen.closePath();
      }
    }
  }
  // 监听修改颜色
  mycanvas.onclick = function(e) {
    // 找到点击位置
    var signal = "none";
    if (e.clientY >= penblock[0].startY && e.clientY <= penblock[0].endY) {
      for (var i = 0; i < penblock.length; i++) {
        if (e.clientX >= penblock[i].startX && e.clientX <= penblock[i].endX) {
          var seletedindex = i;
          signal = "penColor";
          break;
        }
      }
    } else if (e.clientY >= bgblock[0].startY && e.clientY <= bgblock[0].endY) {
      for (var i = 0; i < bgblock.length; i++) {
        if (e.clientX >= bgblock[i].startX && e.clientX <= bgblock[i].endX) {
          var seletedindex = i;
          signal = "bgColor";
          break;
        }
      }
    }
    // 处理结果
    if ("penColor" === signal) {
      switch (seletedindex) {
        case 0: penColor = "#FF0000"; break;
        case 1: penColor = "#FFFF00"; break;
        case 2: penColor = "#00FF00"; break;
        case 3: penColor = "#00FFFF"; break;
        case 4: penColor = "#0000FF"; break;
        case 5: penColor = "#FFFFFF"; break;
      }
    } else if ("bgColor" === signal) {
      switch (seletedindex) {
        case 0: mycanvas.style.backgroundColor = "#777"; break;
        case 1: mycanvas.style.backgroundColor = "#888"; break;
        case 2: mycanvas.style.backgroundColor = "#999"; break;
        case 3: mycanvas.style.backgroundColor = "#AAA"; break;
        case 4: mycanvas.style.backgroundColor = "#BBB"; break;
        case 5: mycanvas.style.backgroundColor = "#CCC"; break;
      }
    }
  }
})(window);
