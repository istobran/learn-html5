(function(window) {
  //先检查是否在服务器环境下
  if (window.location) {
    if (location.protocol.indexOf("file") > -1) {
      document.getElementById("alertinfo").style.display = "block";
      return;
    }
  }

  // 检查是否支持 geolocation
  if ("geolocation" in window.navigator) {
    /* geolocation is available */
    var geo = window.navigator.geolocation;

    // 定义配置信息
    var options = {
      enableHighAccuracy : true,    // 开启高精度模式
      timeout : 5000,
      maximumAge : 0      // 位置缓存周期
    };
    // 定义成功时的动作
    var success = function(pos) {
      var crd = pos.coords;   //获得当前坐标

      console.log('Your current position is:');
      console.log('Latitude : ' + crd.latitude);    // 纬度
      console.log('Longitude: ' + crd.longitude);   // 经度
      console.log('More or less ' + crd.accuracy + ' meters.');   //精度

      // 百度地图API功能
      var map = new BMap.Map("baidumap");    // 创建Map实例
      var curpos = new BMap.Point(crd.longitude, crd.latitude)
      map.centerAndZoom(curpos, 15);  // 初始化地图,设置中心点坐标和地图级别
      map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      new BMap.LocalCity().get(function(result) {
        map.setCurrentCity(result.name);          // 设置地图显示的城市 此项是必须设置的
      });
      var marker = new BMap.Marker(curpos);     // 在地图上标注获取到的位置
      map.addOverlay(marker);
    };
    // 定义失败时的动作
    var error = function(err) {
      console.log("ERROR("+err.code+"): "+err.message);
    };

    // navigator.geolocation.getCurrentPosition(success[, error[, options]])
    // 使用 getCurrentPosition 获取一次当前坐标
    geo.getCurrentPosition(success, error, options);

  } else {
    /* geolocation IS NOT available */
  }
})(window);
/*
  注：Chrome 从版本 50 以后仅允许通过 HTTPS 来调用 Geolocation API
*/
