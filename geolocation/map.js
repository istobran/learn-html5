// 实现使用百度地图API来定位（不使用 Geolocation）
(function(window) {
  // 百度地图API功能
  var geo = new BMap.GeolocationControl();    // 创建定位控件
  geo.addEventListener("locationSuccess", function(e) {
    console.log("经度："+e.point.lng+"，纬度："+e.point.lat+"，城市："+e.addressComponent.city);
    var map = new BMap.Map("baidumap");    // 创建Map实例
    map.centerAndZoom(e.point, 12);  // 初始化地图,设置中心点坐标和地图级别
  	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
  	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.setCurrentCity(e.addressComponent.city);
    map.addOverlay(new BMap.Marker(e.point));
  });
  geo.location();   //开始定位
})(window);
