const app = Vue.createApp({el: '#app'});
app.component('menu-nav', {
    template: `
    <ul id="nav">
      <li class="slide1"></li>
      <li class="slide2"></li>
      <li><a href="../AlarmClock/alarm_clock.html">闹钟</a></li>
      <li><a href="../world_clock/worldclock.html">世界时钟</a></li>
      <li><a href="../StopWatch/stop_watch.html">秒表</a></li>
      <li><a href="../Timer/timer.html">计时器</a></li>
      <li><a href="../Calender/calendar_lunar.html">日历</a></li>
    </ul>
    `,
})
app.mount('#app')


$("#nav a").on("click", function () {
    // 阻止默认的跳转行为
    event.preventDefault();
    // 获取点击的链接的href属性
    var href = $(this).attr("href");
    // 设置一个延迟，让动画播放完毕后再跳转
    setTimeout(function () {
      // 改变当前页面的URL，实现跳转
      window.location.href = href;
    }, 150); // 延迟的毫秒数，可以根据你的动画的持续时间来调整
  var position = $(this).parent().position();
  var width = $(this).parent().width();
  $("#nav .slide1").css({ opacity: 1, left: +position.left, width: width });
  // 保存当前点击的位置
  localStorage.setItem("current", $(this).parent().index()+1);
});
$("#nav a").on("mouseover", function () {
  var position = $(this).parent().position();
  var width = $(this).parent().width();
  $("#nav .slide2").css({ opacity: 1, left: +position.left, width: width }).addClass("squeeze");
});
$("#nav a").on("mouseout", function () {
  $("#nav .slide2").css({ opacity: 0 }).removeClass("squeeze");
});
// var currentWidth = $("#nav li:nth-of-type(3) a").parent("li").width();
// var current = $("li:nth-of-type(3) a").position();

// 从本地取出current的值，每次刷新网页都会更新current的值
var current = $("li:nth-of-type(" + localStorage.getItem("current") + ") a").position();
var currentWidth = $("#nav li:nth-of-type(" + localStorage.getItem("current") + ") a").parent("li").width();
// current = $("li:nth-of-type(3) a").position();
$("#nav .slide1").css({ left: +current.left, width: currentWidth });
// 根据网页宽度实时响应current的样式，而不是要等刷新网页才更改位置
$(window).resize(function () {
  var current = $("li:nth-of-type(" + localStorage.getItem("current") + ") a").position();
  var currentWidth = $("#nav li:nth-of-type(" + localStorage.getItem("current") + ") a").parent("li").width();
  $("#nav .slide1").css({ left: +current.left, width: currentWidth });
}
);